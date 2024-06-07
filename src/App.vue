<template>
  <main>
    <form @submit.prevent="null" class="date-input-section">
      <DateInput />
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </main>
</template>

<script setup lang="ts">
import DateInput from './components/DateInput.vue'
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
