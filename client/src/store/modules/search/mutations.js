import { cloneDeep } from "lodash";

const mutations = {
  UPDATE_DETAIL_SEARCH(state, payload) {
    state.detailSearch = cloneDeep(payload);
  },

  UPDATE_FAST_SEARCH(state, payload) {
    state.fastSearch = payload;
  },

  UPDATE_SEARCH_PARAMETERS(state, payload) {
    state.searchParameters = payload;
  },

  UPDATE_RESPONSE(state, payload) {
    state.response = cloneDeep(payload);
  }
};

export default mutations;
