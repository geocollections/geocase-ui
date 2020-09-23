import SearchService from "@/middleware/SearchService";

const actions = {
  async getDetailView({ dispatch, commit, rootState }, id) {
    try {
      commit("UPDATE_IS_LOADING", true);
      const response = await SearchService.getDetailView(id);
      if (response) {
        commit("UPDATE_RESPONSE", response?.response?.docs || []);

        if (response.numFound === 0) {
          dispatch(
            "settings/updateErrorMessage",
            `Item with an ID: <b>${id}</b> was not found!`,
            { root: true }
          );
          if (!rootState.settings.error)
            dispatch("settings/updateErrorState", true, { root: true });
        }
        commit("UPDATE_IS_LOADING", false);
      }
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
      commit("UPDATE_IS_LOADING", false);
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
