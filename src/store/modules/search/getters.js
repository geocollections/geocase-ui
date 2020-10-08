const getters = {
  getCheckboxes: state => field => {
    if (field === "highertaxon_checkbox") return state.highertaxon;
    else return state[field];
  },

  getCheckboxesCount: state => field => {
    if (field === "highertaxon_checkbox") return state.highertaxon_count;
    else return state[`${field}_count`];
  },

  filteredSearchFields: state => {
    return state.searchFields.filter(item => item.field !== "q");
  }
};

export default getters;
