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
  searchFields: [
    {
      fieldType: "text",
      field: "q",
      lookUpType: "",
      value: null,
      label: "Find quickly"
    },
    {
      fieldType: "text",
      field: "fullscientificname",
      lookUpType: "contains",
      value: null,
      label: "Name"
    },
    {
      fieldType: "text",
      field: "highertaxon",
      lookUpType: "contains",
      value: null,
      label: "Group"
    },
    {
      fieldType: "text",
      field: "stratigraphy",
      lookUpType: "contains",
      value: null,
      label: "Stratigraphy"
    },
    {
      fieldType: "text",
      field: "locality",
      lookUpType: "contains",
      value: null,
      label: "Locality"
    },
    {
      fieldType: "text",
      field: "collectioncode",
      lookUpType: "contains",
      value: null,
      label: "Institution"
    },
    {
      fieldType: "text",
      field: "unitid",
      lookUpType: "contains",
      value: null,
      label: "Object ID"
    },
    {
      fieldType: "checkbox",
      field: "recordbasis",
      lookUpType: "",
      value: null,
      label: "Specimen type",
      showCheckboxes: false,
      showMore: false
    },
    {
      fieldType: "checkbox",
      field: "highertaxon_checkbox",
      lookUpType: "",
      value: null,
      label: "Group",
      showCheckboxes: false,
      showMore: false
    },
    {
      fieldType: "checkbox",
      field: "type_status",
      lookUpType: "",
      value: null,
      label: "Type status",
      showCheckboxes: false,
      showMore: false
    },
    {
      fieldType: "checkbox",
      field: "country",
      lookUpType: "",
      value: null,
      label: "Country",
      showCheckboxes: false,
      showMore: false
    },
    {
      fieldType: "checkbox",
      field: "datasetowner",
      lookUpType: "",
      value: null,
      label: "Dataset owner",
      showCheckboxes: false,
      showMore: false
    },
    {
      fieldType: "checkbox",
      field: "providername",
      lookUpType: "",
      value: null,
      label: "Provider",
      showCheckboxes: false,
      showMore: false
    },
    {
      fieldType: "checkbox",
      field: "providercountry",
      lookUpType: "",
      value: null,
      label: "Provider country",
      showCheckboxes: false,
      showMore: false
    },
    {
      fieldType: "single_checkbox",
      field: "has_image",
      lookUpType: "",
      value: null,
      label: "Show only data with images"
    },
    {
      fieldType: "single_checkbox",
      field: "has_map",
      lookUpType: "",
      value: null,
      label: "Show only georeferenced data"
    }
  ],
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
  searchFieldList: [
    "q",
    "fullscientificname",
    "highertaxon",
    "stratigraphy",
    "locality",
    "collectioncode",
    "unitid",
    "recordbasis",
    "type_status",
    "country",
    "datasetowner",
    "providername",
    "providercountry",
    "has_image",
    "has_coordinates"
  ],
  searchParamsList: ["page", "paginate_by", "sort_by", "sort_desc"]
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
