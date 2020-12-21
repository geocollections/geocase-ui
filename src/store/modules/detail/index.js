import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  response: null,
  responseFromSource: null,
  itemHeaders: [
    { text: "type", value: "typestatus" },
    { text: "collection", value: "collectioncode" },
    { text: "objectId", value: "unitid" },
    { text: "typeStatus", value: "type_status" },
    { text: "group", value: "highertaxon" },
    { text: "itemMineralGroup", value: "itemMineralGroup" },
    { text: "mineralNameDetail", value: "mineralNameDetail" },
    { text: "country", value: "country" },
    { text: "area", value: "area" },
    { text: "areaDetail", value: "areaDetail" },
    { text: "nearNamedPlace", value: "nearNamedPlace" },
    { text: "locality", value: "locality" },
    { text: "latitude", value: "latitude" },
    { text: "longitude", value: "longitude" },
    { text: "stratigraphy", value: "stratigraphy" },
    { text: "reference", value: "reference" },
    { text: "mindat", value: "mindat_url" },
    { text: "unitWeight", value: "unitWeight" },
    { text: "acquisitionDate", value: "acquisitionDate" },
    { text: "gatheringAgent", value: "gatheringAgent" },
    { text: "taxonRecordInPbdb", value: "taxon_id_pbdb" },
    { text: "taxonInEncyclopediaOfLife", value: "taxon_id_eol" },
    { text: "taxonInTreeOfLife", value: "taxon_id_tol" },
    { text: "TaxonInFossiilidInfo", value: "taxon_id" },
    { text: "recordUri", value: "recordURI" },
    { text: "relatedResource", value: "relatedResource" }
  ],
  itemHeadersSecondary: [
    { text: "institution", value: "institutionHomepage" },
    { text: "datasetOwner", value: "datasetowner" },
    { text: "contactPerson", value: "contentContactName" },
    { text: "contactEmail", value: "contentContactEmail" },
    { text: "contactPhone", value: "contentContactPhone" },
    { text: "contactAddress", value: "contentContactAddress" },
    { text: "contactData", value: "contactdata" },
    { text: "dataSourceCountry", value: "datasourcecountry" },
    { text: "copyright", value: "copyrights" },
    { text: "termsOfUse", value: "termsofusestatements" },
    { text: "disclaimer", value: "disclaimers" },
    { text: "acknowledgement", value: "acknowledgements" },
    { text: "lastEdited", value: "dateLastEdited" },
    { text: "lastHarvested", value: "last_harvested_processing" },
    { text: "providerName", value: "providername" },
    { text: "specimenVerifier", value: "specimenVerifier" },
    { text: "geocaseId", value: "id" },
    { text: "unitGuid", value: "unitGuid" }
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
