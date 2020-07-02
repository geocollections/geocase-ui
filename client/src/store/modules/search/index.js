import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  searchParameters: {
    page: 1,
    paginateBy: 50,
    sortBy: ["fullscientificname"],
    sortDesc: [false]
  },
  detailSearch: {
    textFields: {
      fullscientificname: {
        type: "Contains",
        value: "",
        label: "Name",
        color: "red lighten-5"
      },
      highertaxon: {
        type: "Contains",
        value: "",
        label: "Group",
        color: "deep-purple lighten-5"
      },
      stratigraphy: {
        type: "Contains",
        value: "",
        label: "Stratigraphy",
        color: "teal lighten-5"
      },
      locality: {
        type: "Contains",
        value: "",
        label: "Locality",
        color: "orange lighten-5"
      },
      collectioncode: {
        type: "Contains",
        value: "",
        label: "Institution",
        color: "blue-grey lighten-5"
      },
      unitid: {
        type: "Contains",
        value: "",
        label: "Object ID",
        color: "green lighten-5"
      }
    },
    extraFields: {
      object: {
        value: "- Any -",
        label: "Object"
      },
      url: {
        value: "- Any -",
        label: "Multimedia"
      }
    }
  },
  lookUpTypes: {
    common: [
      "Is equal to",
      "Is not equal to",
      "Contains",
      "Contains any word",
      "Contains all words",
      "Starts with",
      "Does not start with",
      "Ends with",
      "Does not end with",
      "Does not contains",
      "Length is shorter than",
      "Length is longer than",
      "Reqular expression"
    ],
    objects: ["- Any -", "Minerals only", "Fossils only"],
    url: ["- Any -", "Yes", "No"]
  },
  fastSearch: "",
  response: {
    numFound: 0,
    docs: []
  },
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
