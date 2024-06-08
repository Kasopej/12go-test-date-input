export default defineNuxtConfig({
    modules: [
        '@nuxt/test-utils/module'
    ],
    typescript: {
        tsConfig: {
            compilerOptions: {
                types: ['vitest/globals']
            }
        }
    }
})