// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    '*/...': {ssr: false},
  },
  modules: [
    '@nuxt/devtools',
    'nuxt-directus',
    '@pinia/nuxt',
  ],
  directus: {
    url: 'http://cms.silentparty-hannover.de/',
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  css: [
    '@/assets/style/main.scss',
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  }
})
