const mutations = {
  UPDATE_RESPONSE(state, payload) {
    state.response = payload;
  },

  UPDATE_RESPONSE_FROM_SOURCE(state, payload) {
    state.responseFromSource = payload;
  },

  UPDATE_IS_LOADING(state, payload) {
    state.isLoading = payload;
  }
};

export default mutations;
