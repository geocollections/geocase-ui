import SearchService from "@/middleware/SearchService";
import i18n from "@/i18n";
import MapService from "@/middleware/MapService";

const state = {
  records: "1 091 666",
  datasetowner: "11",
  country: "159",
  showAlert: true,
  cardIds: ["fossil", "mineral", "rock", "meteorite"],
  cards: {
    fossil: {
      url:
        '/search?recordbasis=("FossileSpecimen" "FossilSpecimen" "RecentPreservedSpecimen" "fossil")',
      image: require("@/assets/front_page/fossil1.jpg"),
      isLeaving: false
    },
    mineral: {
      url: '/search?recordbasis="MineralSpecimen"',
      image: require("@/assets/front_page/mineral1.jpg"),
      isLeaving: false
    },
    rock: {
      url:
        '/search?recordbasis=("RockSpecimen" "SedimentSample" "TechnologicalSample")',
      image: require("@/assets/front_page/rock1.jpg"),
      isLeaving: false
    },
    meteorite: {
      url: '/search?recordbasis="MeteoriteSpecimen"',
      image: require("@/assets/front_page/meteorite1.jpg"),
      isLeaving: false
    }
  },
  mapResults: {}
};

const actions = {
  async getStats({ dispatch, commit, rootState }) {
    try {
      let response = await SearchService.getStats();

      if (response)
        commit("SET_STATS", {
          records: response?.response?.numFound,
          facet_fields: response?.facet_counts?.facet_fields
        });
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Failed to fetch statistics</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  },

  hideAlert({ commit }) {
    commit("HIDE_ALERT");
  },

  updateCardIsLeaving({ commit }, payload) {
    commit("UPDATE_CARD_IS_LEAVING", payload);
  },

  async getLocalitySpecimens(
    { dispatch, commit, rootState, state },
    localityData
  ) {
    try {
      if (!state.mapResults?.[localityData.id])
        commit("INIT_MAP_RESULTS", localityData.id);
      let response = await SearchService.getAllSpecimensInProximity(
        localityData
      );

      if (response) {
        commit("UPDATE_MAP_RESPONSE_RESULTS", {
          docs: response?.response?.docs || [],
          id: localityData.id
        });
        commit("UPDATE_MAP_RESPONSE_RESULTS_COUNT", {
          numFound: response?.response?.numFound || 0,
          id: localityData.id
        });
      }

      console.log(response);
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Failed to fetch specimens in proximity</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  }
};

const mutations = {
  SET_STATS(state, payload) {
    if (payload?.records) state.records = payload.records;
    if (payload?.facet_fields) {
      Object.entries(payload.facet_fields).forEach(item => {
        state[item[0]] = item[1].filter(val => typeof val !== "string").length;
      });
    }
  },

  HIDE_ALERT(state) {
    state.showAlert = false;
  },

  UPDATE_CARD_IS_LEAVING(state, payload) {
    state.cards[payload.id].isLeaving = payload.isLeaving;
  },

  INIT_MAP_RESULTS(state, id) {
    state.mapResults = { ...state.mapResults, [id]: { numFound: 0, docs: [] } };
  },

  UPDATE_MAP_RESPONSE_RESULTS(state, payload) {
    state.mapResults[payload.id].docs = payload.docs;
  },

  UPDATE_MAP_RESPONSE_RESULTS_COUNT(state, payload) {
    console.log(payload);
    state.mapResults[payload.id].numFound = payload.numFound;
  }
};

const getters = {
  stats: state => {
    return [
      {
        text: i18n.t("frontPage.totalRecords"),
        count: state.records.toLocaleString(),
        id: 1
      },
      {
        text: i18n.t("frontPage.institutionCount"),
        count: state.datasetowner.toLocaleString(),
        id: 2
      },
      {
        text: i18n.t("frontPage.countryCount"),
        count: state.country.toLocaleString(),
        id: 3
      }
    ];
  },
  getCards: state => {
    return {
      fossil: {
        ...state.cards.fossil,
        title: i18n.t("frontPage.cards.fossils.title"),
        text: i18n.t("frontPage.cards.fossils.text"),
        button: i18n.t("frontPage.cards.fossils.button")
      },
      mineral: {
        ...state.cards.mineral,
        title: i18n.t("frontPage.cards.minerals.title"),
        text: i18n.t("frontPage.cards.minerals.text"),
        button: i18n.t("frontPage.cards.minerals.button")
      },
      rock: {
        ...state.cards.rock,
        title: i18n.t("frontPage.cards.rocks.title"),
        text: i18n.t("frontPage.cards.rocks.text"),
        button: i18n.t("frontPage.cards.rocks.button")
      },
      meteorite: {
        ...state.cards.meteorite,
        title: i18n.t("frontPage.cards.meteorites.title"),
        text: i18n.t("frontPage.cards.meteorites.text"),
        button: i18n.t("frontPage.cards.meteorites.button")
      }
    };
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
