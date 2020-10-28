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
      else if (header.value === "area" && getters.itemArea) return header;
      else if (
        header.value === "highertaxon" &&
        (getters.itemArea || getters.item?.highertaxon)
      )
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
      else if (header.value.includes("copyrights") && getters?.copyrights)
        return header;
      else if (
        header.value.includes("termsofusestatements") &&
        getters?.termsofusestatements
      )
        return header;
      else if (header.value.includes("disclaimers") && getters?.disclaimers)
        return header;
      else if (
        header.value.includes("acknowledgements") &&
        getters?.acknowledgements
      )
        return header;
      else if (
        header.value.includes("dateLastEdited") &&
        getters?.dateLastEdited
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
        if (
          item["efg:ChronostratigraphicName"] &&
          item["efg:ChronoStratigraphicDivision"]
        ) {
          return `${item["efg:ChronoStratigraphicDivision"]} : ${item["efg:ChronostratigraphicName"]}`;
        }
      });
      if (stratigraphyList && stratigraphyList.length > 0)
        return stratigraphyList;
      else return null;
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
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:Owners"]?.[0]?.["abcd:Owner"]?.[0]?.[
      "abcd:LogoURI"
    ]?.[0];
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
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:Description"]?.[0]?.[
      "abcd:Representation"
    ]?.[0]?.["abcd:URI"]?.[0];
  },

  copyrights: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:IPRStatements"]?.[0]?.[
      "abcd:Copyrights"
    ]?.[0]?.["abcd:Copyright"]?.[0]?.["abcd:Text"]?.[0];
  },

  termsofusestatements: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:IPRStatements"]?.[0]?.[
      "abcd:TermsOfUseStatements"
    ]?.[0]?.["abcd:TermsOfUse"]?.[0]?.["abcd:Text"]?.[0];
  },

  disclaimers: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:IPRStatements"]?.[0]?.[
      "abcd:Disclaimers"
    ]?.[0]?.["abcd:Disclaimer"]?.[0]?.["abcd:Text"]?.[0];
  },

  acknowledgements: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Metadata"]?.[0]?.["abcd:IPRStatements"]?.[0]?.[
      "abcd:Acknowledgements"
    ]?.[0]?.["abcd:Acknowledgement"]?.[0]?.["abcd:Text"]?.[0];
  },

  dateLastEdited: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Units"]?.[0]?.["abcd:Unit"]?.[0]?.[
      "abcd:DateLastEdited"
    ]?.[0];
  },

  itemArea: state => {
    const area =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[0]?.[
        "abcd:Units"
      ]?.[0]?.["abcd:Unit"]?.[0]?.["abcd:Gathering"]?.[0]?.["abcd:NamedAreas"];

    if (area) {
      let areaList = area.map(item => {
        if (
          item?.["abcd:NamedArea"]?.[0]?.["abcd:AreaClass"]?.[0]?.["_"] &&
          item?.["abcd:NamedArea"]?.[0]?.["abcd:AreaName"]?.[0]?.["_"]
        ) {
          return `${item?.["abcd:NamedArea"]?.[0]?.["abcd:AreaClass"]?.[0]?.["_"]} : ${item?.["abcd:NamedArea"]?.[0]?.["abcd:AreaName"]?.[0]?.["_"]}`;
        }
      });
      if (areaList && areaList.length > 0) return areaList;
      else return null;
    } else return null;
  },

  itemHighertaxon: state => {
    const highertaxon =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[0]?.[
        "abcd:Units"
      ]?.[0]?.["abcd:Unit"]?.[0]?.["abcd:Identifications"]?.[0]?.[
        "abcd:Identification"
      ]?.[0]?.["abcd:Result"]?.[0]?.["abcd:TaxonIdentified"]?.[0]?.[
        "abcd:HigherTaxa"
      ]?.[0]?.["abcd:HigherTaxon"];

    if (highertaxon) {
      let highertaxonList = highertaxon.map(item => {
        if (
          item["abcd:HigherTaxonName"]?.[0] &&
          item["abcd:HigherTaxonRank"]?.[0]
        ) {
          return `${item["abcd:HigherTaxonRank"]?.[0]} : ${item["abcd:HigherTaxonName"]?.[0]}`;
        }
      });
      if (highertaxonList && highertaxonList.length > 0) return highertaxonList;
      else return null;
    } else return null;
  }
};

export default getters;
