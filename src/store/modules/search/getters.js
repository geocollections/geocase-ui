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
  },

  getActiveCheckboxesCount: state => field => {
    if (state.search[field].value) {
      return state.search[field].value.split("OR").length;
    } else return 0;
  },

  getAllFieldNamesForExport: state => {
    if (state.allFieldNames && state.allFieldNames.length > 0) {
      const NOT_NEEDED_FIELDS = [
        "acquiredFrom",
        "last_harvested_processing",
        "_version_"
      ];
      return state.allFieldNames.filter(
        field => !NOT_NEEDED_FIELDS.includes(field)
      );
    } else return null;
  },

  getAllNonFixedTableHeaders: state => {
    return state.tableHeaders.filter(item => !item.fixed);
  },

  getAllShownTableHeaders: state => {
    return state.tableHeaders.filter(item => item.show);
  }
};

export default getters;
