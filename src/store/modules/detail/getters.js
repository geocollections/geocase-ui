import i18n from "@/i18n";

const getters = {
  itemExists: state => {
    return !!(
      state.response &&
      state.response.length > 0 &&
      state.response?.[0]?.id
    );
  },

  item: (state, getters) => {
    return getters.itemExists ? state.response[0] : [];
  },

  imageExists: (state, getters) => {
    return !!(getters.itemExists && getters.item && getters.item.images);
  },

  localityExists: (state, getters) => {
    return !!(
      getters.itemExists &&
      getters.item &&
      getters.item.has_map &&
      getters.item.latitude &&
      getters.item.longitude
    );
  },

  /* Currently unused types aka unspecified:
   * OtherSpecimen
   * Unspecified
   * specimen
   */
  isItemFossil: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return type === "Fossil" || type === "Recent preserved";
    } else return false;
  },

  isItemMineral: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return type === "Mineral";
    } else return false;
  },

  isItemRock: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return (
        type === "Rock" ||
        type === "Sediment sample" ||
        type === "Technological sample"
      );
    } else return false;
  },

  isItemMeteorite: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return type === "Meteorite";
    } else return false;
  },

  itemStratigraphy: state => {
    let stratigraphy =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:UnitExtension"]?.["efg:EarthScienceSpecimen"]?.[
        "efg:UnitStratigraphicDetermination"
      ]?.["efg:ChronostratigraphicAttributions"]?.[
        "efg:ChronostratigraphicAttribution"
      ];

    if (stratigraphy) {
      stratigraphy = Array.isArray(stratigraphy)
        ? stratigraphy
        : [stratigraphy];

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
    let area =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:NamedAreas"];

    if (area) {
      area = Array.isArray(area) ? area : [area];
      let areaList = area
        .map(item => {
          let areaClass = item?.["abcd:NamedArea"]?.["abcd:AreaClass"];
          let areaName = item?.["abcd:NamedArea"]?.["abcd:AreaName"];

          let areaCombined = "";
          if (areaName) {
            areaCombined += areaName;
            if (areaClass) areaCombined = `${areaClass}: ${areaCombined}`;
          }
          return areaCombined ? areaCombined : null;
        })
        .filter(item => item);
      if (areaList && areaList.length > 0) return areaList;
      else return null;
    } else return null;
  },

  itemHighertaxon: state => {
    let highertaxon =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Identifications"]?.["abcd:Identification"]?.[
        "abcd:Result"
      ]?.["abcd:TaxonIdentified"]?.["abcd:HigherTaxa"]?.["abcd:HigherTaxon"];

    if (highertaxon) {
      highertaxon = Array.isArray(highertaxon) ? highertaxon : [highertaxon];
      let highertaxonList = highertaxon
        .map(item => {
          if (item["abcd:HigherTaxonName"] && item["abcd:HigherTaxonRank"])
            return `${item["abcd:HigherTaxonRank"]}: ${item["abcd:HigherTaxonName"]}`;
        })
        .filter(item => item);
      if (highertaxonList && highertaxonList.length > 0) return highertaxonList;
    } else return null;
  },

  specimenVerifier: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:SpecimenUnit"]?.[
      "abcd:NomenclaturalTypeDesignations"
    ]?.["abcd:NomenclaturalTypeDesignation"]?.["abcd:Verifier"]?.[
      "abcd:FullName"
    ];
  },

  unitGuid: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:UnitGUID"];
  },

  originalStatus: state => {
    let reference =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Identifications"]?.[
        "abcd:Identification"
      ]?.[0]?.["abcd:References"]?.["abcd:Reference"]?.["abcd:TitleCitation"];

    if (!reference) {
      let nomenclaturalReference =
        state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
          "abcd:Units"
        ]?.["abcd:Unit"]?.["abcd:SpecimenUnit"]?.[
          "abcd:NomenclaturalTypeDesignations"
        ]?.["abcd:NomenclaturalTypeDesignation"]?.[
          "abcd:NomenclaturalReference"
        ];

      if (nomenclaturalReference?.["abcd:TitleCitation"])
        reference = nomenclaturalReference?.["abcd:TitleCitation"];
      if (nomenclaturalReference?.["abcd:CitationDetail"])
        reference += ` ${nomenclaturalReference?.["abcd:CitationDetail"]}`;
    }

    return reference;
  },

  itemReference: state => {
    let reference =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:UnitReferences"]?.["abcd:UnitReference"];

    if (reference) {
      reference = Array.isArray(reference) ? reference : [reference];
      let referenceList = reference
        .map(item => {
          let ref = "";
          if (item?.["abcd:TitleCitation"]) ref = item?.["abcd:TitleCitation"];
          if (item?.["abcd:CitationDetail"])
            ref += ` ${item?.["abcd:CitationDetail"]}`;
          if (item?.["abcd:URI"]) {
            let url = item?.["abcd:URI"];
            if (!item?.["abcd:URI"].startsWith("http"))
              url = `https://doi.org/${url}`;
            ref += ` (<a href="${url}" target="ReferenceWindow" style="text-decoration: none;">${url}</a>)`;
          }
          return ref ? ref : null;
        })
        .filter(item => item);
      if (referenceList && referenceList.length > 0) return referenceList;
      else return null;
    } else return null;
  },

  areaDetail: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:AreaDetail"];
  },

  unitWeight: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:UnitExtension"]?.["efg:EarthScienceSpecimen"]?.[
      "efg:UnitWeight"
    ];
  },

  nearNamedPlace: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:NearNamedPlaces"]?.[
      "abcd:NamedPlaceRelation"
    ]?.["abcd:NearNamedPlace"];
  },

  acquisitionDate: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:SpecimenUnit"]?.["abcd:Acquisition"]?.[
      "abcd:AcquisitionDate"
    ];
  },

  gatheringAgent: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:Agents"]?.[
      "abcd:GatheringAgent"
    ]?.["abcd:Person"]?.["abcd:FullName"];
  },

  unitDateText: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:DateTime"]?.["abcd:DateText"];
  },

  kindOfUnit: state => {
    return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
      "abcd:Units"
    ]?.["abcd:Unit"]?.["abcd:KindOfUnit"];
  },

  // Is it possible there are multiple?
  itemMineralGroup: state => {
    const mineralGroup =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Identifications"]?.["abcd:Identification"]?.[
        "abcd:Result"
      ]?.["abcd:Extension"]?.["efg:MineralRockIdentified"]?.[
        "efg:MineralRockGroup"
      ]?.["efg:MineralRockGroupName"];
    return mineralGroup;
    // if (mineralGroup) {
    //   if (Array.isArray(mineralGroup)) {
    //     let mineralGroupList = mineralGroup
    //       .map(item => {
    //         if (item["efg:MineralRockGroupName"])
    //           return item["efg:MineralRockGroupName"];
    //       })
    //       .filter(item => item);
    //     if (mineralGroupList && mineralGroupList.length > 0)
    //       return mineralGroupList;
    //   } else if (mineralGroup?.["efg:MineralRockGroupName"])
    //     return [`${mineralGroup?.["efg:MineralRockGroupName"]}`];
    //   else return null;
    // } else return null;
  },

  mineralNameDetail: state => {
    let name =
      state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Identifications"]?.["abcd:Identification"]?.[
        "abcd:Result"
      ]?.["abcd:Extension"]?.["efg:MineralRockIdentified"];

    let nameDetail = "";

    if (name?.["efg:NameAddendum"]) nameDetail += name?.["efg:NameAddendum"];
    if (name?.["efg:VarietalNameString"])
      nameDetail += ` ${name?.["efg:VarietalNameString"]}`;
    return nameDetail ? nameDetail : null;
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
  },

  filteredItemHeaders: (state, getters) => {
    return getters.translatedItemHeaders.filter(header => {
      if (getters.item[header.value]) {
        return header;
      } else if (header.value === "stratigraphy" && getters?.itemStratigraphy)
        return header;
      else if (header.value === "area" && getters?.itemArea) return header;
      else if (header.value === "unitWeight" && getters?.unitWeight)
        return header;
      else if (header.value === "reference" && getters?.itemReference)
        return header;
      else if (header.value === "areaDetail" && getters?.areaDetail)
        return header;
      else if (header.value === "nearNamedPlace" && getters?.nearNamedPlace)
        return header;
      else if (
        header.value === "highertaxon" &&
        (getters.item?.highertaxon || getters.itemHighertaxon)
      )
        return header;
      else if (header.value === "itemMineralGroup" && getters.itemMineralGroup)
        return header;
      else if (
        header.value === "mineralNameDetail" &&
        getters.mineralNameDetail
      )
        return header;
      else if (header.value === "acquisitionDate" && getters.acquisitionDate)
        return header;
      else if (header.value === "unitDateText" && getters.unitDateText)
        return header;
      else if (header.value === "gatheringAgent" && getters.gatheringAgent)
        return header;
      else if (header.value === "kindOfUnit" && getters.kindOfUnit)
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
  }
};

export default getters;
