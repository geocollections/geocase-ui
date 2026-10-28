import { i18nPlugin } from "@/i18n";
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(i18nPlugin);
});
