import i18n from "@/i18n";

const state = {
  error: false,
  errorMessage: "",
  info: false,
  infoMessage: "",
  searchDrawer: false,
  language: "en"
};

const actions = {
  updateErrorState({ commit }, bool) {
    commit("SET_ERROR_STATE", bool);
  },

  updateErrorMessage({ commit }, message) {
    commit("SET_ERROR_MESSAGE", message);
  },

  updateInfoState({ commit }, bool) {
    commit("SET_INFO_STATE", bool);
  },

  updateInfoMessage({ commit }, message) {
    commit("SET_INFO_MESSAGE", message);
  },

  updateSearchDrawerState({ commit, state }, bool) {
    if (state.searchDrawer !== bool) commit("UPDATE_SEARCH_DRAWER_STATE", bool);
  },

  updateLanguage({ commit }, language) {
    commit("UPDATE_LANGUAGE", language);
  }
};

const mutations = {
  SET_ERROR_STATE(state, bool) {
    state.error = bool;
  },

  SET_ERROR_MESSAGE(state, message) {
    state.errorMessage = message;
  },

  SET_INFO_STATE(state, bool) {
    state.info = bool;
  },

  SET_INFO_MESSAGE(state, message) {
    state.infoMessage = message;
  },

  UPDATE_SEARCH_DRAWER_STATE(state, bool) {
    // console.log("updating");
    state.searchDrawer = bool;
  },

  UPDATE_LANGUAGE(state, language) {
    state.language = language;
  }
};

const getters = {
  externalResources: () => {
    return [
      {
        icon: "fas fa-sitemap",
        text: i18n.t("resources.cetaf"),
        url: "http://cetaf.org"
      },
      {
        icon: "fas fa-microscope",
        text: i18n.t("resources.dissco"),
        url: "http://www.dissco.eu"
      },
      {
        icon: "fas fa-network-wired",
        text: i18n.t("resources.biocase"),
        url: "https://www.biocase.org/"
      },
      {
        icon: "fas fa-leaf",
        text: i18n.t("resources.gbif"),
        url: "https://www.gbif.org/"
      },
      {
        icon: "far fa-hand-paper",
        text: i18n.t("resources.abcd-efg"),
        url: "https://www.tdwg.org/community/esp/efg/"
      },
      {
        icon: "fab fa-github",
        text: i18n.t("resources.geocase2-github"),
        url: "https://github.com/geocollections/geocase-ui"
      },
      {
        icon: "fas fa-database",
        text: i18n.t("resources.geocase1"),
        url: "http://geocase.eu"
      },
      {
        icon: "fas fa-laptop-code",
        text: i18n.t("resources.geocase-api"),
        url: "http://geocase-api.geocollections.info/"
      }
    ];
  },

  routes: () => {
    return [
      {
        text: i18n.t("header.home"),
        to: "/",
        name: "FrontPage",
        icon: "fas fa-home",
        isStatic: false
      },
      {
        text: i18n.t("header.search"),
        to: "/search",
        name: "Search",
        icon: "fas fa-search",
        isStatic: false
      },
      {
        text: i18n.t("header.about"),
        to: "/about",
        name: "About",
        icon: "fas fa-info-circle",
        isStatic: true
      },
      {
        text: i18n.t("header.access"),
        to: "/access",
        name: "Access",
        icon: "fas fa-database",
        isStatic: true
      },
      {
        text: i18n.t("header.join"),
        to: "/join",
        name: "Join",
        icon: "fas fa-signature",
        isStatic: true
      },
      {
        text: i18n.t("header.tutorial"),
        to: "/tutorial",
        name: "Tutorial",
        icon: "far fa-question-circle",
        isStatic: true
      },
      {
        text: i18n.t("header.project"),
        to: "/project",
        name: "Project",
        icon: "fas fa-project-diagram",
        isStatic: true
      },
      {
        text: i18n.t("header.efg"),
        to: "/efg",
        name: "Efg",
        icon: "fas fa-info-circle",
        isStatic: true
      },
      {
        text: i18n.t("header.partners"),
        to: "/partners_and_providers",
        name: "Partners and providers",
        icon: "far fa-handshake",
        isStatic: true
      },
      {
        text: i18n.t("header.links"),
        to: "/links",
        name: "Links",
        icon: "fas fa-link"
      },
      {
        text: i18n.t("header.imprint"),
        to: "/imprint",
        name: "Imprint",
        icon: "fas fa-stamp",
        isStatic: true
      },
      {
        text: i18n.t("header.howto"),
        to: "/howto",
        name: "Howto",
        icon: "fas fa-info",
        isStatic: true
      }
    ];
  },

  staticPages: (state, getters) => {
    return getters.routes.filter(item => item.isStatic);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
