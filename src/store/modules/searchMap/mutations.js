const mutations = {
  UPDATE_RESPONSE_RESULTS(state, payload) {
    state.mapResults = payload;
  },

  UPDATE_RESPONSE_RESULTS_COUNT(state, payload) {
    state.mapResultsCount = payload;
  },

  SET_LOADING(state, loadingState) {
    state.isLoading = loadingState;
  }
};

export default mutations;