import { get } from "leaflet/src/dom/DomUtil";

const getters = {
  itemExists: state => {
    return (
      state.response && state.response.length > 0 && state.response?.[0]?.id
    );
  },

  item: (state, getters) => {
    return getters.itemExists ? state.response[0] : [];
  },

  imageExists: (state, getters) => {
    return getters.itemExists && getters.item && getters.item.images;
  },

  localityExists: (state, getters) => {
    return (
      getters.itemExists &&
      getters.item &&
      getters.item.has_map &&
      getters.item.latitude &&
      getters.item.longitude
    );
  },

  filteredItemHeaders: (state, getters) => {
    return state.itemHeaders.filter(header => {
      if (getters.item[header.value]) {
        return header;
      } else if (header.value === "stratigraphy" && getters.itemStratigraphy)
        return header;
    });
  },

  filteredItemHeadersSecondary: (state, getters) => {
    return state.itemHeadersSecondary.filter(header => {
      if (getters.item[header.value]) {
        return header;
      } else if (
        header.value.includes("contentContactName") &&
        getters?.contentContactName
      )
        return header;
      else if (
        header.value.includes("contentContactEmail") &&
        getters?.contentContactEmail
      )
        return header;
      else if (
        header.value.includes("contentContactPhone") &&
        getters?.contentContactPhone
      )
        return header;
      else if (
        header.value.includes("contentContactAddress") &&
        getters?.contentContactAddress
      )
        return header;
      else if (
        header.value.includes("institutionHomepage") &&
        getters?.representationTitle
      )
        return header;
    });
  },

  /* Currently unused types aka unspecified:
   * OtherSpecimen
   * Unspecified
   * specimen
   */
  isItemFossil: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return (
        type === "FossileSpecimen" ||
        type === "FossilSpecimen" ||
        type === "RecentPreservedSpecimen" ||
        type === "fossil"
      );
    } else return false;
  },

  isItemMineral: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return type === "MineralSpecimen";
    } else return false;
  },

  isItemRock: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return (
        type === "RockSpecimen" ||
        type === "SedimentSample" ||
        type === "TechnologicalSample"
      );
    } else return false;
  },

  isItemMeteorite: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return type === "MeteoriteSpecimen";
    } else return false;
  },

  itemStratigraphy: state => {
    const stratigraphy =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[0]?.[
        "abcd:Units"
      ]?.[0]?.["abcd:Unit"]?.[0]?.["abcd:UnitExtension"]?.[0]?.[
        "efg:EarthScienceSpecimen"
      ]?.[0]?.["efg:UnitStratigraphicDetermination"]?.[0]?.[
        "efg:ChronostratigraphicAttributions"
      ]?.[0]?.["efg:ChronostratigraphicAttribution"];

    if (stratigraphy) {
      let stratigraphyList = stratigraphy.map(item => {
        if (item["efg:ChronostratigraphicName"]) {
          if (item["efg:ChronoStratigraphicDivision"])
            return `${item["efg:ChronoStratigraphicDivision"]} : ${item["efg:ChronostratigraphicName"]}`;
          else
            return `Chronostratigraphy : ${item["efg:ChronostratigraphicName"]}`;
        } else if (item["abcd:ChronostratigraphicTerm"])
          return `Chronostratigraphy : ${item["abcd:Term"]}`;
      });
      return stratigraphyList;
    } else return null;
  },

  contentContact: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:ContentContacts"]?.[0]?.["abcd:ContentContact"]?.[0];
  },

  contentContactName: (state, getters) => {
    return getters?.contentContact?.["abcd:Name"]?.[0];
  },

  contentContactEmail: (state, getters) => {
    return getters?.contentContact?.["abcd:Email"]?.[0];
  },

  contentContactPhone: (state, getters) => {
    return getters?.contentContact?.["abcd:Phone"]?.[0];
  },

  contentContactAddress: (state, getters) => {
    return getters?.contentContact?.["abcd:Address"]?.[0];
  },

  logoURI: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:Description"]?.[0]?.[
      "abcd:Representation"
    ]?.[0]?.["abcd:URI"]?.[0];
  },

  representationTitle: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:Description"]?.[0]?.[
      "abcd:Representation"
    ]?.[0]?.["abcd:Title"]?.[0];
  },

  representationURI: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:Owners"]?.[0]?.["abcd:Owner"]?.[0]?.[
      "abcd:URIs"
    ]?.[0]?.["abcd:URL"]?.[0];
  }
};

export default getters;
