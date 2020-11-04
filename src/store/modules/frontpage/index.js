import SearchService from "@/middleware/SearchService";

const state = {
  records: "1 091 666",
  datasetowner: "11",
  country: "159",
  cards: [
    {
      title: "Fossils",
      text:
        "Fossils are remains or traces of once lived organisms. They include bones, shells, burrows, and occasionally mineralised soft bodies.",
      button: "View Fossils",
      url:
        '/search?recordbasis=("FossileSpecimen" "FossilSpecimen" "RecentPreservedSpecimen" "fossil")',
      image: require("@/assets/front_page/fossil1.jpg")
    },
    {
      title: "Minerals",
      text:
        "Minerals have certain chemical composition and crystal structure. They are the basic building blocks of all rocks.",
      button: "View Minerals",
      url: '/search?recordbasis="MineralSpecimen"',
      image: require("@/assets/front_page/mineral1.jpg")
    },
    {
      title: "Rocks",
      text:
        "Rocks and sediments make up solid Earth. They may be magmatic, sedimentary or metamorphic.",
      button: "View Rocks",
      url:
        '/search?recordbasis=("RockSpecimen" "SedimentSample" "TechnologicalSample")',
      image: require("@/assets/front_page/rock1.jpg")
    },
    {
      title: "Meteorites",
      text:
        "Meteorites are space rocks that have fallen on Earth. They are composed of the same minerals as earthly rocks.",
      button: "View Meteorites",
      url: '/search?recordbasis="MeteoriteSpecimen"',
      image: require("@/assets/front_page/meteorite1.jpg")
    }
  ],
  showAlert: true
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
        `<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  },

  hideAlert({ commit }) {
    commit("HIDE_ALERT");
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
  }
};

const getters = {
  stats: state => {
    return [
      {
        text: "Total Records",
        count: state.records.toLocaleString()
      },
      {
        text: "Number of Institutions",
        count: state.datasetowner.toLocaleString()
      },
      {
        text: "Countries with data",
        count: state.country.toLocaleString()
      }
    ];
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
