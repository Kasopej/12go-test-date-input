import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    root: fileURLToPath(new URL('./', import.meta.url)),
  }
})
