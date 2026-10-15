import { defineStore } from "pinia";
import i18n from "@/i18n";

type Language = "en" | "ee" | "de";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    error: false,
    errorMessage: "",
    info: false,
    infoMessage: "",
    searchDrawer: false,
    language: "en" as Language,
  }),
  getters: {
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
          to: "/institution",
          name: "Institutions",
          icon: "fa:far fa-handshake",
          isStatic: true,
        },
        {
          text: i18n.t("datasetsPage.title"),
          to: "/dataset",
          name: "Dataset",
          icon: "fa:fas fa-database",
          isStatic: false,
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
      const routes = (state as unknown as Record<string, any>).routes;
      return routes.filter(
        (item: { isStatic?: boolean }) => "isStatic" in item && item.isStatic,
      );
    },
  },
  actions: {
    SET_ERROR_STATE(bool: boolean) {
      this.error = bool;
    },

    SET_ERROR_MESSAGE(message: string) {
      this.errorMessage = message;
    },

    SET_INFO_STATE(bool: boolean) {
      this.info = bool;
    },

    SET_INFO_MESSAGE(message: string) {
      this.infoMessage = message;
    },

    UPDATE_SEARCH_DRAWER_STATE(bool: boolean) {
      this.searchDrawer = bool;
    },

    UPDATE_LANGUAGE(language: Language) {
      this.language = language;
    },
    updateErrorState(bool: boolean) {
      this.SET_ERROR_STATE(bool);
    },

    updateErrorMessage(message: string) {
      this.SET_ERROR_MESSAGE(message);
    },

    updateInfoState(bool: boolean) {
      this.SET_INFO_STATE(bool);
    },

    updateInfoMessage(message: string) {
      this.SET_INFO_MESSAGE(message);
    },

    updateSearchDrawerState(bool: boolean) {
      if (this.searchDrawer !== bool) this.UPDATE_SEARCH_DRAWER_STATE(bool);
    },

    updateLanguage(language: Language) {
      this.UPDATE_LANGUAGE(language);
    },
  },
});
