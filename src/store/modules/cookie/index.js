const state = {
  cookieLaw: true,
};

const actions = {
  closeCookieLaw({ commit }) {
    commit("UPDATE_COOKIE_LAW", false);
  },
};

const mutations = {
  UPDATE_COOKIE_LAW(state, bool) {
    state.cookieLaw = bool;
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
