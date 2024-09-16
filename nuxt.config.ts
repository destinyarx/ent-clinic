// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
      '@primevue/nuxt-module'
  ],
  primevue: {
    autoImport: true,
    options: {
        ripple: true,
        inputVariant: 'filled',
        theme: {
          // preset: Aura,
          options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
          }
        }
      }
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
