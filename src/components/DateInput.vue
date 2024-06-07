<template>
  <label class="input-wrapper">
    <!-- native validation with pattern since no 3rd party libs allowed -->
    <input
      :class="{ invalid: dateIsInvalid }"
      v-model="inputModel"
      :pattern="inputPattern"
      :placeholder="inputFormat"
      @beforeinput="onBeforeInput"
    />
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

interface Props {
  modelValue: string
}
interface Emits {
  (e: 'update:modelValue', value: string): void
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()

type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY'
const inputPattern = ref<string>(`^([0-9]{2})/([0-9]{2})/([0-9]{4})$`)

const inputModel = computed({
  get() {
    return dayjs(props.modelValue, recognizedDateFormats, true).format(inputFormat.value)
  },
  set(value: string) {
    emits('update:modelValue', value)
  }
})
const locale = ref<string>('en-US')
const inputFormat = computed<DateFormat>(() => {
  return locale.value.toLowerCase() === 'en-us' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'
})
const recognizedDateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY']
const dateIsInvalid = computed(
  () => !!inputModel.value && !dayjs(inputModel.value, recognizedDateFormats, true).isValid()
)

function onBeforeInput(this: HTMLInputElement, evt: Event) {
  if (!evt.target || !(evt instanceof InputEvent)) return
  assertTarget(evt.target)
  const rawNewValue =
    evt.target.value.substring(0, evt.target.selectionStart ?? undefined) +
    (evt.data ?? '') +
    evt.target.value.substring(evt.target.selectionEnd ?? -1)
  const deletedCharIndex = !evt.data && evt.target.selectionEnd ? evt.target.selectionEnd - 1 : -1
  const cleanedValue = cleanInput(
    deletedCharIndex === -1
      ? rawNewValue
      : rawNewValue.substring(0, deletedCharIndex) + rawNewValue.substring(deletedCharIndex + 1)
  )
  evt.preventDefault()

  // TODO integrate date library for smart date parsing & formatting (Intl native library can output locale-specific formats accurately, but can only parse date objects not strings)
  // TODO done

  const possiblyValidDate = dayjs(cleanedValue, recognizedDateFormats, true)
  console.log('parsed', possiblyValidDate)
  evt.target.value = possiblyValidDate?.isValid()
    ? possiblyValidDate.format(inputFormat.value)
    : cleanedValue
  evt.target.dispatchEvent(new InputEvent('input'))
}

function assertTarget(target: EventTarget): asserts target is HTMLInputElement {
  if (!(target instanceof HTMLInputElement)) {
    throw new Error('Target must be an HTMLInputElement')
  }
}

function cleanInput(value: string) {
  const numbersOnly = value.replace(/[^0-9]/g, '')
  const chunk1 = numbersOnly.slice(0, 2)
  const chunk2 = numbersOnly.slice(2, 4)
  const chunk3 = numbersOnly.slice(4, 8)
  return `${chunk1 ? `${chunk1}/` : ''}${chunk2 ? `${chunk2}/` : ''}${chunk3}`
}

onMounted(() => {
  locale.value = navigator.language
})
</script>

<style scoped>
/* no sass to reduce dependencies of assignment since styling is minimal */
.input-wrapper {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
}
.input-wrapper input {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
}
input:invalid,
input.invalid {
  border: 1px solid red;
}
</style>
