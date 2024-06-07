<template>
  <label class="input-wrapper">
    <input
      v-model="value"
      :pattern="String(inputPattern)"
      :placeholder="inputFormat"
      @beforeinput="onBeforeInput"
    />
  </label>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type DateFormat = 'DD-MM-YYYY' | 'MM-DD-YYYY'
const inputPattern = ref<RegExp>(
  /^(?:(?:(?:0[13578]|1[02])(\/)31)\1|(?:(?:0[1,3-9]|1[0-2])(\/)(?:29|30)\2))(?:(?:19|[2-9]\d)\d{2})$|^(?:02(\/)29\3(?:(?:(?:19|20)(?:[02468][048]|[13579][26]))))$|^(?:(?:0[1-9])|(?:1[0-2]))(\/)(?:0[1-9]|1\d|2[0-8])\4(?:(?:19|[0-9]\d)?\d{2})$/
)

const value = ref<string>('')
const locale = ref<string>('en-US')
const inputFormat = computed<DateFormat>(() => {
  return locale.value.toLowerCase() === 'en-us' ? 'MM-DD-YYYY' : 'DD-MM-YYYY'
})

function onBeforeInput(this: HTMLInputElement, evt: Event) {
  if (!evt.target || !(evt instanceof InputEvent)) return
  console.log('data', evt.data)

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
  console.log(cleanedValue, '  ', deletedCharIndex)
  evt.preventDefault()
  evt.target.value = cleanedValue
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
.input-wrapper {
  width: 120px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
}
.input-wrapper input {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
}
</style>
