import SearchService from "@/middleware/SearchService";

const state = {
  records: "1 110 026",
  providername: "9",
  providercountry: "4",
  cards: [
    {
      title: "Fossils",
      text:
        "Fossils are remains or traces of once lived organisms. They include bones, shells, burrows, and occasionally mineralised soft bodies.",
      button: "View Fossils",
      url:
        '/search?recordbasis="FossileSpecimen" OR "FossilSpecimen" OR "RecentPreservedSpecimen" OR "fossil"',
      image: require("@/assets/front_page/fossil.png")
    },
    {
      title: "Minerals",
      text:
        "Minerals have certain chemical composition and crystal structure. They are the basic building blocks of all rocks.",
      button: "View Minerals",
      url: '/search?recordbasis="MineralSpecimen"',
      image: require("@/assets/front_page/mineral_2.png")
    },
    {
      title: "Rocks",
      text:
        "Short information about rocks and sediments.",
      button: "Rocks and sediments make up solid Earth. They may be magmatic, sedimentary or metamorphic.",
      url:
        '/search?recordbasis="RockSpecimen" OR "SedimentSample" OR "TechnologicalSample"',
      image: require("@/assets/front_page/rock.png")
    },
    {
      title: "Meteorites",
      text:
        "Meteorites are space rocks that have fallen on Earth. They are composed of same minerals as earthly rocks.",
      button: "View Meteorites",
      url: '/search?recordbasis="MeteoriteSpecimen"',
      image: require("@/assets/front_page/meteorite_1.png")
    }
  ]
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
        text: "Number of Providers",
        count: state.providername.toLocaleString()
      },
      {
        text: "Provider Countries",
        count: state.providercountry.toLocaleString()
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
