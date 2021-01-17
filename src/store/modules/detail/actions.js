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
        `<b>Failed to item with an ID: ${id}!</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
      commit("UPDATE_IS_LOADING", false);
    }
  },

  async getDetailViewDataFromSource({ dispatch, commit, rootState }, url) {
    try {
      const response = await SearchService.getDetailViewDataFromSource(url);
      if (response?.data) {
        commit("UPDATE_RESPONSE_FROM_SOURCE", response?.data || []);
      } else {
        dispatch(
          "settings/updateInfoMessage",
          "Fetching data directly from source returned no results!",
          { root: true }
        );
        if (!rootState.settings.info)
          dispatch("settings/updateInfoState", true, { root: true });
      }
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Failed to fetch data directly from source!</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  },

  resetResponseFromSource({ commit }) {
    commit("UPDATE_RESPONSE_FROM_SOURCE", null);
  }
};

export default actions;
