export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "@pinia/nuxt"],
  app: {
    head: {
      title: 'Kalkulator OC/AC'
    }
  },
})
