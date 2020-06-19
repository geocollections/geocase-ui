import { cloneDeep } from "lodash";

const mutations = {
  UPDATE_RESPONSE(state, payload) {
    state.response = cloneDeep(payload);
  },

  UPDATE_IMAGE_WIDTH(state, payload) {
    state.imageWidth = payload;
  }
};

export default mutations;
