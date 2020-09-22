import SearchService from "@/middleware/SearchService";

const state = {
  records: "1 110 026",
  providername: "9",
  providercountry: "4",
  cards: [
    {
      title: "Fossils",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      button: "View Fossils",
      url:
        '/search?recordbasis="FossileSpecimen" OR "FossilSpecimen" OR "RecentPreservedSpecimen" OR "fossil"',
      image: require("@/assets/front_page/fossil.png")
    },
    {
      title: "Minerals",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      button: "View Minerals",
      url: '/search?recordbasis="MineralSpecimen"',
      image: require("@/assets/front_page/mineral_2.png")
    },
    {
      title: "Rocks",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      button: "View Rocks",
      url:
        '/search?recordbasis="RockSpecimen" OR "SedimentSample" OR "TechnologicalSample"',
      image: require("@/assets/front_page/rock.png")
    },
    {
      title: "Meteorites",
      text:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      button: "View Meteorites",
      url: '/search?recordbasis="RockSpecimen"',
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
