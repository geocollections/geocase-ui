import i18n from "@/i18n";
import { useSettingsStore } from "@/stores/settings";
export default defineNuxtRouteMiddleware((to) => {
  const settings = useSettingsStore();
  const locale = to.params.locale || settings.language || "en";
  if (!["en", "ee", "de"].includes(locale)) return abortNavigation();
  i18n.locale.value = locale;
  settings.language = locale;
  if (!to.params.locale && locale !== "en")
    return navigateTo(`/${locale}${to.fullPath}`, { replace: true });
});
