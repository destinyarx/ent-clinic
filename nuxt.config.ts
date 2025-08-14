// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module', 
    '@nuxtjs/supabase', 
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-api-shield'
  ],
  supabase: {
    redirect: false, 
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  vite: {
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        util: 'util/',
      },
    },
  },
  // router: {
  //   middleware: ['auth']
  // },
  primevue: {
    autoImport: true,
    options: {
        ripple: true,
        inputVariant: 'filled',
        theme: {
          preset: Aura,
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
  routeRules: {
    '/api/**': {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin':  process.env.NUXT_APP_ORIGIN,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  },
  nitro: {
    storage: {
      ratelimit: {
        driver: 'memory'
      },
    }
  },
  nuxtApiShield: {
    limit: {
      max: 12,        // maximum requests per duration time, default is 12/duration
      duration: 108,   // duration time in seconds, default is 108 seconds
      ban: 7200,      // ban time in seconds, default is 3600 seconds = 1 hour
      // If the request limit is exceeded, the user is banned for this period. During the ban, all requests are blocked with 429.
    },
    delayOnBan: true,  // delay every response with +1sec when the user is banned, default is true
    errorMessage: "Too Many Requests",  // error message when the user is banned, default is "Too Many Requests"
    retryAfterHeader: false, // when the user is banned add the Retry-After header to the response, default is false
    routes: ["/api"], // specify routes to apply rate limiting to, default is an empty array meaning all routes are protected.
  },
})