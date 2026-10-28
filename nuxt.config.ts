export default defineNuxtConfig({
  compatibilityDate: "2026-09-07",
  ssr: false,
  imports: {
    presets: [{ from: "vue-i18n", imports: ["useI18n"] }],
  },
  vite: {
    optimizeDeps: { exclude: ["maplibre-gl"] },
  },
  modules: ["@pinia/nuxt", "@nuxt/ui", "@nuxt/image", "@nuxt/eslint"],
  image: {
    domains: ["files.geocollections.info", "geocase.eu"],
    providers: {
      none: { provider: "none" },
    },
  },
  ui: { theme: { prefix: "tw" }, colorMode: false, fonts: false },
  components: [{ path: "~/components", pathPrefix: false }],
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.min.css",
    "@fortawesome/fontawesome-free/css/all.min.css",
    "animate.css",
    "izitoast/dist/css/iziToast.min.css",
    "~/assets/css/tailwind.css",
  ],
  runtimeConfig: { institutionCatalogUrl: "https://geocase.geocollections.info/dcat/institutions.json", apiBase: "https://api.geocase.eu", datasetCatalogUrl: "https://geocase.eu/dcat/datasets.json" },
  app: {
    head: { title: "Welcome", link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=purple" }, { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }] },
  },
  devtools: { enabled: false },
});
