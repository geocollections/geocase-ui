import MapService from "@/middleware/MapService";

const actions = {
  async searchMapCoordinates({ dispatch, commit, rootState, state }) {
    commit("SET_LOADING", true);

    try {
      let response = await MapService.searchCoordinates();

      if (response) {
        commit("UPDATE_RESPONSE_RESULTS", response?.response?.features || []);
        commit(
          "UPDATE_RESPONSE_RESULTS_COUNT",
          response?.response?.numFound || 0
        );
      }
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Failed to fetch map coordinates!</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }

    commit("SET_LOADING", false);
  },
};

export default actions;
