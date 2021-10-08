import SearchService from "@/middleware/SearchService";

const actions = {
  async getStats({ dispatch, commit, rootState }) {
    try {
      let response = await SearchService.getStats();

      if (response)
        commit("SET_STATS", {
          records: response?.response?.numFound,
          facet_fields: response?.facet_counts?.facet_fields
        });
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Failed to fetch statistics</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  },

  hideAlert({ commit }) {
    commit("HIDE_ALERT");
  },

  updateCardIsLeaving({ commit }, payload) {
    commit("UPDATE_CARD_IS_LEAVING", payload);
  },

  async getLocalitySpecimens(
    { dispatch, commit, rootState, state },
    localityData
  ) {
    try {
      if (!state.mapResults?.[localityData.id])
        commit("INIT_MAP_RESULTS", localityData.id);
      let response = await SearchService.getAllSpecimensInProximity(
        localityData
      );

      if (response) {
        commit("UPDATE_MAP_RESPONSE_RESULTS", {
          docs: response?.response?.docs || [],
          id: localityData.id
        });
        commit("UPDATE_MAP_RESPONSE_RESULTS_COUNT", {
          numFound: response?.response?.numFound || 0,
          id: localityData.id
        });
      }
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Failed to fetch specimens in proximity</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  }
};

export default actions;
