<template>
  <main>
    <form ref="formElement" class="date-input-section" @submit.prevent="onFormSubmit">
      <DateInput v-model="date" />
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
const date = ref<string>('')

function onFormSubmit(evt: Event) {
  evt.preventDefault()
  assertTarget(evt, HTMLFormElement)
  const form = evt.target
  const controls = form.elements

  // here we do some simple validation checks.. just log to console
  for (const control of controls) {
    if (control instanceof HTMLInputElement) {
      if (control.dataset.error?.length) {
        report(`error: ${control.dataset.error}`)
        return
      }
    }
  }
  report('form is valid!')
}
</script>

<style scoped>
main {
  width: 100%;
}
.date-input-section {
  width: max-content;
  padding: 40px;
  margin: 100px auto;
  border: 1px solid gray;
}

button[type='submit'] {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  cursor: pointer;
  background: blanchedalmond;
  color: black;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
