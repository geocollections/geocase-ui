import i18n from "@/i18n";
import { useSettingsStore } from "@/stores/settings";

type Language = "en" | "ee" | "de";

export default defineNuxtRouteMiddleware((to) => {
  const settings = useSettingsStore();
  const routeLocale = to.params.locale;
  const locale =
    (Array.isArray(routeLocale) ? routeLocale[0] : routeLocale) ||
    settings.language ||
    "en";
  if (!["en", "ee", "de"].includes(locale)) return abortNavigation();
  const language = locale as Language;
  i18n.locale.value = language;
  settings.language = language;
  if (!routeLocale && language !== "en")
    return navigateTo(`/${language}${to.fullPath}`, { replace: true });
});
