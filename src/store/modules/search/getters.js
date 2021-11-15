import i18n from "@/i18n";
import { getField } from "vuex-map-fields";

const getters = {
  getField,

  getCheckboxes: (state) => (id, showCheckboxes, showMore) => {
    if (showCheckboxes) {
      if (showMore) return state[id];
      else return state[id].slice(0, 4);
    } else return [];
  },

  getCheckboxesLength: (state) => (id) => {
    if (state?.[id]) return state[id].length;
    else return 0;
  },

  getCheckboxesCount: (state) => (field) => {
    return state[`${field}_count`];
  },

  getActiveCheckboxesCount: (state) => (field) => {
    if (state.search[field].value) {
      return state.search[field].value.split('" "').length;
    } else return 0;
  },

  getAllFieldNamesForExport: (state) => {
    if (state.allFieldNames && state.allFieldNames.length > 0) {
      const NOT_NEEDED_FIELDS = [
        "acquiredFrom",
        "last_harvested_processing",
        "_version_",
      ];
      return state.allFieldNames.filter(
        (field) => !NOT_NEEDED_FIELDS.includes(field)
      );
    } else return null;
  },

  getAllNonFixedTableHeaders: (state, getters) => {
    return getters.translatedtableHeaders.filter((item) => !item.fixed);
  },

  getAllShownTableHeaders: (state, getters) => {
    return getters.translatedtableHeaders.filter((item) => item.show);
  },

  translatedtableHeaders: (state) => {
    return state.tableHeaders.map((header) => {
      return {
        ...header,
        text: i18n.t(`search.table.${header.text}`),
      };
    });
  },

  paginateByItemsTranslated: (state) => {
    return state.paginateByItems.map((item) => {
      return {
        ...item,
        text: i18n.t(item.text, { value: item.value }),
      };
    });
  },
};

export default getters;
