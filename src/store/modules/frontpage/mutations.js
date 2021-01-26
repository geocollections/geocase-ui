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
    state.mapResults[payload.id].numFound = payload.numFound;
  }
};

export default mutations;