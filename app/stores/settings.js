import { defineStore } from "pinia";
import i18n from "@/i18n";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    error: false,
    errorMessage: "",
    info: false,
    infoMessage: "",
    searchDrawer: false,
    language: "en",
  }),
  getters: {
    externalResources: () => {
      return [
        {
          icon: "fa:fas fa-sitemap",
          text: i18n.t("resources.cetaf"),
          url: "http://cetaf.org",
        },
        {
          icon: "fa:fas fa-microscope",
          text: i18n.t("resources.dissco"),
          url: "http://www.dissco.eu",
        },
        {
          icon: "fa:fas fa-network-wired",
          text: i18n.t("resources.biocase"),
          url: "https://www.biocase.org/",
        },
        {
          icon: "fa:fas fa-leaf",
          text: i18n.t("resources.gbif"),
          url: "https://www.gbif.org/",
        },
        {
          icon: "fa:far fa-hand-paper",
          text: i18n.t("resources.abcd-efg"),
          url: "https://www.tdwg.org/community/esp/efg/",
        },
        {
          icon: "fa:fab fa-github",
          text: i18n.t("resources.geocase2-github"),
          url: "https://github.com/geocollections/geocase-ui",
        },
        {
          icon: "fa:fas fa-database",
          text: i18n.t("resources.geocase1"),
          url: "http://old.geocase.eu",
        },
        {
          icon: "fa:fas fa-laptop-code",
          text: i18n.t("resources.geocase-api"),
          url: "https://api.geocase.eu/",
        },
      ];
    },

    routes: () => {
      return [
        {
          text: i18n.t("header.home"),
          to: "/",
          name: "FrontPage",
          icon: "fa:fas fa-home",
          isStatic: false,
        },
        {
          text: i18n.t("header.search"),
          to: "/search",
          name: "Search",
          icon: "fa:fas fa-search",
          isStatic: false,
        },
        {
          text: i18n.t("header.about"),
          to: "/about",
          name: "About",
          icon: "fa:fas fa-info-circle",
          isStatic: true,
        },
        {
          text: i18n.t("header.access"),
          to: "/access",
          name: "Access",
          icon: "fa:fas fa-database",
          isStatic: true,
        },
        {
          text: i18n.t("header.tutorial"),
          to: "/tutorial",
          name: "Tutorial",
          icon: "fa:far fa-question-circle",
          isStatic: true,
        },
        {
          text: i18n.t("header.efg"),
          to: "/efg",
          name: "Efg",
          icon: "fa:fas fa-info-circle",
          isStatic: true,
        },
        {
          text: i18n.t("header.partners"),
          to: "/partners_and_providers",
          name: "Partners and providers",
          icon: "fa:far fa-handshake",
          isStatic: true,
        },
        {
          text: i18n.t("header.help"),
          to: "/help",
          name: "Help",
          icon: "fa:far fa-question-circle",
          isStatic: true,
        },
        {
          text: i18n.t("header.links"),
          to: "/links",
          name: "Links",
          icon: "fa:fas fa-link",
        },
      ];
    },

    staticPages: (state) => {
      return state.routes.filter((item) => item.isStatic);
    },
  },
  actions: {
    SET_ERROR_STATE(bool) {
      this.error = bool;
    },

    SET_ERROR_MESSAGE(message) {
      this.errorMessage = message;
    },

    SET_INFO_STATE(bool) {
      this.info = bool;
    },

    SET_INFO_MESSAGE(message) {
      this.infoMessage = message;
    },

    UPDATE_SEARCH_DRAWER_STATE(bool) {
      this.searchDrawer = bool;
    },

    UPDATE_LANGUAGE(language) {
      this.language = language;
    },
    updateErrorState(bool) {
      this.SET_ERROR_STATE(bool);
    },

    updateErrorMessage(message) {
      this.SET_ERROR_MESSAGE(message);
    },

    updateInfoState(bool) {
      this.SET_INFO_STATE(bool);
    },

    updateInfoMessage(message) {
      this.SET_INFO_MESSAGE(message);
    },

    updateSearchDrawerState(bool) {
      if (this.searchDrawer !== bool) this.UPDATE_SEARCH_DRAWER_STATE(bool);
    },

    updateLanguage(language) {
      this.UPDATE_LANGUAGE(language);
    },
  },
});
