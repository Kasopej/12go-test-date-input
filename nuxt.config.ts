export default defineNuxtConfig({
    typescript: {
        references: [
            {
                "path": "./tsconfig.node.json"
            },
            {
                "path": "./tsconfig.app.json"
            },
            {
                "path": "./tsconfig.vitest.json"
            }
        ]
    }
})