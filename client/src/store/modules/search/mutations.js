import { cloneDeep } from "lodash";

const mutations = {
  UPDATE_RESPONSE_RESULTS(state, payload) {
    state.responseResults = payload;
  },

  UPDATE_RESPONSE_RESULTS_COUNT(state, payload) {
    state.responseResultsCount = payload;
  },

  UPDATE_PAGE(state, payload) {
    state.page = payload;
  },

  UPDATE_PAGINATE_BY(state, payload) {
    state.paginateBy = payload;
  },

  UPDATE_SORT_BY(state, payload) {
    state.sortBy = payload;
  },

  UPDATE_SORT_DESC(state, payload) {
    state.sortDesc = payload;
  },

  UPDATE_SEARCH_FIELD(state, payload) {
    let clonedSearchFields = cloneDeep(state.searchFields);
    let currentItemIndex = -1;

    let currentItem = clonedSearchFields.find((item, index) => {
      if (item.field === payload.field) {
        currentItemIndex = index;
        return true;
      } else return false;
    });

    if (currentItemIndex !== -1 && currentItem) {
      clonedSearchFields[currentItemIndex] = {
        ...currentItem,
        ...payload
      };
    }

    state.searchFields = clonedSearchFields;
  },

  UPDATE_SEARCH_PARAM(state, payload) {
    if (payload.field === "page" || payload.field === "paginate_by") {
      let field = payload.field === "paginate_by" ? "paginateBy" : "page";
      if (payload.value) {
        let parsedInt = parseInt(payload.value);
        if (parsedInt && !isNaN(parsedInt)) state[field] = parsedInt;
      } else state[field] = field === "page" ? 1 : 50;
    } else if (payload.field === "sort_by" || payload.field === "sort_desc") {
      let field = payload.field === "sort_by" ? "sortBy" : "sortDesc";
      if (payload.value && payload.value.trim().length > 0) {
        let value = payload.value.split(",");
        if (field === "sortDesc") value = value.map(item => item === "true");
        state[field] = value;
      } else state[field] = [];
    }
  },

  RESET_SEARCH_FIELDS(state) {
    state.searchFields.forEach(item => {
      if (item.field === "fastsearch") item.lookUpType = "";
      else item.lookUpType = "contains";
      item.value = null;
    });
  },

  RESET_SEARCH_PARAMS(state) {
    state.page = 1;
    state.paginateBy = 50;
    state.sortBy = ["fullscientificname"];
    state.sortDesc = [false];
  }
};

export default mutations;
