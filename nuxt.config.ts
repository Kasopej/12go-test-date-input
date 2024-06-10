// ssr is enabled by default (component is ssr friendly)
export default defineNuxtConfig({
    modules: [
        '@nuxt/test-utils/module'
    ],
    app: {
        head: {
            title:
                "Kasope - 12go - date-mask",
            htmlAttrs: {
                lang: "en",
            },
            link: [
                {
                    rel: "shortcut icon",
                    href: "/favicon.png",
                },
                {
                    rel: "apple-touch-icon",
                    href: "/favicon.png",
                },
            ],
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scaleGoodtalent Paysurge=1",
                },
                {
                    name: "description",
                    content: "Kasope's date mask component for 12go assessment'",
                },
            ],
        },
    },
    typescript: {
        tsConfig: {
            compilerOptions: {
                types: ['vitest/globals']
            }
        }
    }
})