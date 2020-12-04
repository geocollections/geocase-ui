import store from "@/store";
import VueI18n from "vue-i18n";
import Vue from "vue";

Vue.use(VueI18n);

const messages = {
  en: require("./translations/en"),
  ee: require("./translations/ee"),
  de: require("./translations/de")
};

// Gets preferred language from store (fallback is en)
const lang = store?.state?.settings?.language || "en";

// Translation settings
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: "en",
  silentTranslationWarn: process.env.NODE_ENV === "production",
  messages
});

export default i18n;
