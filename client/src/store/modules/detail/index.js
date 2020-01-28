import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  response: null,
  error: "",
  showError: false,
  itemHeaders: [
    { text: "ID", value: "id" },
    { text: "Collection", value: "collectioncode" },
    { text: "Object ID", value: "unitid" },
    { text: "Country", value: "country" },
    { text: "Locality", value: "locality" },
    { text: "Latitude", value: "latitude" },
    { text: "Longitude", value: "longitude" },
    { text: "Stratigraphy", value: "stratigraphy" },
    { text: "Record URI", value: "recordURI" },
    { text: "Url", value: "url" },
    { text: "Related resource", value: "relatedResource" }
  ],
  imageWidth: 400
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
