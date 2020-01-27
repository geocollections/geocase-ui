import { cloneDeep } from "lodash";

const mutations = {
  UPDATE_DETAIL_SEARCH(state, payload) {
    state.detailSearch = cloneDeep(payload);
  },

  UPDATE_FAST_SEARCH(state, payload) {
    state.fastSearch = payload;
  },

  UPDATE_SEARCH_PARAMETERS(state, payload) {
    state.searchParameters = cloneDeep(payload);
  },

  UPDATE_RESPONSE(state, payload) {
    state.response = cloneDeep(payload);
  },

  UPDATE_ERROR_MESSAGE(state, payload) {
    state.error = payload;
  },

  UPDATE_SNACKBAR(state, payload) {
    state.snackbar = payload;
  }
};

export default mutations;
