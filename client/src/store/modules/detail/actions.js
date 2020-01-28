import SearchService from "../../../middleware/SearchService";

const actions = {
  async getDetailView({ dispatch, commit, state }, id) {
    try {
      const response = await SearchService.getDetailView(id);
      if (typeof response !== "undefined" && response !== null) {
        commit("UPDATE_RESPONSE", response.response);

        if (response.numFound === 0) {
          commit(
            "UPDATE_ERROR_MESSAGE",
            `Item with an ID: <b>${id}</b> was not found!`
          );
          if (!state.showError) dispatch("updateShowError", true);
        }
      }
    } catch (err) {
      commit(
        "UPDATE_ERROR_MESSAGE",
        `<b>Status:</b> ${err.request.status}<br /><b>Status text:</b> ${err.request.statusText}`
      );
      if (!state.showError) dispatch("updateShowError", true);
    }
  },

  updateResponseFromSearch({ commit }, response) {
    commit("UPDATE_RESPONSE", response);
  },

  updateShowError({ commit }, errorState) {
    commit("UPDATE_SHOW_ERROR", errorState);
  },

  updateImageWidth({ commit }, width) {
    commit("UPDATE_IMAGE_WIDTH", width);
  }
};

export default actions;
