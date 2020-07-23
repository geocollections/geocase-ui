const getters = {
  getCheckboxes: state => field => {
    if (field === "highertaxon_checkbox") return state.highertaxon;
    else return state[field];
  }
};

export default getters;
