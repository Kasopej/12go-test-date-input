<template>
  <label class="input-wrapper">
    Enter date:
    <!-- native validation with pattern since no 3rd party libs allowed -->
    <input
      ref="inputElement"
      :class="{ invalid: dateIsInvalid }"
      v-model="inputModel"
      :pattern="inputPattern"
      :placeholder="inputFormat"
      data-testid="date-input"
      data-input-slot="_"
      data-error=""
      @beforeinput="onBeforeInput"
    />
    <span class="mask-text">{{ inputFormat }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { assertTarget } from '@/utils'
dayjs.extend(customParseFormat)

interface Props {
  modelValue: string
}
interface Emits {
  (e: 'update:modelValue', value: string): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const inputElement = ref<HTMLInputElement | null>(null)

type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY'
const inputPattern = ref<string>(`^([0-9]{2})/([0-9]{2})/([0-9]{4})$`)

const inputModel = computed({
  get() {
    const possiblyValidReceivedValue = dayjs(
      props.modelValue || inputMask,
      recognizedDateFormats,
      true
    )
    return possiblyValidReceivedValue.isValid()
      ? possiblyValidReceivedValue.format(inputFormat.value)
      : props.modelValue || inputMask
  },
  set(value: string) {
    emits('update:modelValue', value)
  }
})
const locale = ref<string>('en-US')
const inputMask = '__/__/____'
const inputFormat = computed<DateFormat>(() => {
  return locale.value.toLowerCase() === 'en-us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'
})

// array of formats for auto-fixing if user enters in wrong format
const recognizedDateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY']
const dateIsInvalid = computed(
  () => !!inputModel.value && !dayjs(inputModel.value, recognizedDateFormats, true).isValid()
)
watch(dateIsInvalid, (invalid) => {
  // here we use data attributes.. will be used by parent form for validation
  if (inputElement.value) inputElement.value.dataset.error = invalid ? 'date not valid' : ''
})

function onBeforeInput(this: HTMLInputElement, evt: Event) {
  if (!evt.target || !(evt instanceof InputEvent)) return
  assertTarget(evt, HTMLInputElement)

  const cursorStart = Number(evt.target.selectionStart)
  const cursorEnd = Number(evt.target.selectionEnd)

  // break down the input for formatting
  const inputSlotPattern = evt.target.dataset?.['inputSlot'] ?? '_'
  const valueSegmentLeft = evt.target.value.slice(0, evt.data ? cursorStart : cursorStart - 1)
  const valueSegmentRight = evt.target.value.slice(evt.data ? cursorEnd + 1 : cursorEnd)
  const change = evt.data ?? ' '
  const formattedRawInput = formatWithMask({
    value: `${valueSegmentLeft}${change}${valueSegmentRight}`,
    mask: inputMask,
    inputSlotPattern
  })
  evt.preventDefault()

  // use date library for smart date parsing & formatting (Intl native library can output locale-specific formats accurately, but can only parse date objects not strings)
  evt.target.value = formatOutput(formattedRawInput)
  evt.target.dispatchEvent(new InputEvent('input'))

  nextTick().then(() => {
    const newCusorStart = evt.data ? cursorStart + 1 : cursorStart - 1
    const newCusorEnd = evt.data ? cursorEnd + 1 : cursorEnd - 1
    evt.target.setSelectionRange(newCusorStart, newCusorEnd)
  })
}

function formatWithMask(params: {
  value: string
  mask: string
  inputSlotPattern: string
  regex?: RegExp
}): string {
  const { value, mask, inputSlotPattern, regex = /^\d{1}$/ } = params
  console.log('before mask', value)

  const valueAsArray = value.split('')
  valueAsArray.length = mask.length //remove trailing values
  const replacedValuesArray = []
  for (let i = 0; i < valueAsArray.length; i++) {
    const item = valueAsArray[i]
    const maskChar = mask[i]
    const replacedValue =
      maskChar !== inputSlotPattern ? maskChar : regex.test(item) ? item : inputSlotPattern
    replacedValuesArray.push(replacedValue)
  }
  const replacedValuesAsString = replacedValuesArray.join('')
  return replacedValuesAsString
}

// this can possiibly be refactored as a prop for custom final output formatting if other value types need support (e.g currencies etc)
function formatOutput(value: string): string {
  const possiblyValidDate = dayjs(value, recognizedDateFormats, true)
  return possiblyValidDate.isValid() ? possiblyValidDate.format(inputFormat.value) : value
}

onMounted(() => {
  // replace default locale with actual client locale
  locale.value = navigator.language
})

defineExpose({
  // expose non-writable computed for outside checking
  dateIsInvalid
})
</script>

<style scoped>
/* no sass to reduce dependencies of assignment since styling is minimal */
.input-wrapper {
  position: relative;
  width: 120px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.input-wrapper input {
  width: 100%;
  height: 100%;
  padding: 5px;
  display: block;
  border-radius: 4px;
  border: 1px solid gray;
  outline: none;
}
input:invalid,
input.invalid {
  border: 1px solid red;
}

.input-wrapper .mask-text {
  position: absolute;
  bottom: -16px;
  left: 0;
  margin-top: 16px;
  color: gray;
  font-size: 12px;
}
</style>
