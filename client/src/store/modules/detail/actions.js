import SearchService from "../../../middleware/SearchService";

const actions = {
  async getDetailView({ dispatch, commit, rootState }, id) {
    try {
      const response = await SearchService.getDetailView(id);
      if (response) {
        commit("UPDATE_RESPONSE", response.response);

        if (response.numFound === 0) {
          dispatch(
            "settings/updateErrorMessage",
            `Item with an ID: <b>${id}</b> was not found!`,
            { root: true }
          );
          if (!rootState.settings.error)
            dispatch("settings/updateErrorState", true, { root: true });
        }
      }
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  },

  updateResponseFromSearch({ commit }, response) {
    commit("UPDATE_RESPONSE", response);
  },

  updateImageWidth({ commit }, width) {
    commit("UPDATE_IMAGE_WIDTH", width);
  }
};

export default actions;
