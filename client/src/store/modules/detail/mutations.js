import { cloneDeep } from "lodash";

const mutations = {
  UPDATE_RESPONSE(state, payload) {
    state.response = cloneDeep(payload);
  },

  UPDATE_ERROR_MESSAGE(state, payload) {
    state.error = payload;
  },

  UPDATE_SHOW_ERROR(state, payload) {
    state.showError = payload;
  },

  UPDATE_IMAGE_WIDTH(state, payload) {
    state.imageWidth = payload;
  }
};

export default mutations;
