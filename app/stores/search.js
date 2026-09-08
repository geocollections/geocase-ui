import { defineStore } from "pinia";
import SearchService from "@/services/SearchService";
import { useSettingsStore } from "./settings";
import i18n from "@/i18n";

export const useSearchStore = defineStore("search", {
  state: () => ({
    responseResults: [],
    responseResultsCount: 0,
    page: 1,
    paginateBy: 25,
    sortBy: [],
    sortDesc: [],
    search: {
      q: {
        id: "q",
        type: "text",
        lookUpType: "",
        value: null,
        label: "Find quickly",
      },
      fullscientificname: {
        id: "fullscientificname",
        type: "text",
        lookUpType: "contains",
        value: null,
        label: "Name",
      },
      highertaxon: {
        id: "highertaxon",
        type: "text",
        lookUpType: "contains",
        value: null,
        label: "Group",
      },
      stratigraphy: {
        id: "stratigraphy",
        type: "text",
        lookUpType: "contains",
        value: null,
        label: "Stratigraphy",
        fields: ["stratigraphies", "stratigraphytexts"],
      },
      locality: {
        id: "locality",
        type: "text",
        lookUpType: "contains",
        value: null,
        label: "Locality",
      },
      unitid: {
        id: "unitid",
        type: "text",
        lookUpType: "contains",
        value: null,
        label: "Object ID",
      },
      map: {
        id: "map",
        type: "map",
        lookUpType: "",
        value: null,
        label: "Map",
        showCheckboxes: false,
        fields: ["coordinates"],
      },
      recordbasis: {
        id: "recordbasis",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Specimen type",
        showCheckboxes: false,
        showMore: false,
      },
      highertaxon_facet: {
        id: "highertaxon_facet",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Group",
        showCheckboxes: false,
        showMore: false,
      },
      type_status: {
        id: "type_status",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Type status",
        showCheckboxes: false,
        showMore: false,
      },
      country: {
        id: "country",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Country",
        showCheckboxes: false,
        showMore: false,
      },
      datasetowner: {
        id: "datasetowner",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Dataset owner",
        showCheckboxes: false,
        showMore: false,
      },
      providername: {
        id: "providername",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Provider",
        showCheckboxes: false,
        showMore: false,
      },
      providercountry: {
        id: "providercountry",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Provider country",
        showCheckboxes: false,
        showMore: false,
      },
      has_image: {
        id: "has_image",
        type: "single_checkbox",
        lookUpType: "",
        value: null,
        label: "Show only data with images",
      },
      has_map: {
        id: "has_map",
        type: "single_checkbox",
        lookUpType: "",
        value: null,
        label: "Show only georeferenced data",
      },
    },
    searchIds: [
      "q",
      "fullscientificname",
      "highertaxon",
      "stratigraphy",
      "locality",
      "unitid",
      "map",
      "recordbasis",
      "highertaxon_facet",
      "type_status",
      "country",
      "datasetowner",
      "providername",
      "providercountry",
      "has_image",
      "has_map",
    ],
    searchTextIds: [
      "fullscientificname",
      "highertaxon",
      "stratigraphy",
      "locality",
      "unitid",
    ],
    searchCheckboxIds: [
      "recordbasis",
      "highertaxon_facet",
      "type_status",
      "country",
      "datasetowner",
      "providername",
      "providercountry",
    ],
    searchSingleCheckboxIds: ["has_image", "has_map"],
    lookUpTypes: [
      "contains",
      "equals",
      "starts with",
      "ends with",
      "does not contain",
      "greater than",
      "smaller than",
    ],
    recordbasis: [],
    highertaxon_facet: [],
    type_status: [],
    country: [],
    datasetowner: [],
    providername: [],
    providercountry: [],
    paginateByItems: [
      { text: "search.pagination", value: 10 },
      { text: "search.pagination", value: 25 },
      { text: "search.pagination", value: 50 },
      { text: "search.pagination", value: 100 },
      { text: "search.pagination", value: 250 },
      { text: "search.pagination", value: 500 },
      { text: "search.pagination", value: 1000 },
    ],
    searchParamsList: ["page", "paginate_by", "sort_by", "sort_desc"],
    allFieldNames: null,
    isLoading: false,
    tableHeaders: [
      {
        text: "empty",
        value: "icon",
        sortable: false,
        show: true,
        fixed: true,
      },
      {
        text: "collectioncode",
        value: "collectioncode",
        show: true,
        fixed: false,
      },
      { text: "unitid", value: "unitid", show: true, fixed: false },
      { text: "highertaxon", value: "highertaxon", show: true, fixed: false },
      {
        text: "fullscientificname",
        value: "fullscientificname",
        show: true,
        fixed: false,
      },
      { text: "country", value: "country", show: true, fixed: false },
      { text: "locality", value: "locality", show: true, fixed: false },
      {
        text: "stratigraphy",
        value: "stratigraphy",
        show: true,
        fixed: false,
        sortable: false,
        class: "sorting-disabled",
      },
      {
        text: "recordURI",
        value: "recordURI",
        align: "center",
        show: true,
        fixed: false,
      },
      { text: "url", value: "url", align: "center", show: true, fixed: false },
    ],
    isTableHeaderFixed: false,
  }),
  getters: {
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
          (field) => !NOT_NEEDED_FIELDS.includes(field),
        );
      } else return null;
    },

    getAllNonFixedTableHeaders: (state) => {
      return state.translatedTableHeaders.filter((item) => !item.fixed);
    },

    getAllShownTableHeaders: (state) => {
      return state.translatedTableHeaders.filter((item) => item.show);
    },

    translatedTableHeaders: (state) => {
      return state.tableHeaders.map((header) => {
        return {
          ...header,
          text: i18n.t(`search.table.${header.text}`),
          title: i18n.t(`search.table.${header.text}`),
          key: header.value,
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
  },
  actions: {
    UPDATE_RESPONSE_RESULTS(payload) {
      this.responseResults = payload;
    },

    UPDATE_RESPONSE_RESULTS_COUNT(payload) {
      this.responseResultsCount = payload;
    },

    UPDATE_PAGE(payload) {
      this.page = payload;
    },

    UPDATE_PAGINATE_BY(payload) {
      this.paginateBy = payload;
    },

    UPDATE_SORT_BY(payload) {
      this.sortBy = payload;
    },

    UPDATE_SORT_DESC(payload) {
      this.sortDesc = payload;
    },

    UPDATE_SEARCH_FIELD(payload) {
      if ("value" in payload) this.search[payload.id].value = payload.value;
      if ("lookUpType" in payload)
        this.search[payload.id].lookUpType = payload.lookUpType;
      if ("showCheckboxes" in payload)
        this.search[payload.id].showCheckboxes = payload.showCheckboxes;
      if ("showMore" in payload)
        this.search[payload.id].showMore = payload.showMore;
    },

    UPDATE_SEARCH_PARAM(payload) {
      let field = payload.field;
      if (field === "page" || field === "paginateBy") {
        if (payload.value) {
          let parsedInt = parseInt(payload.value);
          if (parsedInt && !isNaN(parsedInt) && this[field] !== parsedInt)
            this[field] = parsedInt;
        } else this[field] = field === "page" ? 1 : 25;
      } else if (field === "sortBy" || field === "sortDesc") {
        if (payload.value && payload.value.trim().length > 0) {
          let value = payload.value.split(",");
          if (field === "sortDesc")
            value = value.map((item) => item === "true");
          if (JSON.stringify(this[field]) !== JSON.stringify(value))
            this[field] = value;
        } else this[field] = [];
      }
    },

    UPDATE_FACETS(payload) {
      if (payload) {
        Object.entries(payload).forEach((item) => {
          let key = item[0];
          this[key] = item[1].filter((val) => typeof val === "string");
          this[`${key}_count`] = item[1].filter(
            (val) => typeof val !== "string",
          );
        });
      }
    },

    RESET_SEARCH() {
      this.searchIds.forEach((item) => {
        if (this.search[item].lookUpType !== "")
          this.search[item].lookUpType = "contains";
        if (this.search[item].value !== null) this.search[item].value = null;
      });
      this.page = 1;
      this.paginateBy = 25;
      this.sortBy = [];
      this.sortDesc = [];
    },

    SET_ALL_FIELD_NAMES(payload) {
      this.allFieldNames = payload.fields;
    },

    SET_ALL_TABLE_HEADERS(payload) {
      let defaultNonFixedTableHeaders = this.tableHeaders
        .filter((item) => !item.fixed)
        .map((item) => item.value);
      payload.fields.forEach((item) => {
        if (!defaultNonFixedTableHeaders.includes(item))
          this.tableHeaders.push({
            text: item,
            value: item,
            show: false,
            fixed: false,
          });
      });
    },

    SET_LOADING(loadingState) {
      this.isLoading = loadingState;
    },

    UPDATE_TABLE_HEADERS(headers) {
      this.tableHeaders.forEach((item, index) => {
        this.tableHeaders[index].show = !!headers.includes(item.value);
      });
    },

    UPDATE_TABLE_HEADER_FIXED_STATE(bool) {
      this.isTableHeaderFixed = bool;
    },
    updatePage(page) {
      this.UPDATE_PAGE(page);
    },

    updatePaginateBy(paginateBy) {
      if (this.page !== 1) this.updatePage(1);
      this.UPDATE_PAGINATE_BY(paginateBy);
    },

    updateSortBy(sortBy) {
      this.UPDATE_SORT_BY(sortBy);
    },

    updateSortDesc(sortDesc) {
      this.UPDATE_SORT_DESC(sortDesc);
    },

    updateSearchField(payload) {
      if (payload.id) {
        this.UPDATE_SEARCH_FIELD(payload);
      }
    },

    updateSearchParam(payload) {
      if (payload.field === "paginate_by") payload.field = "paginateBy";
      if (payload.field === "sort_by") payload.field = "sortBy";
      if (payload.field === "sort_desc") payload.field = "sortDesc";
      this.UPDATE_SEARCH_PARAM(payload);
    },

    resetSearch() {
      this.RESET_SEARCH();
    },

    async fetchResults() {
      this.SET_LOADING(true);

      try {
        let params = {
          page: this.page,
          paginateBy: this.paginateBy,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
          searchIds: this.searchIds,
          search: this.search,
        };
        let response = await SearchService.search(params);

        if (response) {
          this.UPDATE_FACETS(response?.facet_counts?.facet_fields);
          this.UPDATE_RESPONSE_RESULTS(response?.response?.docs || []);
          this.UPDATE_RESPONSE_RESULTS_COUNT(response?.response?.numFound || 0);
        }
      } catch (err) {
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch search results!</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }

      this.SET_LOADING(false);
    },

    async getAllFieldNames() {
      try {
        let response = await SearchService.getAllFieldNames();

        if (response) {
          let fields = response.split(",");
          this.SET_ALL_FIELD_NAMES({ fields: fields });
          this.SET_ALL_TABLE_HEADERS({ fields: fields });
        }
      } catch (err) {
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch field names!</b><br /<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }
    },

    updateTableHeaders(payload) {
      this.UPDATE_TABLE_HEADERS(payload);
    },

    updateTableHeaderFixedState(payload) {
      this.UPDATE_TABLE_HEADER_FIXED_STATE(payload);
    },

    removeStratigraphyFromTableHeaders() {
      const headersWithoutStratigraphy = this.tableHeaders.reduce(
        (prev, curr) => {
          if (
            curr.value !== "stratigraphy" &&
            curr.show &&
            !prev.includes(curr.value)
          )
            prev.push(curr.value);
          return prev;
        },
        [],
      );
      this.UPDATE_TABLE_HEADERS(headersWithoutStratigraphy);
    },

    resetTableHeaders() {
      const initialTableHeaders = [
        "icon",
        "collectioncode",
        "unitid",
        "highertaxon",
        "fullscientificname",
        "country",
        "locality",
        "stratigraphy",
        "recordURI",
        "url",
      ];
      this.UPDATE_TABLE_HEADERS(initialTableHeaders);
    },
  },
});
