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
      field: "fastsearch",
      lookUpType: "",
      value: null,
      label: "Fast search"
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
  paginateByItems: [
    { text: "Paginate by 10", value: 10 },
    { text: "Paginate by 25", value: 25 },
    { text: "Paginate by 50", value: 50 },
    { text: "Paginate by 100", value: 100 },
    { text: "Paginate by 250", value: 250 },
    { text: "Paginate by 500", value: 500 },
    { text: "Paginate by 1000", value: 1000 }
  ]
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
