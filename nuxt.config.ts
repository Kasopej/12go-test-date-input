// ssr is enabled by default (component is ssr friendly)
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