export default defineNuxtConfig({
  compatibilityDate: "2026-09-07",
  ssr: false,
  vite: { optimizeDeps: { exclude: ["maplibre-gl"] } },
  modules: ["@pinia/nuxt"],
  components: [{ path: "~/components", pathPrefix: false }],
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.min.css",
    "@fortawesome/fontawesome-free/css/all.min.css",
    "animate.css",
    "izitoast/dist/css/iziToast.min.css",
    "~/assets/css/main.css",
  ],
  runtimeConfig: { apiBase: "https://api.geocase.eu" },
  app: {
    head: { title: "Welcome", link: [{ rel: "icon", href: "/favicon.ico" }] },
  },
  devtools: { enabled: false },
});
