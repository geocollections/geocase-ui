import getters from "@/store/modules/detail/getters";

describe("DetailViewGetters", () => {

  // IDS to add  351119 345169 309429 345624 307132 322391 315182 303636 306087 345136
  // 432565 419054 419138 424557 413274 419092 419029 435823 419253 432614

  const testCases = [
    // Base state
    {
      state: {
        response: null,
        responseFromSource: null,
        itemHeaders: [
          { text: "type", value: "typestatus" },
          { text: "collection", value: "collectioncode" },
          { text: "objectId", value: "unitid" },
          { text: "typeStatus", value: "type_status" },
          { text: "group", value: "highertaxon" },
          { text: "country", value: "country" },
          { text: "area", value: "area" },
          { text: "areaDetail", value: "areaDetail" },
          { text: "locality", value: "locality" },
          { text: "latitude", value: "latitude" },
          { text: "longitude", value: "longitude" },
          { text: "stratigraphy", value: "stratigraphy" },
          { text: "reference", value: "reference" },
          { text: "mindat", value: "mindat_url" },
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
      },
      expected: [false, [], false, false, false]
    },
    // ID 306087
    {
      state: {
        response: [
          {
            country_original: "Austria",
            area_name: "Niederösterreich",
            country: "Austria",
            collectioncode: "NHMW-Geo",
            gatheringareas: ["Niederösterreich"],
            datasetownerabbrev: "NHMW-Geo",
            last_harvested_processing: "2020-11-19T14:57:46Z",
            id: "306087",
            recordbasis: "FossilSpecimen",
            datasourcecountry: "Austria",
            locality: "Teiritzberg, bei Korneuburg",
            occurrenceid: 306087,
            provideraddress: "Burgring 7, A-1010 Vienna, Austria",
            area_type: "province",
            has_map: false,
            datasourceurl:
              "http://131.130.131.9/biocase/pywrapper.cgi?dsa=gbif_w-geocase",
            datasetowner:
              "Naturhistorisches Museum Wien, Geologisch-Paläontologische Abteilung",
            providercountry: "Austria",
            type_status: "reference specimen",
            providerurl:
              "https://www.nhm-wien.ac.at/forschung/geologie__palaeontologie",
            has_image: false,
            providername: "NHM Vienna, Geology and Palaeontology",
            unitid: "2011/0034/0002",
            _version_: 1685065940392214500
          }
        ],
        responseFromSource: {
          "abcd:DataSets": {
            "abcd:DataSet": {
              "abcd:TechnicalContacts": {
                "abcd:TechnicalContact": {
                  "abcd:Name": "Andreas Kroh",
                  "abcd:Email": "andreas.kroh@nhm-wien.ac.at"
                }
              },
              "abcd:ContentContacts": {
                "abcd:ContentContact": {
                  "abcd:Name": "Andreas Kroh",
                  "abcd:Email": "andreas.kroh@nhm-wien.ac.at",
                  "abcd:Phone": "+43 (1) 52 177-576",
                  "abcd:Address": "Burgring 7, A-1010 Vienna, Austria"
                }
              },
              "abcd:Metadata": {
                "abcd:Description": {
                  "abcd:Representation": {
                    "abcd:Title": "NHM Vienna, Geology and Palaeontology",
                    "abcd:Coverage":
                      "The database contains information on specimens kept in the collection of the Department of Geology & Palaeontology at the Natural History Museum Vienna. Database content focuses on type, figured and reference specimens, but does not represent the entire collection, which holds approximately 3.5 million of fossil specimens. New data is added continuously as new specimens are registered and old registers digitised."
                  }
                },
                "abcd:IconURI":
                  "http://www2.nhm-wien.ac.at/public/NHM_Logo_Geocase.gif",
                "abcd:RevisionData": {
                  "abcd:DateCreated": "2011-03-17T09:01:40",
                  "abcd:DateModified": "2011-03-17T09:00:24"
                },
                "abcd:Owners": {
                  "abcd:Owner": {
                    "abcd:Organisation": {
                      "abcd:Name": {
                        "abcd:Representation": {
                          "abcd:Text":
                            "Naturhistorisches Museum Wien, Geologisch-Paläontologische Abteilung",
                          "abcd:Abbreviation": "NHMW-Geo"
                        }
                      }
                    },
                    "abcd:Person": { "abcd:FullName": "Andreas Kroh" },
                    "abcd:Addresses": {
                      "abcd:Address": "Burgring 7, A-1010 Vienna, Austria"
                    },
                    "abcd:TelephoneNumbers": {
                      "abcd:TelephoneNumber": {
                        "abcd:Number": "+43 (1) 52 177-576"
                      }
                    },
                    "abcd:EmailAddresses": {
                      "abcd:EmailAddress": "andreas.kroh@nhm-wien.ac.at"
                    },
                    "abcd:URIs": {
                      "abcd:URL":
                        "http://www.nhm-wien.ac.at/forschung/geologie__palaeontologie"
                    },
                    "abcd:LogoURI":
                      "http://www2.nhm-wien.ac.at/public/NHM_Logo_Geocase_Geo.gif"
                  }
                },
                "abcd:IPRStatements": {
                  "abcd:Copyrights": {
                    "abcd:Copyright": {
                      "abcd:Text":
                        "Restrictions of use apply to conditions explained in the terms-of-use section. Distribution of data to a third party must be assured to be in compliance with the terms-of-use, and must include full information on legal-owner, supplier, description, and disclaimer."
                    }
                  },
                  "abcd:TermsOfUseStatements": {
                    "abcd:TermsOfUse": {
                      "abcd:Text":
                        "For scientific and non-commercial purposes, the database can be consulted freely. Source of the data must always be specified appropriately. If scientific publications are (partly) based on these data, authors are kindly requested to inform the legal owner. Commercial use is not granted without prior written permission by the legal owner."
                    }
                  },
                  "abcd:Disclaimers": {
                    "abcd:Disclaimer": {
                      "abcd:Text":
                        'We guarantee the data to be checked to our best knowledge. Nevertheless errors can not be excluded, and data are provided "as is" with no warranties of any kind.'
                    }
                  },
                  "abcd:Acknowledgements": {
                    "abcd:Acknowledgement": {
                      "abcd:Text":
                        "The help and efforts by staff members and volunteers who are assisting in data revision and digitalisation of old registers are herewith gratefully acknowledged."
                    }
                  }
                }
              },
              "abcd:Units": {
                "abcd:Unit": {
                  "abcd:SourceInstitutionID": "NHMW",
                  "abcd:SourceID": "NHMW-Geo",
                  "abcd:UnitID": "2011/0034/0002",
                  "abcd:UnitIDNumeric": "135509",
                  "abcd:LastEditor": "Andreas Kroh",
                  "abcd:DateLastEdited": "2011-03-22",
                  "abcd:RecordBasis": "fossil specimen",
                  "abcd:SpecimenUnit": {
                    "abcd:NomenclaturalTypeDesignations": {
                      "abcd:NomenclaturalTypeDesignation": {
                        "abcd:NomenclaturalReference": {
                          "abcd:TitleCitation":
                            "Sovis,W.1998. Beiträge zur Paläontologie, 23",
                          "abcd:CitationDetail": "p. 41"
                        },
                        "abcd:TypeStatus": "reference specimen"
                      }
                    }
                  },
                  "abcd:NamedCollectionsOrSurveys": {
                    "abcd:NamedCollectionOrSurvey":
                      "NHM Vienna Geology & Palaeontology"
                  },
                  "abcd:Gathering": {
                    "abcd:LocalityText": "Teiritzberg, bei Korneuburg",
                    "abcd:Country": { "abcd:Name": "Austria" },
                    "abcd:NamedAreas": {
                      "abcd:NamedArea": {
                        "abcd:AreaClass": "province",
                        "abcd:AreaName": "Niederösterreich"
                      }
                    }
                  },
                  "abcd:UnitExtension": {
                    "efg:EarthScienceSpecimen": {
                      "efg:UnitStratigraphicDetermination": {
                        "efg:ChronostratigraphicAttributions": {
                          "efg:ChronostratigraphicAttribution": [
                            {
                              "efg:ChronoStratigraphicDivision": "Era",
                              "efg:ChronostratigraphicName": "Cenozoic"
                            },
                            {
                              "efg:ChronoStratigraphicDivision": "Epoch",
                              "efg:ChronostratigraphicName": "Miocene"
                            },
                            {
                              "efg:ChronoStratigraphicDivision": "Period",
                              "efg:ChronostratigraphicName": "Neogene"
                            },
                            {
                              "efg:ChronoStratigraphicDivision": "Stage",
                              "efg:ChronostratigraphicName": "Burdigalian"
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        itemHeaders: [
          { text: "type", value: "typestatus" },
          { text: "collection", value: "collectioncode" },
          { text: "objectId", value: "unitid" },
          { text: "typeStatus", value: "type_status" },
          { text: "group", value: "highertaxon" },
          { text: "country", value: "country" },
          { text: "area", value: "area" },
          { text: "areaDetail", value: "areaDetail" },
          { text: "locality", value: "locality" },
          { text: "latitude", value: "latitude" },
          { text: "longitude", value: "longitude" },
          { text: "stratigraphy", value: "stratigraphy" },
          { text: "reference", value: "reference" },
          { text: "mindat", value: "mindat_url" },
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
      },
      expected: [
        true,
        {
          country_original: "Austria",
          area_name: "Niederösterreich",
          country: "Austria",
          collectioncode: "NHMW-Geo",
          gatheringareas: ["Niederösterreich"],
          datasetownerabbrev: "NHMW-Geo",
          last_harvested_processing: "2020-11-19T14:57:46Z",
          id: "306087",
          recordbasis: "FossilSpecimen",
          datasourcecountry: "Austria",
          locality: "Teiritzberg, bei Korneuburg",
          occurrenceid: 306087,
          provideraddress: "Burgring 7, A-1010 Vienna, Austria",
          area_type: "province",
          has_map: false,
          datasourceurl:
            "http://131.130.131.9/biocase/pywrapper.cgi?dsa=gbif_w-geocase",
          datasetowner:
            "Naturhistorisches Museum Wien, Geologisch-Paläontologische Abteilung",
          providercountry: "Austria",
          type_status: "reference specimen",
          providerurl:
            "https://www.nhm-wien.ac.at/forschung/geologie__palaeontologie",
          has_image: false,
          providername: "NHM Vienna, Geology and Palaeontology",
          unitid: "2011/0034/0002",
          _version_: 1685065940392214500
        },
        false,
        false,
        true
      ]
    },
    // ID 432565
    {
      state: {
        response: [
          {
            country_original: "Schweden",
            country: "Sweden",
            collectioncode: "MIN",
            mindat_id: 3337,
            is_mineral: true,
            datasetownerabbrev: "MfN",
            last_harvested_processing: "2020-11-19T23:36:04Z",
            id: "432565",
            recordbasis: "OtherSpecimen",
            datasourcecountry: "Germany",
            locality: "Sallerup",
            mindat_url: "https://www.mindat.org/min-3337.html",
            occurrenceid: 432565,
            provideraddress: "Invalidenstraße 43, 10115 Berlin, Germany",
            has_map: false,
            datasourceurl:
              "http://biocase.naturkundemuseum-berlin.de/current/pywrapper.cgi?dsa=mfn_Mineralogy",
            datasetowner: "Museum für Naturkunde Berlin",
            fullscientificname: "Quarz (Quartz)",
            providercountry: "Germany",
            providerurl:
              "https://www.museumfuernaturkunde.berlin/en/science/minerals",
            has_image: false,
            providername: "Museum für Naturkunde",
            names: ["Quarz"],
            unitid: "MFN_MIN_2008_12996",
            _version_: 1685065958846103600
          }
        ],
        responseFromSource: {
          "abcd:DataSets": {
            "abcd:DataSet": {
              "abcd:TechnicalContacts": {
                "abcd:TechnicalContact": {
                  "abcd:Name": "GeoCASE-Team",
                  "abcd:Email": "geocase@mfn-berlin.de",
                  "abcd:Phone": "+49 30 2093 8842",
                  "abcd:Address":
                    "Museum für Naturkunde Invaliden Str. 43  10115 Berlin Deutschland"
                }
              },
              "abcd:ContentContacts": {
                "abcd:ContentContact": {
                  "abcd:Name": "Ralf-Thomas Schmitt",
                  "abcd:Email": "Ralf-Thomas.Schmitt@museum.hu-berlin.de",
                  "abcd:Phone": "+49 30 2093 8842",
                  "abcd:Address":
                    "Museum für Naturkunde Invaliden Str. 43  10115 Berlin Deutschland"
                }
              },
              "abcd:Metadata": {
                "abcd:Description": {
                  "abcd:Representation": {
                    "abcd:Title": "MfN Mineralogical Collections"
                  }
                },
                "abcd:RevisionData": { "abcd:DateModified": "2014-09-12" },
                "abcd:Owners": {
                  "abcd:Owner": {
                    "abcd:Organisation": {
                      "abcd:Name": {
                        "abcd:Representation": {
                          "abcd:Text": "Museum für Naturkunde Berlin",
                          "abcd:Abbreviation": "MfN"
                        }
                      }
                    },
                    "abcd:Person": { "abcd:FullName": "Ralf-Thomas Schmitt" },
                    "abcd:Addresses": {
                      "abcd:Address":
                        "Museum für Naturkunde Invaliden Str. 43  10115 Berlin Deutschland"
                    },
                    "abcd:TelephoneNumbers": {
                      "abcd:TelephoneNumber": {
                        "abcd:Number": "+49 30 2093 8842",
                        "abcd:Device": "voice"
                      }
                    },
                    "abcd:EmailAddresses": {
                      "abcd:EmailAddress":
                        "Ralf-Thomas.Schmitt@museum.hu-berlin.de"
                    }
                  }
                },
                "abcd:IPRStatements": {
                  "abcd:IPRDeclarations": {
                    "abcd:IPRDeclaration": {
                      "abcd:Text": "Creative Commons (CC-by-SA)",
                      "abcd:Details": "Creative Commons (CC-by-SA)",
                      "abcd:URI":
                        "http://creativecommons.org/licenses/by-sa/3.0/"
                    }
                  },
                  "abcd:Licenses": {
                    "abcd:License": {
                      "abcd:Text": "Creative Commons (CC-by-SA)",
                      "abcd:Details": "Creative Commons (CC-by-SA)",
                      "abcd:URI":
                        "http://creativecommons.org/licenses/by-sa/3.0/"
                    }
                  }
                }
              },
              "abcd:Units": {
                "abcd:Unit": {
                  "abcd:SourceInstitutionID": "MFN",
                  "abcd:SourceID": "MIN",
                  "abcd:UnitID": "MFN_MIN_2008_12996",
                  "abcd:Owner": {
                    "abcd:Organisation": {
                      "abcd:Name": {
                        "abcd:Representation": {
                          "abcd:Text": "Museum für Naturkunde Berlin",
                          "abcd:Abbreviation": "MfN"
                        }
                      }
                    }
                  },
                  "abcd:Identifications": {
                    "abcd:Identification": {
                      "abcd:Result": {
                        "abcd:Extension": {
                          "efg:MineralRockIdentified": {
                            "efg:MineralRockGroup": {
                              "efg:MineralRockGroupName": "Quarz"
                            },
                            "efg:ClassifiedName": {
                              "efg:FullScientificNameString": "Quarz"
                            },
                            "efg:VarietalNameString": "Chalcedon",
                            "efg:NameAddendum": "Feuerstein"
                          }
                        }
                      }
                    }
                  },
                  "abcd:RecordBasis": "OtherSpecimen",
                  "abcd:KindOfUnit": "Mineral",
                  "abcd:Gathering": {
                    "abcd:LocalityText": "Sallerup",
                    "abcd:Country": { "abcd:Name": "Schweden" },
                    "abcd:NearNamedPlaces": {
                      "abcd:NamedPlaceRelation": {
                        "abcd:NearNamedPlace": "bei Västra"
                      }
                    },
                    "abcd:AreaDetail": "Värmland Västra Götalands län"
                  },
                  "abcd:UnitExtension": {
                    "efg:EarthScienceSpecimen": { "efg:UnitWeight": "43.2 g" }
                  }
                }
              }
            }
          }
        },
        itemHeaders: [
          { text: "type", value: "typestatus" },
          { text: "collection", value: "collectioncode" },
          { text: "objectId", value: "unitid" },
          { text: "typeStatus", value: "type_status" },
          { text: "group", value: "highertaxon" },
          { text: "country", value: "country" },
          { text: "area", value: "area" },
          { text: "areaDetail", value: "areaDetail" },
          { text: "locality", value: "locality" },
          { text: "latitude", value: "latitude" },
          { text: "longitude", value: "longitude" },
          { text: "stratigraphy", value: "stratigraphy" },
          { text: "reference", value: "reference" },
          { text: "mindat", value: "mindat_url" },
          { text: "unitWeight", value: "unitWeight" },
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
      },
      expected: [
        true,
        {
          country_original: "Schweden",
          country: "Sweden",
          collectioncode: "MIN",
          mindat_id: 3337,
          is_mineral: true,
          datasetownerabbrev: "MfN",
          last_harvested_processing: "2020-11-19T23:36:04Z",
          id: "432565",
          recordbasis: "OtherSpecimen",
          datasourcecountry: "Germany",
          locality: "Sallerup",
          mindat_url: "https://www.mindat.org/min-3337.html",
          occurrenceid: 432565,
          provideraddress: "Invalidenstraße 43, 10115 Berlin, Germany",
          has_map: false,
          datasourceurl:
            "http://biocase.naturkundemuseum-berlin.de/current/pywrapper.cgi?dsa=mfn_Mineralogy",
          datasetowner: "Museum für Naturkunde Berlin",
          fullscientificname: "Quarz (Quartz)",
          providercountry: "Germany",
          providerurl:
            "https://www.museumfuernaturkunde.berlin/en/science/minerals",
          has_image: false,
          providername: "Museum für Naturkunde",
          names: ["Quarz"],
          unitid: "MFN_MIN_2008_12996",
          _version_: 1685065958846103600
        },
        false,
        false,
        false
      ]
    }
  ];

  testCases.forEach(testCase => {
    it("itemExists", () => {
      const result = getters.itemExists(testCase.state);

      expect(result).toEqual(testCase.expected[0]);
    });

    it("item", () => {
      const itemExists = testCase.expected[0];
      const result = getters.item(testCase.state, { itemExists });

      expect(result).toEqual(testCase.expected[1]);
    });

    it("imageExists", () => {
      const itemExists = testCase.expected[0];
      const item = testCase.expected[1];
      const result = getters.imageExists(testCase.state, { itemExists, item });

      expect(result).toEqual(testCase.expected[2]);
    });

    it("localityExists", () => {
      const itemExists = testCase.expected[0];
      const item = testCase.expected[1];
      const result = getters.localityExists(testCase.state, {
        itemExists,
        item
      });

      expect(result).toEqual(testCase.expected[3]);
    });

    it("isItemFossil", () => {
      const item = testCase.expected[1];
      const result = getters.isItemFossil(testCase.state, {
        item
      });

      expect(result).toEqual(testCase.expected[4]);
    });
  });
});
