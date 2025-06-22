import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en' 
      },
      title: 'My Awesome Nuxt App',
      meta: [
        { name: 'description', content: 'This is a great Nuxt app.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { charset: 'utf-8' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        // иконки разных размеров, если нужно:
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  css: [
    '~/assets/css/components.css',
    '~/assets/css/tailwind.css',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  nitro: {
    compressPublicAssets: true
  }
}) 