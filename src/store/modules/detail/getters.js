import i18n from "@/i18n";

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
    return getters.translatedItemHeaders.filter(header => {
      if (getters.item[header.value]) {
        return header;
      } else if (header.value === "stratigraphy" && getters?.itemStratigraphy)
        return header;
      else if (header.value === "area" && getters?.itemArea) return header;
      else if (
        header.value === "highertaxon" &&
        (getters?.itemArea || getters.item?.highertaxon)
      )
        return header;
    });
  },

  filteredItemHeadersSecondary: (state, getters) => {
    return getters.translatedItemHeadersSecondary.filter(header => {
      if (getters.item[header.value]) {
        return header;
      } else if (
        header.value === "contentContactName" &&
        getters?.contentContactName
      )
        return header;
      else if (
        header.value === "contentContactEmail" &&
        getters?.contentContactEmail
      )
        return header;
      else if (
        header.value === "contentContactPhone" &&
        getters?.contentContactPhone
      )
        return header;
      else if (
        header.value === "contentContactAddress" &&
        getters?.contentContactAddress
      )
        return header;
      else if (
        header.value === "institutionHomepage" &&
        getters?.representationTitle
      )
        return header;
      else if (header.value === "copyrights" && getters?.copyrights)
        return header;
      else if (
        header.value === "termsofusestatements" &&
        getters?.termsofusestatements
      )
        return header;
      else if (header.value === "disclaimers" && getters?.disclaimers)
        return header;
      else if (header.value === "acknowledgements" && getters?.acknowledgements)
        return header;
      else if (header.value === "dateLastEdited" && getters?.dateLastEdited)
        return header;
      else if (header.value === "specimenVerifier" && getters?.specimenVerifier)
        return header;
      else if (header.value === "unitGuid" && getters?.unitGuid) return header;
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
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:UnitExtension"]?.["efg:EarthScienceSpecimen"]?.[
        "efg:UnitStratigraphicDetermination"
      ]?.["efg:ChronostratigraphicAttributions"]?.[
        "efg:ChronostratigraphicAttribution"
      ];

    if (stratigraphy) {
      if (Array.isArray(stratigraphy)) {
        let stratigraphyList = stratigraphy
          .map(item => {
            if (
              item["efg:ChronostratigraphicName"] &&
              item["efg:ChronoStratigraphicDivision"]
            ) {
              return `${item["efg:ChronoStratigraphicDivision"]}: ${item["efg:ChronostratigraphicName"]}`;
            }
          })
          .filter(item => item);
        if (stratigraphyList && stratigraphyList.length > 0)
          return stratigraphyList;
        else return null;
      } else if (
        stratigraphy["efg:ChronoStratigraphicDivision"] &&
        stratigraphy["efg:ChronostratigraphicName"]
      )
        return [
          `${stratigraphy["efg:ChronoStratigraphicDivision"]}: ${stratigraphy["efg:ChronostratigraphicName"]}`
        ];
    } else return null;
  },

  contentContact: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:ContentContacts"
    ]?.["abcd:ContentContact"];
  },

  contentContactName: (state, getters) => {
    return getters?.contentContact?.["abcd:Name"];
  },

  contentContactEmail: (state, getters) => {
    let email = getters?.contentContact?.["abcd:Email"];
    if (email) {
      if (email.includes("(at)")) email = email.replace("(at)", "@");
      return email;
    } else return null;
  },

  contentContactPhone: (state, getters) => {
    return getters?.contentContact?.["abcd:Phone"];
  },

  contentContactAddress: (state, getters) => {
    return getters?.contentContact?.["abcd:Address"];
  },

  logoURI: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Metadata"
    ]?.["abcd:Owners"]?.["abcd:Owner"]?.["abcd:LogoURI"];
  },

  representationTitle: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Metadata"
    ]?.["abcd:Description"]?.["abcd:Representation"]?.["abcd:Title"];
  },

  representationURI: state => {
    let representationUrl =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:Description"]?.["abcd:Representation"]?.["abcd:URI"];
    let ownerUrl =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:Owners"]?.["abcd:Owner"]?.["abcd:URIs"]?.["abcd:URL"];
    if (representationUrl) return representationUrl;
    else if (ownerUrl) return ownerUrl;
    else return null;
  },

  copyrights: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Metadata"
    ]?.["abcd:IPRStatements"]?.["abcd:Copyrights"]?.["abcd:Copyright"]?.[
      "abcd:Text"
    ];
  },

  termsofusestatements: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Metadata"
    ]?.["abcd:IPRStatements"]?.["abcd:TermsOfUseStatements"]?.[
      "abcd:TermsOfUse"
    ]?.["abcd:Text"];
  },

  disclaimers: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Metadata"
    ]?.["abcd:IPRStatements"]?.["abcd:Disclaimers"]?.["abcd:Disclaimer"]?.[
      "abcd:Text"
    ];
  },

  acknowledgements: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Metadata"
    ]?.["abcd:IPRStatements"]?.["abcd:Acknowledgements"]?.[
      "abcd:Acknowledgement"
    ]?.["abcd:Text"];
  },

  dateLastEdited: state => {
    let dateLastEdited =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:DateLastEdited"];

    let dateModified =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:RevisionData"]?.["abcd:DateModified"];

    if (dateLastEdited) {
      if (dateLastEdited.includes("T")) return dateLastEdited.split("T")[0];
      else return dateLastEdited;
    } else if (dateModified) {
      if (dateModified.includes("T")) return dateModified.split("T")[0];
      else return dateModified;
    } else return null;
  },

  itemArea: state => {
    const area =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:NamedAreas"];

    if (area) {
      if (Array.isArray(area)) {
        let areaList = area
          .map(item => {
            let areaClass = item?.["abcd:NamedArea"]?.["abcd:AreaClass"];
            let areaName = item?.["abcd:NamedArea"]?.["abcd:AreaName"];

            if (areaClass && areaName) return `${areaClass}: ${areaName}`;
          })
          .filter(item => item);
        if (areaList && areaList.length > 0) return areaList;
        else return null;
      } else if (
        area?.["abcd:NamedArea"]?.["abcd:AreaClass"] &&
        area?.["abcd:NamedArea"]?.["abcd:AreaName"]
      )
        return [
          `${area?.["abcd:NamedArea"]?.["abcd:AreaClass"]}: ${area?.["abcd:NamedArea"]?.["abcd:AreaName"]}`
        ];
      else return null;
    } else return null;
  },

  itemHighertaxon: state => {
    const highertaxon =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Identifications"]?.[
        "abcd:Identification"
      ]?.[0]?.["abcd:Result"]?.["abcd:TaxonIdentified"]?.["abcd:HigherTaxa"]?.[
        "abcd:HigherTaxon"
      ];

    if (highertaxon) {
      if (Array.isArray(highertaxon)) {
        let highertaxonList = highertaxon
          .map(item => {
            if (item["abcd:HigherTaxonName"] && item["abcd:HigherTaxonRank"])
              return `${item["abcd:HigherTaxonRank"]}: ${item["abcd:HigherTaxonName"]}`;
          })
          .filter(item => item);
        if (highertaxonList && highertaxonList.length > 0)
          return highertaxonList;
      } else if (
        highertaxon?.["abcd:HigherTaxonName"] &&
        highertaxon?.["abcd:HigherTaxonRank"]
      )
        return [
          `${highertaxon?.["abcd:HigherTaxonName"]}: ${highertaxon?.["abcd:HigherTaxonRank"]}`
        ];
      else return null;
    } else return null;
  },

  specimenVerifier: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Units"]?.[0]?.["abcd:Unit"]?.[0]?.[
      "abcd:SpecimenUnit"
    ]?.[0]?.["abcd:NomenclaturalTypeDesignations"]?.[0]?.[
      "abcd:NomenclaturalTypeDesignation"
    ]?.[0]?.["abcd:Verifier"]?.[0]?.["abcd:FullName"]?.[0];
  },

  unitGuid: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:Units"]?.[0]?.["abcd:Unit"]?.[0]?.["abcd:UnitGUID"]?.[0];
  },

  translatedItemHeaders: state => {
    return state.itemHeaders.map(header => {
      return {
        ...header,
        text: i18n.t(`detail.table.${header.text}`)
      };
    });
  },

  translatedItemHeadersSecondary: state => {
    return state.itemHeadersSecondary.map(header => {
      return {
        ...header,
        text: i18n.t(`detail.secondaryTable.${header.text}`)
      };
    });
  }
};

export default getters;
