import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  response: null,
  responseFromSource: null,
  itemHeaders: [
    { text: "Type", value: "typestatus" },
    { text: "Collection", value: "collectioncode" },
    { text: "Object ID", value: "unitid" },
    { text: "Type status", value: "type_status" },
    // { text: "Rank", value: "higherrank" },
    { text: "Group", value: "highertaxon" },
    { text: "Country", value: "country" },
    // { text: "Area", value: "area_name" },
    // { text: "Area type", value: "area_type" },
    { text: "Area", value: "area" },
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
    // { text: "Type status", value: "type_status" }
    // { text: "Type status", value: "type_status" },
    // { text: "Preservation", value: "" },
    // { text: "Reference(s) status", value: "" },
    // { text: "Taxonomy status", value: "" },
  ],
  itemHeadersSecondary: [
    { text: "Institution", value: "institutionHomepage" },
    { text: "Dataset owner", value: "datasetowner" },
    { text: "Contact person", value: "contentContactName" },
    { text: "Contact e-mail", value: "contentContactEmail" },
    { text: "Contact phone", value: "contentContactPhone" },
    { text: "Contact address", value: "contentContactAddress" },
    { text: "Contact data", value: "contactdata" },
    { text: "Data source country", value: "datasourcecountry" },
    { text: "Copyright", value: "copyrights" },
    { text: "Terms of use", value: "termsofusestatements" },
    { text: "Disclaimer", value: "disclaimers" },
    { text: "Acknowledgement", value: "acknowledgements" },
    { text: "Last Edited", value: "dateLastEdited" },
    { text: "Last harvested", value: "last_harvested_processing" },
    { text: "Provider name", value: "providername" },
    { text: "Specimen verifier", value: "specimenVerifier" },
    { text: "GeoCASe ID", value: "id" },
    { text: "UnitGUID", value: "unitGuid" }
    // { text: "Provider address", value: "provideraddress" },
    // { text: "Provider url", value: "providerurl" }
  ],
  isLoading: false
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
