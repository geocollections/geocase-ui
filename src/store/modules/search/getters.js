const getters = {
  getCheckboxes: state => (id, showCheckboxes, showMore) => {
    if (showCheckboxes) {
      let field = id === "highertaxon_checkbox" ? "highertaxon" : id;

      if (showMore) return state[field];
      else return state[field].slice(0, 4);
    } else return [];
  },

  getCheckboxesLength: state => id => {
    let field = id === "highertaxon_checkbox" ? "highertaxon" : id;
    if (state?.[field]) return state[field].length;
    else return 0;
  },

  getCheckboxesCount: state => field => {
    if (field === "highertaxon_checkbox") return state.highertaxon_count;
    else return state[`${field}_count`];
  }
};

export default getters;
