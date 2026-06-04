
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", '@nuxt/ui', "@nuxt/icon"],
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/': { redirect: '/welcome' },
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/welcome', '/register']
    }
  }
});