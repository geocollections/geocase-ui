import VueI18n from "vue-i18n";
import Vue from "vue";

Vue.use(VueI18n);

const messages = {
  en: require("./translations/en"),
  ee: require("./translations/ee"),
  de: require("./translations/de")
};

// Translation settings
const i18n = new VueI18n({
  fallbackLocale: "en",
  silentTranslationWarn: process.env.NODE_ENV === "production",
  messages
});

export default i18n;
