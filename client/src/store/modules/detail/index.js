import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  response: null,
  itemHeaders: [
    { text: "Type", value: "typestatus" },
    { text: "ID", value: "id" },
    { text: "Collection", value: "collectioncode" },
    { text: "Object ID", value: "unitid" },
    { text: "Group", value: "highertaxon" },
    { text: "Country", value: "country" },
    { text: "Locality", value: "locality" },
    { text: "Latitude", value: "latitude" },
    { text: "Longitude", value: "longitude" },
    { text: "Stratigraphy", value: "stratigraphy" },
    { text: "Mindat", value: "mindat_url" },
    { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
    { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
    { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
    { text: "Taxon in fossiilid.info", value: "taxon_id" },
    { text: "Record URI", value: "recordURI" },
    { text: "Related resource", value: "relatedResource" }
  ],
  itemHeadersSecondary: [
    { text: "Contact data", value: "contactdata" },
    { text: "Dataset owner", value: "datasetowner" },
    { text: "Data source country", value: "datasourcecountry" },
    { text: "Last harvested", value: "last_harvested_processing" },
    { text: "Provider name", value: "providername" },
    { text: "Provider address", value: "provideraddress" },
    { text: "Provider url", value: "providerurl" }
  ],
  imageWidth: 400,
  imageHeight: 400,
  isLoading: false
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
