<template>
  <main>
    <section class="date-input-section">
      <DateInput />
    </section>
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
  padding: 40px;
  margin: auto;
  border: 1px solid gray;
}
</style>
