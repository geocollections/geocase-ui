import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  responseResults: [],
  responseResultsCount: 0,
  page: 1,
  paginateBy: 50,
  sortBy: ["fullscientificname"],
  sortDesc: [false],
  search: {
    q: {
      id: "q",
      type: "text",
      lookUpType: "",
      value: null,
      label: "Find quickly"
    },
    fullscientificname: {
      id: "fullscientificname",
      type: "text",
      lookUpType: "contains",
      value: null,
      label: "Name"
    },
    highertaxon: {
      id: "highertaxon",
      type: "text",
      lookUpType: "contains",
      value: null,
      label: "Group"
    },
    stratigraphy: {
      id: "stratigraphy",
      type: "text",
      lookUpType: "contains",
      value: null,
      label: "Stratigraphy"
    },
    locality: {
      id: "locality",
      type: "text",
      lookUpType: "contains",
      value: null,
      label: "Locality"
    },
    collectioncode: {
      id: "collectioncode",
      type: "text",
      lookUpType: "contains",
      value: null,
      label: "Institution"
    },
    unitid: {
      id: "unitid",
      type: "text",
      lookUpType: "contains",
      value: null,
      label: "Object ID"
    },
    recordbasis: {
      id: "recordbasis",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Specimen type",
      showCheckboxes: false,
      showMore: false
    },
    highertaxon_checkbox: {
      id: "highertaxon_checkbox",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Group",
      showCheckboxes: false,
      showMore: false
    },
    type_status: {
      id: "type_status",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Type status",
      showCheckboxes: false,
      showMore: false
    },
    country: {
      id: "country",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Country",
      showCheckboxes: false,
      showMore: false
    },
    datasetowner: {
      id: "datasetowner",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Dataset owner",
      showCheckboxes: false,
      showMore: false
    },
    providername: {
      id: "providername",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Provider",
      showCheckboxes: false,
      showMore: false
    },
    providercountry: {
      id: "providercountry",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Provider country",
      showCheckboxes: false,
      showMore: false
    },
    has_image: {
      id: "has_image",
      type: "checkbox",
      lookUpType: "",
      value: null,
      label: "Show only data with images"
    },
    has_map: {
      id: "has_map",
      type: "single_checkbox",
      lookUpType: "",
      value: null,
      label: "Show only georeferenced data"
    }
  },
  searchIds: [
    "q",
    "fullscientificname",
    "highertaxon",
    "stratigraphy",
    "locality",
    "collectioncode",
    "unitid",
    "recordbasis",
    "highertaxon_checkbox",
    "type_status",
    "country",
    "datasetowner",
    "providername",
    "providercountry",
    "has_image",
    "has_map"
  ],
  searchTextIds: [
    "fullscientificname",
    "highertaxon",
    "stratigraphy",
    "locality",
    "collectioncode",
    "unitid"
  ],
  searchCheckboxIds: [
    "recordbasis",
    "highertaxon_checkbox",
    "type_status",
    "country",
    "datasetowner",
    "providername",
    "providercountry"
  ],
  searchSingleCheckboxIds: ["has_image", "has_map"],
  lookUpTypes: [
    "contains",
    "equals",
    "starts with",
    "does not contain",
    "greater than",
    "smaller than"
  ],
  recordbasis: [],
  highertaxon: [],
  type_status: [],
  country: [],
  datasetowner: [],
  providername: [],
  providercountry: [],
  paginateByItems: [
    { text: "Paginate by 10", value: 10 },
    { text: "Paginate by 25", value: 25 },
    { text: "Paginate by 50", value: 50 },
    { text: "Paginate by 100", value: 100 },
    { text: "Paginate by 250", value: 250 },
    { text: "Paginate by 500", value: 500 },
    { text: "Paginate by 1000", value: 1000 }
  ],
  searchParamsList: ["page", "paginate_by", "sort_by", "sort_desc"],
  allFieldNames: null,
  isLoading: false
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
