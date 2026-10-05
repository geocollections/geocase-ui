import { createI18n } from "vue-i18n";
import en from "./translations/en.json";
import ee from "./translations/ee.json";
import de from "./translations/de.json";

export const i18nPlugin = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
  messages: { en, ee, de },
});
export default i18nPlugin.global;
