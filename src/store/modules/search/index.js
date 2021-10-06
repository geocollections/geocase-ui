import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
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
      label: "Stratigraphy",
      fields: ["stratigraphy", "stratigraphytext"]
    },
    locality: {
      id: "locality",
      type: "text",
      lookUpType: "contains",
      value: null,
      label: "Locality"
    },
    // coordinates: {
    //   id: "coordinates",
    //   type: "text",
    //   lookUpType: "",
    //   value: null,
    //   label: "Coordinates"
    // },
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
    highertaxon_facet: {
      id: "highertaxon_facet",
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
      type: "single_checkbox",
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
    // map: {
    //   id: "map",
    //   type: "map",
    //   lookUpType: "",
    //   value: null,
    //   label: "Map"
    // }
  },
  searchIds: [
    "q",
    "fullscientificname",
    "highertaxon",
    "stratigraphy",
    "locality",
    // "coordinates",
    "unitid",
    "recordbasis",
    "highertaxon_facet",
    "type_status",
    "country",
    "datasetowner",
    "providername",
    "providercountry",
    "has_image",
    "has_map"
    // "map"
  ],
  searchTextIds: [
    "fullscientificname",
    "highertaxon",
    "stratigraphy",
    "locality",
    // "coordinates",
    "unitid"
  ],
  searchCheckboxIds: [
    "recordbasis",
    "highertaxon_facet",
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
    "ends with",
    "does not contain",
    "greater than",
    "smaller than"
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
    { text: "search.pagination", value: 1000 }
  ],
  searchParamsList: ["page", "paginate_by", "sort_by", "sort_desc"],
  allFieldNames: null,
  isLoading: false,
  tableHeaders: [
    { text: "empty", value: "icon", sortable: false, show: true, fixed: true },
    {
      text: "collectioncode",
      value: "collectioncode",
      show: true,
      fixed: false
    },
    { text: "unitid", value: "unitid", show: true, fixed: false },
    { text: "highertaxon", value: "highertaxon", show: true, fixed: false },
    {
      text: "fullscientificname",
      value: "fullscientificname",
      show: true,
      fixed: false
    },
    { text: "country", value: "country", show: true, fixed: false },
    { text: "locality", value: "locality", show: true, fixed: false },
    { text: "stratigraphy", value: "stratigraphy", show: true, fixed: false },
    {
      text: "recordURI",
      value: "recordURI",
      align: "center",
      show: true,
      fixed: false
    },
    { text: "url", value: "url", align: "center", show: true, fixed: false }
  ],
  isTableHeaderFixed: false
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
