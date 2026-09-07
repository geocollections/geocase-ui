import { defineStore } from "pinia";
import SearchService from "@/services/SearchService";
import { useSettingsStore } from "./settings";
import i18n from "@/i18n";

export const useDetailStore = defineStore("detail", {
  state: () => ({
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
      { text: "stratigraphyText", value: "stratigraphytext" },
      { text: "reference", value: "reference" },
      { text: "mindat", value: "mindat_url" },
      { text: "unitWeight", value: "unitWeight" },
      { text: "acquisitionDate", value: "acquisitionDate" },
      { text: "gatheringAgent", value: "gatheringAgent" },
      { text: "unitDateText", value: "unitDateText" },
      { text: "kindOfUnit", value: "kindOfUnit" },
      { text: "taxonRecordInPbdb", value: "taxon_id_pbdb" },
      { text: "taxonInEncyclopediaOfLife", value: "taxon_id_eol" },
      { text: "taxonInTreeOfLife", value: "taxon_id_tol" },
      { text: "TaxonInFossiilidInfo", value: "taxon_id" },
      { text: "recordUri", value: "recordURI" },
      { text: "relatedResource", value: "relatedResource" },
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
      { text: "unitGuid", value: "unitGuid" },
      { text: "cetafIdentifier", value: "cetaf_identifier" },
    ],
    isLoading: false,
  }),
  getters: {
    itemExists: (state) => {
      return !!(
        state.response &&
        state.response.length > 0 &&
        state.response?.[0]?.id
      );
    },

    item: (state) => {
      return state.itemExists ? state.response[0] : [];
    },

    imageExists: (state) => {
      return !!(state.itemExists && state.item && state.item.images);
    },

    localityExists: (state) => {
      return !!(
        state.itemExists &&
        state.item &&
        state.item.has_map &&
        state.item.latitude &&
        state.item.longitude
      );
    },

    /* Currently unused types aka unspecified:
     * OtherSpecimen
     * Unspecified
     * specimen
     */
    isItemFossil: (state) => {
      if (state.item) {
        let type = state.item.recordbasis;
        return type === "Fossil";
      } else return false;
    },

    isItemMineral: (state) => {
      if (state.item) {
        let type = state.item.recordbasis;
        return type === "Mineral";
      } else return false;
    },

    isItemRock: (state) => {
      if (state.item) {
        let type = state.item.recordbasis;
        return type === "Rock";
      } else return false;
    },

    isItemMeteorite: (state) => {
      if (state.item) {
        let type = state.item.recordbasis;
        return type === "Meteorite";
      } else return false;
    },

    // There is a problem that currently stratigraphy is coming from both standards
    // which one should we use, both??
    itemStratigraphy: (state) => {
      // As an array of objects [{ name: '', division: '' }, ...]
      let stratigraphyList = [];
      let stratigraphyEFG =
        state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
          "abcd:Units"
        ]?.["abcd:Unit"]?.["abcd:UnitExtension"]?.[
          "efg:EarthScienceSpecimen"
        ]?.["efg:UnitStratigraphicDetermination"]?.[
          "efg:ChronostratigraphicAttributions"
        ]?.["efg:ChronostratigraphicAttribution"];
      let stratigraphyABCD =
        state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
          "abcd:Units"
        ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:Stratigraphy"]?.[
          "abcd:ChronostratigraphicTerms"
        ]?.["abcd:ChronostratigraphicTerm"];

      if (stratigraphyEFG) {
        if (!Array.isArray(stratigraphyEFG))
          stratigraphyEFG = [stratigraphyEFG];

        stratigraphyList = stratigraphyEFG.reduce((prev, curr) => {
          if (curr["efg:ChronostratigraphicName"])
            prev.push({
              name: curr["efg:ChronostratigraphicName"],
              division: curr["efg:ChronoStratigraphicDivision"],
            });

          return prev;
        }, []);
      }

      if (stratigraphyABCD) {
        if (!Array.isArray(stratigraphyABCD))
          stratigraphyABCD = [stratigraphyABCD];

        stratigraphyABCD.forEach((item) => {
          if (
            item?.["abcd:Term"] &&
            !stratigraphyList.some(
              (strat) => strat.name === item?.["abcd:Term"],
            )
          )
            stratigraphyList.push({
              name: item["abcd:Term"],
            });
        });
      }
      return stratigraphyList?.length > 0 ? stratigraphyList : null;
    },

    contentContact: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:ContentContacts"
      ]?.["abcd:ContentContact"];
    },

    contentContactName: (state) => {
      return state?.contentContact?.["abcd:Name"];
    },

    contentContactEmail: (state) => {
      let email = state?.contentContact?.["abcd:Email"];
      if (email) {
        if (email.includes("(at)")) email = email.replace("(at)", "@");
        return email;
      } else return null;
    },

    contentContactPhone: (state) => {
      return state?.contentContact?.["abcd:Phone"];
    },

    contentContactAddress: (state) => {
      return state?.contentContact?.["abcd:Address"];
    },

    logoURI: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:Owners"]?.["abcd:Owner"]?.["abcd:LogoURI"];
    },

    representationTitle: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:Description"]?.["abcd:Representation"]?.["abcd:Title"];
    },

    representationURI: (state) => {
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

    copyrights: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:IPRStatements"]?.["abcd:Copyrights"]?.["abcd:Copyright"]?.[
        "abcd:Text"
      ];
    },

    termsofusestatements: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:IPRStatements"]?.["abcd:TermsOfUseStatements"]?.[
        "abcd:TermsOfUse"
      ]?.["abcd:Text"];
    },

    disclaimers: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:IPRStatements"]?.["abcd:Disclaimers"]?.["abcd:Disclaimer"]?.[
        "abcd:Text"
      ];
    },

    acknowledgements: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Metadata"
      ]?.["abcd:IPRStatements"]?.["abcd:Acknowledgements"]?.[
        "abcd:Acknowledgement"
      ]?.["abcd:Text"];
    },

    dateLastEdited: (state) => {
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

    itemArea: (state) => {
      let area =
        state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
          "abcd:Units"
        ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:NamedAreas"];

      if (area) {
        area = Array.isArray(area) ? area : [area];
        let areaList = area
          .map((item) => {
            let areaClass = item?.["abcd:NamedArea"]?.["abcd:AreaClass"];
            let areaName = item?.["abcd:NamedArea"]?.["abcd:AreaName"];

            let areaCombined = "";
            if (areaName) {
              areaCombined += areaName;
              if (areaClass) areaCombined = `${areaClass}: ${areaCombined}`;
            }
            return areaCombined ? areaCombined : null;
          })
          .filter((item) => item);
        if (areaList && areaList.length > 0) return areaList;
        else return null;
      } else return null;
    },

    itemHighertaxon: (state) => {
      let highertaxon =
        state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
          "abcd:Units"
        ]?.["abcd:Unit"]?.["abcd:Identifications"]?.["abcd:Identification"]?.[
          "abcd:Result"
        ]?.["abcd:TaxonIdentified"]?.["abcd:HigherTaxa"]?.["abcd:HigherTaxon"];

      if (highertaxon) {
        highertaxon = Array.isArray(highertaxon) ? highertaxon : [highertaxon];
        let highertaxonList = highertaxon
          .map((item) => {
            if (item["abcd:HigherTaxonName"] && item["abcd:HigherTaxonRank"])
              return `${item["abcd:HigherTaxonRank"]}: ${item["abcd:HigherTaxonName"]}`;
          })
          .filter((item) => item);
        if (highertaxonList && highertaxonList.length > 0)
          return highertaxonList;
      } else return null;
    },

    specimenVerifier: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:SpecimenUnit"]?.[
        "abcd:NomenclaturalTypeDesignations"
      ]?.["abcd:NomenclaturalTypeDesignation"]?.["abcd:Verifier"]?.[
        "abcd:FullName"
      ];
    },

    unitGuid: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:UnitGUID"];
    },

    originalStatus: (state) => {
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

    itemReference: (state) => {
      let reference =
        state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
          "abcd:Units"
        ]?.["abcd:Unit"]?.["abcd:UnitReferences"]?.["abcd:UnitReference"];

      if (reference) {
        reference = Array.isArray(reference) ? reference : [reference];
        let referenceList = reference
          .map((item) => {
            let ref = "";
            if (item?.["abcd:TitleCitation"])
              ref = item?.["abcd:TitleCitation"];
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
          .filter((item) => item);
        if (referenceList && referenceList.length > 0) return referenceList;
        else return null;
      } else return null;
    },

    areaDetail: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:AreaDetail"];
    },

    unitWeight: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:UnitExtension"]?.["efg:EarthScienceSpecimen"]?.[
        "efg:UnitWeight"
      ];
    },

    nearNamedPlace: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:NearNamedPlaces"]?.[
        "abcd:NamedPlaceRelation"
      ]?.["abcd:NearNamedPlace"];
    },

    acquisitionDate: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:SpecimenUnit"]?.["abcd:Acquisition"]?.[
        "abcd:AcquisitionDate"
      ];
    },

    gatheringAgent: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:Agents"]?.[
        "abcd:GatheringAgent"
      ]?.["abcd:Person"]?.["abcd:FullName"];
    },

    unitDateText: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:Gathering"]?.["abcd:DateTime"]?.[
        "abcd:DateText"
      ];
    },

    kindOfUnit: (state) => {
      return state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[
        "abcd:Units"
      ]?.["abcd:Unit"]?.["abcd:KindOfUnit"];
    },

    // Is it possible there are multiple?
    itemMineralGroup: (state) => {
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

    mineralNameDetail: (state) => {
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

    translatedItemHeaders: (state) => {
      return state.itemHeaders.map((header) => {
        return {
          ...header,
          text: i18n.t(`detail.table.${header.text}`),
        };
      });
    },

    translatedItemHeadersSecondary: (state) => {
      return state.itemHeadersSecondary.map((header) => {
        return {
          ...header,
          text: i18n.t(`detail.secondaryTable.${header.text}`),
        };
      });
    },

    filteredItemHeaders: (state) => {
      return state.translatedItemHeaders.filter((header) => {
        if (state.item[header.value]) {
          return header;
        } else if (header.value === "stratigraphy" && state?.itemStratigraphy)
          return header;
        else if (header.value === "area" && state?.itemArea) return header;
        else if (header.value === "unitWeight" && state?.unitWeight)
          return header;
        else if (header.value === "reference" && state?.itemReference)
          return header;
        else if (header.value === "areaDetail" && state?.areaDetail)
          return header;
        else if (header.value === "nearNamedPlace" && state?.nearNamedPlace)
          return header;
        else if (
          header.value === "highertaxon" &&
          (state.item?.highertaxon || state.itemHighertaxon)
        )
          return header;
        else if (
          header.value === "itemMineralGroup" &&
          state.itemMineralGroup &&
          JSON.stringify(state.itemMineralGroup) !==
            JSON.stringify(state.itemHighertaxon) &&
          JSON.stringify(state.item?.highertaxon) !==
            JSON.stringify(state.itemMineralGroup)
        )
          return header;
        else if (
          header.value === "mineralNameDetail" &&
          state.mineralNameDetail
        )
          return header;
        else if (header.value === "acquisitionDate" && state.acquisitionDate)
          return header;
        else if (header.value === "unitDateText" && state.unitDateText)
          return header;
        else if (header.value === "gatheringAgent" && state.gatheringAgent)
          return header;
        else if (header.value === "kindOfUnit" && state.kindOfUnit)
          return header;
      });
    },

    filteredItemHeadersSecondary: (state) => {
      return state.translatedItemHeadersSecondary.filter((header) => {
        if (state.item[header.value]) {
          return header;
        } else if (
          header.value === "contentContactName" &&
          state?.contentContactName
        )
          return header;
        else if (
          header.value === "contentContactEmail" &&
          state?.contentContactEmail
        )
          return header;
        else if (
          header.value === "contentContactPhone" &&
          state?.contentContactPhone
        )
          return header;
        else if (
          header.value === "contentContactAddress" &&
          state?.contentContactAddress
        )
          return header;
        else if (
          header.value === "institutionHomepage" &&
          state?.representationTitle
        )
          return header;
        else if (header.value === "copyrights" && state?.copyrights)
          return header;
        else if (
          header.value === "termsofusestatements" &&
          state?.termsofusestatements
        )
          return header;
        else if (header.value === "disclaimers" && state?.disclaimers)
          return header;
        else if (header.value === "acknowledgements" && state?.acknowledgements)
          return header;
        else if (header.value === "dateLastEdited" && state?.dateLastEdited)
          return header;
        else if (header.value === "specimenVerifier" && state?.specimenVerifier)
          return header;
        else if (header.value === "unitGuid" && state?.unitGuid) return header;
      });
    },
  },
  actions: {
    UPDATE_RESPONSE(payload) {
      this.response = payload;
    },

    UPDATE_RESPONSE_FROM_SOURCE(payload) {
      this.responseFromSource = payload;
    },

    UPDATE_IS_LOADING(payload) {
      this.isLoading = payload;
    },
    async getDetailView(id) {
      try {
        this.UPDATE_IS_LOADING(true);
        const response = await SearchService.getDetailView(id);
        if (response) {
          this.UPDATE_RESPONSE(response?.response?.docs || []);

          if (response.numFound === 0) {
            useSettingsStore().updateErrorMessage(
              `Item with an ID: <b>${id}</b> was not found!`,
            );
            if (!useSettingsStore().error)
              useSettingsStore().updateErrorState(true);
          }
          this.UPDATE_IS_LOADING(false);
        }
      } catch (err) {
        useSettingsStore().updateErrorMessage(
          `<b>Failed to item with an ID: ${id}!</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
        this.UPDATE_IS_LOADING(false);
      }
    },

    async getDetailViewDataFromSource(url) {
      try {
        const response = await SearchService.getDetailViewDataFromSource(url);
        if (response?.data) {
          this.UPDATE_RESPONSE_FROM_SOURCE(response?.data || []);
        } else {
          useSettingsStore().updateInfoMessage(
            "Fetching data directly from source returned no results!",
          );
          if (!useSettingsStore().info)
            useSettingsStore().updateInfoState(true);
        }
      } catch (err) {
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch data directly from source!</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }
    },

    resetResponseFromSource() {
      this.UPDATE_RESPONSE_FROM_SOURCE(null);
    },
  },
});
