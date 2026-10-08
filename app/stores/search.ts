import { defineStore } from "pinia";
import SearchService from "@/services/SearchService";
import { useSettingsStore } from "./settings";
import i18n from "@/i18n";

type SolrRecord = Record<string, any>;
type FacetValue = string | number;

interface SearchField {
  id: string;
  type: string;
  lookUpType: string;
  value: any;
  label: string;
  fields?: string[];
  showCheckboxes?: boolean;
  showMore?: boolean;
}

interface SearchFields extends Record<string, SearchField> {
  q: SearchField;
  datasourceurl: SearchField;
  fullscientificname: SearchField;
  highertaxon: SearchField;
  stratigraphy: SearchField;
  locality: SearchField;
  unitid: SearchField;
  map: SearchField;
  recordbasis: SearchField;
  highertaxon_facet: SearchField;
  type_status: SearchField;
  country: SearchField;
  datasetowner: SearchField;
  providername: SearchField;
  providercountry: SearchField;
  has_image: SearchField;
  has_map: SearchField;
}

interface TableHeader {
  text: string;
  value: string;
  show: boolean;
  fixed: boolean;
  sortable?: boolean;
  class?: string;
  align?: string;
}

interface SearchState {
  responseResults: SolrRecord[];
  responseResultsCount: number;
  page: number;
  paginateBy: number;
  sortBy: string[];
  sortDesc: boolean[];
  search: SearchFields;
  searchIds: string[];
  searchTextIds: string[];
  searchCheckboxIds: string[];
  searchSingleCheckboxIds: string[];
  lookUpTypes: string[];
  recordbasis: string[];
  highertaxon_facet: string[];
  type_status: string[];
  country: string[];
  datasetowner: string[];
  providername: string[];
  providercountry: string[];
  paginateByItems: { text: string; value: number }[];
  searchParamsList: string[];
  allFieldNames: string[] | null;
  isLoading: boolean;
  tableHeaders: TableHeader[];
  isTableHeaderFixed: boolean;
}

