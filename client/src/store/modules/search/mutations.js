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

    const currentStringifiedSearchFields = JSON.stringify(
      cloneDeep(state.searchFields)
    );
    if (currentStringifiedSearchFields !== JSON.stringify(clonedSearchFields))
      state.searchFields = clonedSearchFields;
  },

  UPDATE_SEARCH_PARAM(state, payload) {
    if (payload.field === "page" || payload.field === "paginate_by") {
      let field = payload.field === "paginate_by" ? "paginateBy" : "page";
      if (payload.value) {
        let parsedInt = parseInt(payload.value);
        if (parsedInt && !isNaN(parsedInt) && state[field] !== parsedInt)
          state[field] = parsedInt;
      } else state[field] = field === "page" ? 1 : 50;
    } else if (payload.field === "sort_by" || payload.field === "sort_desc") {
      let field = payload.field === "sort_by" ? "sortBy" : "sortDesc";
      if (payload.value && payload.value.trim().length > 0) {
        let value = payload.value.split(",");
        if (field === "sortDesc") value = value.map(item => item === "true");
        if (JSON.stringify(state[field]) !== JSON.stringify(value))
          state[field] = value;
      } else state[field] = [];
    }
  },

  UPDATE_FACETS(state, payload) {
    if (payload) {
      Object.entries(payload).forEach(item => {
        let key = item[0];
        state[key] = item[1].filter(val => typeof val === "string");
        state[`${key}_count`] = item[1].filter(val => typeof val !== "string");
      });
    }
  },

  // field is either showCheckboxes or showMore
  UPDATE_SEARCH_FIELD_CHECKBOX_STATE(state, payload) {
    let item = state.searchFields.find(
      item => item.fieldType === "checkbox" && item.field === payload.findField
    );
    if (item) item[payload.changeField] = !item[payload.changeField];
  },

  RESET_SEARCH(state) {
    state.searchFields.forEach(item => {
      if (item.lookUpType !== "") item.lookUpType = "contains";
      if (item.value !== null) item.value = null;
    });
  }
};

export default mutations;
