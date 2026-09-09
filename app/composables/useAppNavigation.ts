import { computed } from "vue";
import { useRoute, useRouter } from "#imports";
import i18n from "@/i18n";
import { useSettingsStore } from "@/stores/settings";

export const navigationVisibility: Record<string, { header: string; drawer: string }> = {
  "/": { header: "", drawer: "tw:hidden" },
  "/search": {
    header: "tw:hidden tw:min-[600px]:inline-flex",
    drawer: "tw:min-[600px]:hidden",
  },
  "/help": {
    header: "tw:hidden tw:min-[600px]:inline-flex",
    drawer: "tw:min-[600px]:hidden",
  },
  "/about": {
    header: "tw:hidden tw:min-[1280px]:inline-flex",
    drawer: "tw:min-[1280px]:hidden",
  },
  "/access": {
    header: "tw:hidden tw:min-[1280px]:inline-flex",
    drawer: "tw:min-[1280px]:hidden",
  },
  "/partners_and_providers": {
    header: "tw:hidden tw:min-[1280px]:inline-flex",
    drawer: "tw:min-[1280px]:hidden",
  },
};

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
