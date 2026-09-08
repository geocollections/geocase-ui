import { computed } from "vue";
import { useRoute, useRouter } from "#imports";
import i18n from "@/i18n";
import { useSettingsStore } from "@/stores/settings";

type Language = "en" | "ee" | "de";

export function useAppNavigation() {
  const route = useRoute();
  const router = useRouter();
  const settings = useSettingsStore();
  const language = computed(() => i18n.locale.value);
  const localePath = (path: string) =>
    language.value === "en"
      ? path
      : `/${language.value}${path === "/" ? "" : path}`;
  async function changeLanguage(value: Language) {
    i18n.locale.value = value;
    settings.updateLanguage(value);
    await router.replace({
      name: route.name!,
      params: { ...route.params, locale: value === "en" ? "" : value },
      query: route.query,
      hash: route.hash,
    });
  }
  return { language, localePath, changeLanguage };
}