export const useSearchStore = defineStore("search", {
  state: (): SearchState => ({
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
      datasourceurl: {
        id: "datasourceurl",
        type: "text",
        lookUpType: "equals",
        value: null,
        label: "Data source URL",
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
        showCheckboxes: true,
        showMore: false,
      },
      highertaxon_facet: {
        id: "highertaxon_facet",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Group",
        showCheckboxes: true,
        showMore: false,
      },
      type_status: {
        id: "type_status",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Type status",
        showCheckboxes: true,
        showMore: false,
      },
      country: {
        id: "country",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Country",
        showCheckboxes: true,
        showMore: false,
      },
      datasetowner: {
        id: "datasetowner",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Dataset owner",
        showCheckboxes: true,
        showMore: false,
      },
      providername: {
        id: "providername",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Provider",
        showCheckboxes: true,
        showMore: false,
      },
      providercountry: {
        id: "providercountry",
        type: "checkbox",
        lookUpType: "",
        value: null,
        label: "Provider country",
        showCheckboxes: true,
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
      "datasourceurl",
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
    getCheckboxes:
      (state) =>
      (id: string, showCheckboxes: boolean, showMore: boolean | undefined) => {
        if (showCheckboxes) {
          const facets = state as unknown as Record<string, string[]>;
          if (showMore) return facets[id]!;
          else return facets[id]!.slice(0, 4);
        } else return [];
      },

    getCheckboxesLength: (state) => (id: string) => {
      const facets = state as unknown as Record<string, string[]>;
      if (facets[id]) return facets[id].length;
      else return 0;
    },

    getCheckboxesCount: (state) => (field: string) => {
      const facets = state as unknown as Record<string, number[]>;
      return facets[`${field}_count`]!;
    },

    getActiveCheckboxesCount: (state) => (field: string) => {
      const searchField = state.search[field];
      if (searchField?.value) {
        return searchField.value.split('" "').length;
      } else return 0;
    },

    getAllFieldNamesForExport: (state) => {
      const fieldNames = state.allFieldNames;
      if (fieldNames && fieldNames.length > 0) {
        const NOT_NEEDED_FIELDS = [
          "acquiredFrom",
          "last_harvested_processing",
          "_version_",
        ];
        return fieldNames.filter((field) => !NOT_NEEDED_FIELDS.includes(field));
      } else return null;
    },

    getAllNonFixedTableHeaders: (state) => {
      const getters = state as unknown as Record<string, any>;
      return getters.translatedTableHeaders.filter(
        (item: TableHeader) => !item.fixed,
      );
    },

    getAllShownTableHeaders: (state) => {
      const getters = state as unknown as Record<string, any>;
      return getters.translatedTableHeaders.filter(
        (item: TableHeader) => item.show,
      );
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
    UPDATE_RESPONSE_RESULTS(payload: SolrRecord[]) {
      this.responseResults = payload;
    },

    UPDATE_RESPONSE_RESULTS_COUNT(payload: number) {
      this.responseResultsCount = payload;
    },

    UPDATE_PAGE(payload: number) {
      this.page = payload;
    },

    UPDATE_PAGINATE_BY(payload: number) {
      this.paginateBy = payload;
    },

    UPDATE_SORT_BY(payload: string[]) {
      this.sortBy = payload;
    },

    UPDATE_SORT_DESC(payload: boolean[]) {
      this.sortDesc = payload;
    },

    UPDATE_SEARCH_FIELD(payload: {
      id: string;
      value?: any;
      lookUpType?: string;
      showCheckboxes?: boolean;
      showMore?: boolean;
    }) {
      const searchField = this.search[payload.id];
      if (!searchField) return;
      if ("value" in payload) searchField.value = payload.value;
      if ("lookUpType" in payload)
        searchField.lookUpType = payload.lookUpType as string;
      if ("showCheckboxes" in payload)
        searchField.showCheckboxes = payload.showCheckboxes as boolean;
      if ("showMore" in payload)
        searchField.showMore = payload.showMore as boolean;
    },

    UPDATE_SEARCH_PARAM(payload: { field: string; value: string }) {
      const field = payload.field;
      if (field === "page" || field === "paginateBy") {
        const currentValue = field === "page" ? this.page : this.paginateBy;
        if (payload.value) {
          const parsedInt = parseInt(payload.value);
          if (parsedInt && !isNaN(parsedInt) && currentValue !== parsedInt) {
            if (field === "page") this.page = parsedInt;
            else this.paginateBy = parsedInt;
          }
        } else if (field === "page") this.page = 1;
        else this.paginateBy = 25;
      } else if (field === "sortBy" || field === "sortDesc") {
        if (payload.value && payload.value.trim().length > 0) {
          const value =
            field === "sortDesc"
              ? payload.value.split(",").map((item) => item === "true")
              : payload.value.split(",");
          if (JSON.stringify(this[field]) !== JSON.stringify(value)) {
            if (field === "sortDesc") this.sortDesc = value as boolean[];
            else this.sortBy = value as string[];
          }
        } else if (field === "sortBy") this.sortBy = [];
        else this.sortDesc = [];
      }
    },

    UPDATE_FACETS(payload: Record<string, FacetValue[]> | undefined) {
      if (payload) {
        Object.entries(payload).forEach((item) => {
          const key = item[0];
          const dynamicState = this as unknown as Record<string, unknown>;
          dynamicState[key] = item[1].filter(
            (val): val is string => typeof val === "string",
          );
          dynamicState[`${key}_count`] = item[1].filter(
            (val): val is number => typeof val === "number",
          );
        });
      }
    },

    RESET_SEARCH() {
      this.searchIds.forEach((item) => {
        const searchField = this.search[item];
        if (!searchField) return;
        if (searchField.lookUpType !== "") searchField.lookUpType = "contains";
        if (searchField.value !== null) searchField.value = null;
      });
      this.page = 1;
      this.paginateBy = 25;
      this.sortBy = [];
      this.sortDesc = [];
    },

    SET_ALL_FIELD_NAMES(payload: { fields: string[] }) {
      this.allFieldNames = payload.fields;
    },

    SET_ALL_TABLE_HEADERS(payload: { fields: string[] }) {
      const defaultNonFixedTableHeaders = this.tableHeaders
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

    SET_LOADING(loadingState: boolean) {
      this.isLoading = loadingState;
    },

    UPDATE_TABLE_HEADERS(headers: string[]) {
      this.tableHeaders.forEach((item, index) => {
        this.tableHeaders[index]!.show = !!headers.includes(item.value);
      });
    },

    UPDATE_TABLE_HEADER_FIXED_STATE(bool: boolean) {
      this.isTableHeaderFixed = bool;
    },
    updatePage(page: number) {
      this.UPDATE_PAGE(page);
    },

    updatePaginateBy(paginateBy: number) {
      if (this.page !== 1) this.updatePage(1);
      this.UPDATE_PAGINATE_BY(paginateBy);
    },

    updateSortBy(sortBy: string[]) {
      this.UPDATE_SORT_BY(sortBy);
    },

    updateSortDesc(sortDesc: boolean[]) {
      this.UPDATE_SORT_DESC(sortDesc);
    },

    updateSearchField(payload: {
      id: string;
      value?: any;
      lookUpType?: string;
      showCheckboxes?: boolean;
      showMore?: boolean;
    }) {
      if (payload.id) {
        this.UPDATE_SEARCH_FIELD(payload);
      }
    },

    updateSearchParam(payload: { field: string; value: string }) {
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
        const params = {
          page: this.page,
          paginateBy: this.paginateBy,
          sortBy: this.sortBy,
          sortDesc: this.sortDesc,
          searchIds: this.searchIds,
          search: this.search,
        };
        const response = await SearchService.search(params);

        if (response) {
          this.UPDATE_FACETS(response?.facet_counts?.facet_fields);
          this.UPDATE_RESPONSE_RESULTS(response?.response?.docs || []);
          this.UPDATE_RESPONSE_RESULTS_COUNT(response?.response?.numFound || 0);
        }
      } catch (caught) {
        const err =
          caught instanceof Error ? caught : new Error(String(caught));
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
        const response = await SearchService.getAllFieldNames();

        if (response) {
          const fields = response.split(",");
          this.SET_ALL_FIELD_NAMES({ fields: fields });
          this.SET_ALL_TABLE_HEADERS({ fields: fields });
        }
      } catch (caught) {
        const err =
          caught instanceof Error ? caught : new Error(String(caught));
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch field names!</b><br /<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }
    },

    updateTableHeaders(payload: string[]) {
      this.UPDATE_TABLE_HEADERS(payload);
    },

    updateTableHeaderFixedState(payload: boolean) {
      this.UPDATE_TABLE_HEADER_FIXED_STATE(payload);
    },

    removeStratigraphyFromTableHeaders() {
      const headersWithoutStratigraphy = this.tableHeaders.reduce<string[]>(
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
