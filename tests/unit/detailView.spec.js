import getters from "@/store/modules/detail/getters";
import i18n from "@/i18n";

describe("DetailViewGetters", () => {
  i18n.locale = "en";

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
      expected: [
        false,
        [],
        false,
        false,
        false,
        false,
        false,
        false,
        null,
        undefined,
        undefined,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        null,
        null,
        null,
        undefined,
        undefined,
        undefined,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        null,
        [
          { text: "Type", value: "typestatus" },
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Group", value: "highertaxon" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
          { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
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
        ],
        [],
        []
      ]
    },
    // ID 306087 FOSSIL NHMW-GEO
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
            recordbasis: "Fossil",
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
          recordbasis: "Fossil",
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
        true,
        false,
        false,
        false,
        [
          "Era: Cenozoic",
          "Epoch: Miocene",
          "Period: Neogene",
          "Stage: Burdigalian"
        ],
        {
          "abcd:Address": "Burgring 7, A-1010 Vienna, Austria",
          "abcd:Email": "andreas.kroh@nhm-wien.ac.at",
          "abcd:Name": "Andreas Kroh",
          "abcd:Phone": "+43 (1) 52 177-576"
        },
        "Andreas Kroh",
        "andreas.kroh@nhm-wien.ac.at",
        "+43 (1) 52 177-576",
        "Burgring 7, A-1010 Vienna, Austria",
        "http://www2.nhm-wien.ac.at/public/NHM_Logo_Geocase_Geo.gif",
        "NHM Vienna, Geology and Palaeontology",
        "http://www.nhm-wien.ac.at/forschung/geologie__palaeontologie",
        "Restrictions of use apply to conditions explained in the terms-of-use section. Distribution of data to a third party must be assured to be in compliance with the terms-of-use, and must include full information on legal-owner, supplier, description, and disclaimer.",
        "For scientific and non-commercial purposes, the database can be consulted freely. Source of the data must always be specified appropriately. If scientific publications are (partly) based on these data, authors are kindly requested to inform the legal owner. Commercial use is not granted without prior written permission by the legal owner.",
        'We guarantee the data to be checked to our best knowledge. Nevertheless errors can not be excluded, and data are provided "as is" with no warranties of any kind.',
        "The help and efforts by staff members and volunteers who are assisting in data revision and digitalisation of old registers are herewith gratefully acknowledged.",
        "2011-03-22",
        ["province: Niederösterreich"],
        null,
        undefined,
        undefined,
        "Sovis,W.1998. Beiträge zur Paläontologie, 23 p. 41",
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        null,
        [
          { text: "Type", value: "typestatus" },
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Group", value: "highertaxon" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
          { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
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
        ],
        [
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Locality", value: "locality" },
          { text: "Stratigraphy", value: "stratigraphy" }
        ],
        [
          { text: "Institution", value: "institutionHomepage" },
          { text: "Dataset owner", value: "datasetowner" },
          { text: "Contact person", value: "contentContactName" },
          { text: "Contact e-mail", value: "contentContactEmail" },
          { text: "Contact phone", value: "contentContactPhone" },
          { text: "Contact address", value: "contentContactAddress" },
          { text: "Data source country", value: "datasourcecountry" },
          { text: "Copyright", value: "copyrights" },
          { text: "Terms of use", value: "termsofusestatements" },
          { text: "Disclaimer", value: "disclaimers" },
          { text: "Acknowledgement", value: "acknowledgements" },
          { text: "Last Edited", value: "dateLastEdited" },
          { text: "Last harvested", value: "last_harvested_processing" },
          { text: "Provider name", value: "providername" },
          { text: "GeoCASe ID", value: "id" }
        ]
      ]
    },
    // ID 432565 OTHER MFN
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
            recordbasis: "Other",
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
          recordbasis: "Other",
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
        false,
        false,
        false,
        false,
        null,
        {
          "abcd:Address":
            "Museum für Naturkunde Invaliden Str. 43  10115 Berlin Deutschland",
          "abcd:Email": "Ralf-Thomas.Schmitt@museum.hu-berlin.de",
          "abcd:Name": "Ralf-Thomas Schmitt",
          "abcd:Phone": "+49 30 2093 8842"
        },
        "Ralf-Thomas Schmitt",
        "Ralf-Thomas.Schmitt@museum.hu-berlin.de",
        "+49 30 2093 8842",
        "Museum für Naturkunde Invaliden Str. 43  10115 Berlin Deutschland",
        undefined,
        "MfN Mineralogical Collections",
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        "2014-09-12",
        null,
        null,
        undefined,
        undefined,
        undefined,
        null,
        "Värmland Västra Götalands län",
        "43.2 g",
        "bei Västra",
        undefined,
        undefined,
        undefined,
        "Mineral",
        "Quarz",
        "Feuerstein Chalcedon",
        [
          { text: "Type", value: "typestatus" },
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Group", value: "highertaxon" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Weight", value: "unitWeight" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
          { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
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
        ],
        [
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Country", value: "country" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Locality", value: "locality" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Weight", value: "unitWeight" }
        ],
        [
          { text: "Institution", value: "institutionHomepage" },
          { text: "Dataset owner", value: "datasetowner" },
          { text: "Contact person", value: "contentContactName" },
          { text: "Contact e-mail", value: "contentContactEmail" },
          { text: "Contact phone", value: "contentContactPhone" },
          { text: "Contact address", value: "contentContactAddress" },
          { text: "Data source country", value: "datasourcecountry" },
          { text: "Last Edited", value: "dateLastEdited" },
          { text: "Last harvested", value: "last_harvested_processing" },
          { text: "Provider name", value: "providername" },
          { text: "GeoCASe ID", value: "id" }
        ]
      ]
    },
    // 180237 FOSSIL GIT
    {
      state: {
        response: [
          {
            country_original: "Latvia",
            country: "Latvia",
            collectioncode: "GIT",
            is_mineral: false,
            datasetownerabbrev: "GIT",
            last_harvested_processing: "2020-11-17T19:46:59Z",
            id: "180237",
            longitude: 25.406625,
            highertaxon: "Osteichthyes",
            images: [
              "https://files.geocollections.info/medium/86/fb/86fbf311-a665-47f6-826b-524c1c9b4fa7.jpg",
              "https://files.geocollections.info/medium/b7/34/b734e8df-735f-4a68-9879-b8e35c8ac385.jpg",
              "https://files.geocollections.info/medium/e3/20/e320a3ba-a591-482a-97ee-a3cce8d95c60.jpg",
              "https://files.geocollections.info/medium/ea/79/ea79cb97-7163-49d3-a9c9-031a903c937b.jpg"
            ],
            recordbasis: "Fossil",
            higherrank: "Superclass",
            datasourcecountry: "Estonia",
            locality: "Lode quarry",
            occurrenceid: 180237,
            provideraddress: "Estonia",
            has_map: true,
            highertaxa: ["Osteichthyes"],
            datasourceurl:
              "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
            datasetowner: "Department of Geology, TalTech",
            fullscientificname: "Panderichthys rhombolepis (Gross, 1930)",
            latitude: 57.390606,
            image_license: "CC BY-NC",
            providercountry: "Estonia",
            stratigraphy: "Gauja Stage",
            providerurl: "https://geocollections.info/",
            has_image: true,
            image_author: "Baranov, G.",
            recordURI: "https://geocollections.info/specimen/102680",
            coordinates: "57.390606,25.406625",
            image_date: "2008-10-16",
            collectorname: "Kurik",
            providername: "SARV",
            url:
              "https://files.geocollections.info/medium/e3/20/e320a3ba-a591-482a-97ee-a3cce8d95c60.jpg",
            relatedResource: "https://geocollections.info/file/33637",
            names: [
              "Panderichthys rhombolepis",
              "Panderichthys rhombolepis (Gross, 1930)"
            ],
            unitid: "434-1",
            _version_: 1685065918809374700,
            highertaxon_facet: "Osteichthyes"
          }
        ],
        responseFromSource: {
          "abcd:DataSets": {
            "abcd:DataSet": {
              "abcd:TechnicalContacts": {
                "abcd:TechnicalContact": {
                  "abcd:Name": "Olle Hints",
                  "abcd:Email": "olle.hints@taltech.ee",
                  "abcd:Phone": "+3726203027"
                }
              },
              "abcd:ContentContacts": {
                "abcd:ContentContact": {
                  "abcd:Name": "Ursula Toom",
                  "abcd:Email": "ursula.toom@taltech.ee",
                  "abcd:Phone": "+3726203009",
                  "abcd:Address": "Ehitajate 5, 19086 Tallinn, Estonia"
                }
              },
              "abcd:Metadata": {
                "abcd:Description": {
                  "abcd:Representation": {
                    "abcd:Title": "TalTech geological collections",
                    "abcd:Details":
                      "Geological and paleontological collections housed at the Institute of Geology at Tallinn University of Technology (formerly an institute of the Estonian Academy of Sciences) are the largest of their kind in Estonia. The particular strength of the collection lies in Ordovician and Silurian invertebrates and Devonian fish fossils of the Baltica paleocontinent. Most of the ca 300000 specimens are collected since the mid 20th century, few collections date back to 1850s.",
                    "abcd:Coverage":
                      "Invertebrate and early vertebrate fossils, and sedimentary rocks primarily from the Paleozoic strata of Baltic Region and former Soviet Union; Quaternary sediments and fossils from Estonia; minerals and meteorites of worldwide coverage.",
                    "abcd:URI": "https://geocollections.info"
                  }
                },
                "abcd:RevisionData": {
                  "abcd:DateModified": "2020-11-04T23:29:19"
                },
                "abcd:Owners": {
                  "abcd:Owner": {
                    "abcd:Organisation": {
                      "abcd:Name": {
                        "abcd:Representation": {
                          "abcd:Text": "Department of Geology, TalTech",
                          "abcd:Abbreviation": "GIT"
                        }
                      }
                    },
                    "abcd:Person": { "abcd:FullName": "Ursula Toom" },
                    "abcd:Roles": { "abcd:Role": "Chief Curator" },
                    "abcd:Addresses": {
                      "abcd:Address": "Ehitajate 5, 19086 Tallinn, Estonia"
                    },
                    "abcd:EmailAddresses": {
                      "abcd:EmailAddress": "ursula.toom@taltech.ee"
                    },
                    "abcd:LogoURI":
                      "https://files.geocollections.info/img/geocase/taltech1.png"
                  }
                },
                "abcd:IPRStatements": {
                  "abcd:Copyrights": {
                    "abcd:Copyright": {
                      "abcd:Text": "© Department of Geology, TalTech"
                    }
                  },
                  "abcd:Licenses": {
                    "abcd:License": {
                      "abcd:Text": "(CC) BY-NC",
                      "abcd:Details":
                        "Creative Commons Attribution-NonCommercial 4.0 Unported License",
                      "abcd:URI":
                        "http://creativecommons.org/licenses/by-nc/4.0/"
                    }
                  },
                  "abcd:TermsOfUseStatements": {
                    "abcd:TermsOfUse": {
                      "abcd:Text":
                        "Free for non-commercial usage, provided that Department of Geology at TalTech and https://geocollections.info are acknowledged."
                    }
                  },
                  "abcd:Disclaimers": {
                    "abcd:Disclaimer": {
                      "abcd:Text":
                        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility."
                    }
                  },
                  "abcd:Acknowledgements": {
                    "abcd:Acknowledgement": {
                      "abcd:Text":
                        "National geological collection of Estonia; Department of Geology, TalTech"
                    }
                  },
                  "abcd:Citations": {
                    "abcd:Citation": {
                      "abcd:Text":
                        "National geological collection of Estonia; Department of Geology, TalTech"
                    }
                  }
                }
              },
              "abcd:Units": {
                "abcd:Unit": {
                  "abcd:SourceInstitutionID": "Department of Geology, TalTech",
                  "abcd:SourceID": "GIT",
                  "abcd:UnitID": "434-1",
                  "abcd:UnitIDNumeric": "102680",
                  "abcd:DateLastEdited": "2010-05-24T14:51:53",
                  "abcd:UnitReferences": {
                    "abcd:UnitReference": [
                      {
                        "abcd:TitleCitation": "Boisvert, 2009a",
                        "abcd:CitationDetail": "Une pêche miraculese"
                      },
                      {
                        "abcd:TitleCitation": "Boisvert, 2009b",
                        "abcd:CitationDetail":
                          "The origin of tertrapod limbs and girdles: fossil and developmental evidence"
                      },
                      {
                        "abcd:TitleCitation": "Boisvert, 2009",
                        "abcd:CitationDetail":
                          "The humerus of Panderichthys in three dimensions and its significance in the context of the fish-tetrapod transition",
                        "abcd:URI": "10.1111/j.1463-6395.2008.00389.x"
                      },
                      {
                        "abcd:TitleCitation": "Vorobyeva & Kuznetsov, 1992",
                        "abcd:CitationDetail":
                          "The locomotor apparatus of Panderichthys rhombolepis (Gross), a supplement to the problem of fish-tetrapod transition"
                      },
                      {
                        "abcd:TitleCitation": "Boisvert et al., 2008",
                        "abcd:CitationDetail":
                          "The pectoral fin of Panderichthys and the origin of digits",
                        "abcd:URI": "10.1038/nature07339"
                      },
                      {
                        "abcd:TitleCitation": "Boisvert, 2005",
                        "abcd:CitationDetail":
                          "The pelvic fin and girdle of Panderichthys and the origin of tetrapod locomotion",
                        "abcd:URI": "10.1038/nature04119"
                      },
                      {
                        "abcd:TitleCitation": "Steyer, 2009",
                        "abcd:CitationDetail": "La Terre avant les dinosaures"
                      }
                    ]
                  },
                  "abcd:Identifications": {
                    "abcd:Identification": [
                      {
                        "abcd:Result": {
                          "abcd:TaxonIdentified": {
                            "abcd:HigherTaxa": {
                              "abcd:HigherTaxon": {
                                "abcd:HigherTaxonName": "Osteichthyes",
                                "abcd:HigherTaxonRank": "Superclass"
                              }
                            },
                            "abcd:ScientificName": {
                              "abcd:FullScientificNameString":
                                "Panderichthys rhombolepis (Gross, 1930)",
                              "abcd:NameAtomised": {
                                "abcd:Zoological": {
                                  "abcd:SpeciesEpithet": "rhombolepis"
                                }
                              }
                            }
                          }
                        },
                        "abcd:PreferredFlag": "1"
                      },
                      {
                        "abcd:Result": {
                          "abcd:TaxonIdentified": {
                            "abcd:HigherTaxa": {
                              "abcd:HigherTaxon": {
                                "abcd:HigherTaxonName": "Osteichthyes",
                                "abcd:HigherTaxonRank": "Superclass"
                              }
                            },
                            "abcd:ScientificName": {
                              "abcd:FullScientificNameString":
                                "Panderichthys rhombolepis",
                              "abcd:NameAtomised": {
                                "abcd:Zoological": {
                                  "abcd:SpeciesEpithet": "rhombolepis"
                                }
                              }
                            }
                          }
                        },
                        "abcd:PreferredFlag": "1"
                      }
                    ]
                  },
                  "abcd:RecordBasis": "FossilSpecimen",
                  "abcd:KindOfUnit": "specimen in parts",
                  "abcd:MultiMediaObjects": {
                    "abcd:MultiMediaObject": [
                      {
                        "abcd:ID": "33637",
                        "abcd:FileURI":
                          "https://files.geocollections.info/medium/e3/20/e320a3ba-a591-482a-97ee-a3cce8d95c60.jpg",
                        "abcd:ProductURI":
                          "https://geocollections.info/file/33637",
                        "abcd:Format": "image/jpg",
                        "abcd:FileSize": "0.8",
                        "abcd:IPR": {
                          "abcd:Licenses": {
                            "abcd:License": {
                              "abcd:Text": "CC BY-NC",
                              "abcd:URI":
                                "http://creativecommons.org/licenses/by-nc/3.0/"
                            }
                          }
                        },
                        "abcd:CreatedDate": "2008-10-16",
                        "abcd:Creator": "Baranov, G."
                      },
                      {
                        "abcd:ID": "33966",
                        "abcd:FileURI":
                          "https://files.geocollections.info/medium/86/fb/86fbf311-a665-47f6-826b-524c1c9b4fa7.jpg",
                        "abcd:ProductURI":
                          "https://geocollections.info/file/33966",
                        "abcd:Format": "image/jpg",
                        "abcd:FileSize": "1.3",
                        "abcd:IPR": {
                          "abcd:Licenses": {
                            "abcd:License": {
                              "abcd:Text": "CC BY-NC",
                              "abcd:URI":
                                "http://creativecommons.org/licenses/by-nc/3.0/"
                            }
                          }
                        },
                        "abcd:CreatedDate": "2008-10-16",
                        "abcd:Creator": "Baranov, G."
                      },
                      {
                        "abcd:ID": "33967",
                        "abcd:FileURI":
                          "https://files.geocollections.info/medium/b7/34/b734e8df-735f-4a68-9879-b8e35c8ac385.jpg",
                        "abcd:ProductURI":
                          "https://geocollections.info/file/33967",
                        "abcd:Format": "image/jpg",
                        "abcd:FileSize": "1.6",
                        "abcd:IPR": {
                          "abcd:Licenses": {
                            "abcd:License": {
                              "abcd:Text": "CC BY-NC",
                              "abcd:URI":
                                "http://creativecommons.org/licenses/by-nc/3.0/"
                            }
                          }
                        },
                        "abcd:CreatedDate": "2008-10-16",
                        "abcd:Creator": "Baranov, G."
                      },
                      {
                        "abcd:ID": "33968",
                        "abcd:FileURI":
                          "https://files.geocollections.info/medium/ea/79/ea79cb97-7163-49d3-a9c9-031a903c937b.jpg",
                        "abcd:ProductURI":
                          "https://geocollections.info/file/33968",
                        "abcd:Format": "image/jpg",
                        "abcd:FileSize": "1.5",
                        "abcd:IPR": {
                          "abcd:Licenses": {
                            "abcd:License": {
                              "abcd:Text": "CC BY-NC",
                              "abcd:URI":
                                "http://creativecommons.org/licenses/by-nc/3.0/"
                            }
                          }
                        },
                        "abcd:CreatedDate": "2008-10-16",
                        "abcd:Creator": "Baranov, G."
                      }
                    ]
                  },
                  "abcd:Gathering": {
                    "abcd:DateTime": { "abcd:DateText": "1972" },
                    "abcd:Agents": {
                      "abcd:GatheringAgent": {
                        "abcd:AgentText": "Kurik",
                        "abcd:Person": {
                          "abcd:FullName": "Kurik",
                          "abcd:AtomisedName": {
                            "abcd:InheritedName": "Kurik",
                            "abcd:GivenNames": "Elga"
                          }
                        }
                      }
                    },
                    "abcd:LocalityText": "Lode quarry",
                    "abcd:Country": { "abcd:Name": "Latvia" },
                    "abcd:SiteCoordinateSets": {
                      "abcd:SiteCoordinates": {
                        "abcd:CoordinateMethod": "Google Maps / Earth",
                        "abcd:CoordinatesLatLong": {
                          "abcd:LongitudeDecimal": "25.406625",
                          "abcd:LatitudeDecimal": "57.390606",
                          "abcd:SpatialDatum": "WGS84",
                          "abcd:AccuracyStatement": "10-100 m",
                          "abcd:CoordinateErrorDistanceInMeters": "100"
                        }
                      }
                    },
                    "abcd:Stratigraphy": {
                      "abcd:ChronostratigraphicTerms": {
                        "abcd:ChronostratigraphicTerm": [
                          { "abcd:Term": "Gauja Stage" },
                          { "abcd:Term": "Givetian" }
                        ]
                      }
                    }
                  },
                  "abcd:RecordURI":
                    "https://geocollections.info/specimen/102680",
                  "abcd:UnitExtension": {
                    "efg:EarthScienceSpecimen": {
                      "efg:UnitStratigraphicDetermination": {
                        "efg:ChronostratigraphicAttributions": {
                          "efg:ChronostratigraphicAttribution": {
                            "efg:ChronoStratigraphicDivision": "Stage",
                            "efg:ChronostratigraphicName": "Gauja Stage"
                          }
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
          { text: "unitDateText", value: "unitDateText" },
          { text: "kindOfUnit", value: "kindOfUnit" },
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
          country_original: "Latvia",
          country: "Latvia",
          collectioncode: "GIT",
          is_mineral: false,
          datasetownerabbrev: "GIT",
          last_harvested_processing: "2020-11-17T19:46:59Z",
          id: "180237",
          longitude: 25.406625,
          highertaxon: "Osteichthyes",
          images: [
            "https://files.geocollections.info/medium/86/fb/86fbf311-a665-47f6-826b-524c1c9b4fa7.jpg",
            "https://files.geocollections.info/medium/b7/34/b734e8df-735f-4a68-9879-b8e35c8ac385.jpg",
            "https://files.geocollections.info/medium/e3/20/e320a3ba-a591-482a-97ee-a3cce8d95c60.jpg",
            "https://files.geocollections.info/medium/ea/79/ea79cb97-7163-49d3-a9c9-031a903c937b.jpg"
          ],
          recordbasis: "Fossil",
          higherrank: "Superclass",
          datasourcecountry: "Estonia",
          locality: "Lode quarry",
          occurrenceid: 180237,
          provideraddress: "Estonia",
          has_map: true,
          highertaxa: ["Osteichthyes"],
          datasourceurl:
            "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
          datasetowner: "Department of Geology, TalTech",
          fullscientificname: "Panderichthys rhombolepis (Gross, 1930)",
          latitude: 57.390606,
          image_license: "CC BY-NC",
          providercountry: "Estonia",
          stratigraphy: "Gauja Stage",
          providerurl: "https://geocollections.info/",
          has_image: true,
          image_author: "Baranov, G.",
          recordURI: "https://geocollections.info/specimen/102680",
          coordinates: "57.390606,25.406625",
          image_date: "2008-10-16",
          collectorname: "Kurik",
          providername: "SARV",
          url:
            "https://files.geocollections.info/medium/e3/20/e320a3ba-a591-482a-97ee-a3cce8d95c60.jpg",
          relatedResource: "https://geocollections.info/file/33637",
          names: [
            "Panderichthys rhombolepis",
            "Panderichthys rhombolepis (Gross, 1930)"
          ],
          unitid: "434-1",
          _version_: 1685065918809374700,
          highertaxon_facet: "Osteichthyes"
        },
        true,
        true,
        true,
        false,
        false,
        false,
        ["Stage: Gauja Stage"],
        {
          "abcd:Address": "Ehitajate 5, 19086 Tallinn, Estonia",
          "abcd:Email": "ursula.toom@taltech.ee",
          "abcd:Name": "Ursula Toom",
          "abcd:Phone": "+3726203009"
        },
        "Ursula Toom",
        "ursula.toom@taltech.ee",
        "+3726203009",
        "Ehitajate 5, 19086 Tallinn, Estonia",
        "https://files.geocollections.info/img/geocase/taltech1.png",
        "TalTech geological collections",
        "https://geocollections.info",
        "© Department of Geology, TalTech",
        "Free for non-commercial usage, provided that Department of Geology at TalTech and https://geocollections.info are acknowledged.",
        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility.",
        "National geological collection of Estonia; Department of Geology, TalTech",
        "2010-05-24",
        null,
        null,
        undefined,
        undefined,
        undefined,
        [
          "Boisvert, 2009a Une pêche miraculese",
          "Boisvert, 2009b The origin of tertrapod limbs and girdles: fossil and developmental evidence",
          'Boisvert, 2009 The humerus of Panderichthys in three dimensions and its significance in the context of the fish-tetrapod transition (<a href="https://doi.org/10.1111/j.1463-6395.2008.00389.x" target="ReferenceWindow" style="text-decoration: none;">https://doi.org/10.1111/j.1463-6395.2008.00389.x</a>)',
          "Vorobyeva & Kuznetsov, 1992 The locomotor apparatus of Panderichthys rhombolepis (Gross), a supplement to the problem of fish-tetrapod transition",
          'Boisvert et al., 2008 The pectoral fin of Panderichthys and the origin of digits (<a href="https://doi.org/10.1038/nature07339" target="ReferenceWindow" style="text-decoration: none;">https://doi.org/10.1038/nature07339</a>)',
          'Boisvert, 2005 The pelvic fin and girdle of Panderichthys and the origin of tetrapod locomotion (<a href="https://doi.org/10.1038/nature04119" target="ReferenceWindow" style="text-decoration: none;">https://doi.org/10.1038/nature04119</a>)',
          "Steyer, 2009 La Terre avant les dinosaures"
        ],
        undefined,
        undefined,
        undefined,
        undefined,
        "Kurik",
        "1972",
        "specimen in parts",
        undefined,
        null,
        [
          { text: "Type", value: "typestatus" },
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Group", value: "highertaxon" },
          { text: "Group", value: "itemMineralGroup" },
          { text: "Name detail", value: "mineralNameDetail" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Nearest place", value: "nearNamedPlace" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Weight", value: "unitWeight" },
          { text: "Acquisition date", value: "acquisitionDate" },
          { text: "Collector", value: "gatheringAgent" },
          { text: "Date collected", value: "unitDateText" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
          { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
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
        ],
        [
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Group", value: "highertaxon" },
          { text: "Country", value: "country" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Collector", value: "gatheringAgent" },
          { text: "Date collected", value: "unitDateText" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
          { text: "Institution", value: "institutionHomepage" },
          { text: "Dataset owner", value: "datasetowner" },
          { text: "Contact person", value: "contentContactName" },
          { text: "Contact e-mail", value: "contentContactEmail" },
          { text: "Contact phone", value: "contentContactPhone" },
          { text: "Contact address", value: "contentContactAddress" },
          { text: "Data source country", value: "datasourcecountry" },
          { text: "Copyright", value: "copyrights" },
          { text: "Terms of use", value: "termsofusestatements" },
          { text: "Disclaimer", value: "disclaimers" },
          { text: "Acknowledgement", value: "acknowledgements" },
          { text: "Last Edited", value: "dateLastEdited" },
          { text: "Last harvested", value: "last_harvested_processing" },
          { text: "Provider name", value: "providername" },
          { text: "GeoCASe ID", value: "id" }
        ]
      ]
    },
    //  36394 ROCK TUG
    {
      state: {
        response: [
          {
            country_original: "Estonia",
            country: "Estonia",
            collectioncode: "TUG",
            is_mineral: false,
            datasetownerabbrev: "TUG",
            last_harvested_processing: "2020-11-17T17:43:56Z",
            id: "36394",
            taxon_hierarchy_string: "29-36",
            longitude: 24.816658,
            highertaxon: "Plantae",
            images: [
              "https://files.geocollections.info/medium/6d/c3/6dc377f1-d112-48c3-b19a-c971a5ece63c.jpg"
            ],
            recordbasis: "Rock",
            higherrank: "Kingdom",
            datasourcecountry: "Estonia",
            locality: "Tori Põrgu outcrop",
            occurrenceid: 36394,
            provideraddress: "Estonia",
            taxon_id_pbdb: 151418,
            has_map: true,
            highertaxa: ["Plantae"],
            datasourceurl:
              "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
            datasetowner: "University of Tartu, Natural History Museum",
            fullscientificname: "Plantae",
            latitude: 58.483589,
            image_license: "CC BY-NC",
            providercountry: "Estonia",
            stratigraphy: "Pärnu Stage",
            providerurl: "https://geocollections.info/",
            has_image: true,
            image_author: "Paalits, I.",
            recordURI: "https://geocollections.info/specimen/249840",
            coordinates: "58.483589,24.816658",
            taxon_id: 36,
            image_date: "2014-04-04",
            collectorname: "Kalamees-Pani",
            providername: "SARV",
            url:
              "https://files.geocollections.info/medium/6d/c3/6dc377f1-d112-48c3-b19a-c971a5ece63c.jpg",
            relatedResource: "https://geocollections.info/file/84733",
            names: ["Plantae"],
            unitid: "1667-99",
            _version_: 1685065887861702700,
            highertaxon_facet: "Plantae"
          }
        ],
        responseFromSource: {
          "abcd:DataSets": {
            "abcd:DataSet": {
              "abcd:TechnicalContacts": {
                "abcd:TechnicalContact": {
                  "abcd:Name": "Olle Hints",
                  "abcd:Email": "olle.hints@taltech.ee",
                  "abcd:Phone": "+3726203027"
                }
              },
              "abcd:ContentContacts": {
                "abcd:ContentContact": {
                  "abcd:Name": "Mare Isakar",
                  "abcd:Email": "mare.isakar@ut.ee",
                  "abcd:Phone": "+3727375839",
                  "abcd:Address": "Vanemuise 46, Tartu, Estonia"
                }
              },
              "abcd:Metadata": {
                "abcd:Description": {
                  "abcd:Representation": {
                    "abcd:Title": "TUG geological collections",
                    "abcd:Details": "...",
                    "abcd:Coverage": "fossils, mineral, rocks",
                    "abcd:URI": "https://geocollections.info/about_tug"
                  }
                },
                "abcd:RevisionData": {
                  "abcd:DateModified": "2020-11-04T23:35:07"
                },
                "abcd:Owners": {
                  "abcd:Owner": {
                    "abcd:Organisation": {
                      "abcd:Name": {
                        "abcd:Representation": {
                          "abcd:Text":
                            "University of Tartu, Natural History Museum",
                          "abcd:Abbreviation": "TUG"
                        }
                      }
                    },
                    "abcd:Person": { "abcd:FullName": "Mare Isakar" },
                    "abcd:Roles": { "abcd:Role": "Chief Curator" },
                    "abcd:Addresses": {
                      "abcd:Address": "Vanemuise 46, Tartu, Estonia"
                    },
                    "abcd:EmailAddresses": {
                      "abcd:EmailAddress": "mare.isakar@ut.ee"
                    },
                    "abcd:LogoURI":
                      "https://files.geocollections.info/img/UT_logo.png"
                  }
                },
                "abcd:IPRStatements": {
                  "abcd:Copyrights": {
                    "abcd:Copyright": {
                      "abcd:Text":
                        "© University of Tartu, Natural History Museum"
                    }
                  },
                  "abcd:Licenses": {
                    "abcd:License": {
                      "abcd:Text": "(CC) BY-NC",
                      "abcd:Details":
                        "Creative Commons Attribution-NonCommercial 4.0 Unported License",
                      "abcd:URI":
                        "http://creativecommons.org/licenses/by-nc/4.0/"
                    }
                  },
                  "abcd:TermsOfUseStatements": {
                    "abcd:TermsOfUse": {
                      "abcd:Text":
                        "Free for non-commercial usage, provided that University of Tartu, Natural History Museum, and https://geocollections.info are acknowledged."
                    }
                  },
                  "abcd:Disclaimers": {
                    "abcd:Disclaimer": {
                      "abcd:Text":
                        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility."
                    }
                  },
                  "abcd:Acknowledgements": {
                    "abcd:Acknowledgement": {
                      "abcd:Text":
                        "National geological collection of Estonia: www.geocollections.info; University of Tartu, Natural History Museum"
                    }
                  },
                  "abcd:Citations": {
                    "abcd:Citation": {
                      "abcd:Text":
                        "National geological collection of Estonia: https://geocollections.info;  University of Tartu, Natural History Museum"
                    }
                  }
                }
              },
              "abcd:Units": {
                "abcd:Unit": {
                  "abcd:SourceInstitutionID": "Museum of Geology, UT",
                  "abcd:SourceID": "TUG",
                  "abcd:UnitID": "1667-99",
                  "abcd:UnitIDNumeric": "249840",
                  "abcd:DateLastEdited": "2014-03-31T10:29:24",
                  "abcd:Identifications": {
                    "abcd:Identification": {
                      "abcd:Result": {
                        "abcd:TaxonIdentified": {
                          "abcd:HigherTaxa": {
                            "abcd:HigherTaxon": {
                              "abcd:HigherTaxonName": "Plantae",
                              "abcd:HigherTaxonRank": "Kingdom"
                            }
                          },
                          "abcd:ScientificName": {
                            "abcd:FullScientificNameString": "Plantae"
                          }
                        }
                      },
                      "abcd:PreferredFlag": "1"
                    }
                  },
                  "abcd:RecordBasis": "RockSpecimen",
                  "abcd:KindOfUnit": "part of specimen",
                  "abcd:PalaeontologicalUnit": {
                    "abcd:Preservation": { "abcd:Completeness": "soomus" }
                  },
                  "abcd:MultiMediaObjects": {
                    "abcd:MultiMediaObject": {
                      "abcd:ID": "84733",
                      "abcd:FileURI":
                        "https://files.geocollections.info/medium/6d/c3/6dc377f1-d112-48c3-b19a-c971a5ece63c.jpg",
                      "abcd:ProductURI":
                        "https://geocollections.info/file/84733",
                      "abcd:Format": "image/jpg",
                      "abcd:FileSize": "1",
                      "abcd:IPR": {
                        "abcd:Licenses": {
                          "abcd:License": {
                            "abcd:Text": "CC BY-NC",
                            "abcd:URI":
                              "http://creativecommons.org/licenses/by-nc/3.0/"
                          }
                        }
                      },
                      "abcd:CreatedDate": "2014-04-04",
                      "abcd:Creator": "Paalits, I."
                    }
                  },
                  "abcd:Gathering": {
                    "abcd:DateTime": { "abcd:ISODateTimeBegin": "1982-08-05" },
                    "abcd:Agents": {
                      "abcd:GatheringAgent": {
                        "abcd:AgentText": "Kalamees-Pani",
                        "abcd:Person": {
                          "abcd:FullName": "Kalamees-Pani",
                          "abcd:AtomisedName": {
                            "abcd:InheritedName": "Kalamees",
                            "abcd:GivenNames": "Külli"
                          }
                        }
                      }
                    },
                    "abcd:LocalityText": "Tori Põrgu outcrop",
                    "abcd:Country": {
                      "abcd:Name": "Estonia",
                      "abcd:ISO3166Code": "EE"
                    },
                    "abcd:SiteCoordinateSets": {
                      "abcd:SiteCoordinates": {
                        "abcd:CoordinateMethod": "Est Land Board map server",
                        "abcd:CoordinatesLatLong": {
                          "abcd:LongitudeDecimal": "24.816658",
                          "abcd:LatitudeDecimal": "58.483589",
                          "abcd:SpatialDatum": "WGS84",
                          "abcd:AccuracyStatement": "1-10 m",
                          "abcd:CoordinateErrorDistanceInMeters": "10"
                        }
                      }
                    },
                    "abcd:Stratigraphy": {
                      "abcd:ChronostratigraphicTerms": {
                        "abcd:ChronostratigraphicTerm": [
                          { "abcd:Term": "Pärnu Stage" },
                          { "abcd:Term": "Eifelian" }
                        ]
                      }
                    },
                    "abcd:Notes": "?profiil 2"
                  },
                  "abcd:RecordURI":
                    "https://geocollections.info/specimen/249840",
                  "abcd:UnitExtension": {
                    "efg:EarthScienceSpecimen": {
                      "efg:UnitStratigraphicDetermination": {
                        "efg:ChronostratigraphicAttributions": {
                          "efg:ChronostratigraphicAttribution": {
                            "efg:ChronoStratigraphicDivision": "Stage",
                            "efg:ChronostratigraphicName": "Pärnu Stage"
                          }
                        }
                      }
                    },
                    "efg:PalaeontologicalUnit": {
                      "efg:PartOfOrganism": "soomus"
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
          { text: "unitDateText", value: "unitDateText" },
          { text: "kindOfUnit", value: "kindOfUnit" },
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
          country_original: "Estonia",
          country: "Estonia",
          collectioncode: "TUG",
          is_mineral: false,
          datasetownerabbrev: "TUG",
          last_harvested_processing: "2020-11-17T17:43:56Z",
          id: "36394",
          taxon_hierarchy_string: "29-36",
          longitude: 24.816658,
          highertaxon: "Plantae",
          images: [
            "https://files.geocollections.info/medium/6d/c3/6dc377f1-d112-48c3-b19a-c971a5ece63c.jpg"
          ],
          recordbasis: "Rock",
          higherrank: "Kingdom",
          datasourcecountry: "Estonia",
          locality: "Tori Põrgu outcrop",
          occurrenceid: 36394,
          provideraddress: "Estonia",
          taxon_id_pbdb: 151418,
          has_map: true,
          highertaxa: ["Plantae"],
          datasourceurl:
            "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
          datasetowner: "University of Tartu, Natural History Museum",
          fullscientificname: "Plantae",
          latitude: 58.483589,
          image_license: "CC BY-NC",
          providercountry: "Estonia",
          stratigraphy: "Pärnu Stage",
          providerurl: "https://geocollections.info/",
          has_image: true,
          image_author: "Paalits, I.",
          recordURI: "https://geocollections.info/specimen/249840",
          coordinates: "58.483589,24.816658",
          taxon_id: 36,
          image_date: "2014-04-04",
          collectorname: "Kalamees-Pani",
          providername: "SARV",
          url:
            "https://files.geocollections.info/medium/6d/c3/6dc377f1-d112-48c3-b19a-c971a5ece63c.jpg",
          relatedResource: "https://geocollections.info/file/84733",
          names: ["Plantae"],
          unitid: "1667-99",
          _version_: 1685065887861702700,
          highertaxon_facet: "Plantae"
        },
        true,
        true,
        false,
        false,
        true,
        false,
        ["Stage: Pärnu Stage"],
        {
          "abcd:Address": "Vanemuise 46, Tartu, Estonia",
          "abcd:Email": "mare.isakar@ut.ee",
          "abcd:Name": "Mare Isakar",
          "abcd:Phone": "+3727375839"
        },
        "Mare Isakar",
        "mare.isakar@ut.ee",
        "+3727375839",
        "Vanemuise 46, Tartu, Estonia",
        "https://files.geocollections.info/img/UT_logo.png",
        "TUG geological collections",
        "https://geocollections.info/about_tug",
        "© University of Tartu, Natural History Museum",
        "Free for non-commercial usage, provided that University of Tartu, Natural History Museum, and https://geocollections.info are acknowledged.",
        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility.",
        "National geological collection of Estonia: www.geocollections.info; University of Tartu, Natural History Museum",
        "2014-03-31",
        null,
        ["Kingdom: Plantae"],
        undefined,
        undefined,
        undefined,
        null,
        undefined,
        undefined,
        undefined,
        undefined,
        "Kalamees-Pani",
        undefined,
        "part of specimen",
        undefined,
        null,
        [
          { text: "Type", value: "typestatus" },
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Group", value: "highertaxon" },
          { text: "Group", value: "itemMineralGroup" },
          { text: "Name detail", value: "mineralNameDetail" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Nearest place", value: "nearNamedPlace" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Weight", value: "unitWeight" },
          { text: "Acquisition date", value: "acquisitionDate" },
          { text: "Collector", value: "gatheringAgent" },
          { text: "Date collected", value: "unitDateText" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
          { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
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
        ],
        [
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Group", value: "highertaxon" },
          { text: "Country", value: "country" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Collector", value: "gatheringAgent" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
          { text: "Institution", value: "institutionHomepage" },
          { text: "Dataset owner", value: "datasetowner" },
          { text: "Contact person", value: "contentContactName" },
          { text: "Contact e-mail", value: "contentContactEmail" },
          { text: "Contact phone", value: "contentContactPhone" },
          { text: "Contact address", value: "contentContactAddress" },
          { text: "Data source country", value: "datasourcecountry" },
          { text: "Copyright", value: "copyrights" },
          { text: "Terms of use", value: "termsofusestatements" },
          { text: "Disclaimer", value: "disclaimers" },
          { text: "Acknowledgement", value: "acknowledgements" },
          { text: "Last Edited", value: "dateLastEdited" },
          { text: "Last harvested", value: "last_harvested_processing" },
          { text: "Provider name", value: "providername" },
          { text: "GeoCASe ID", value: "id" }
        ]
      ]
    },
    //  63262 METEORITE TUG
    {
      state: {
        response: [
          {
            collectioncode: "TUG",
            mindat_id: 10859,
            is_mineral: true,
            datasetownerabbrev: "TUG",
            last_harvested_processing: "2020-11-17T17:43:56Z",
            id: "63262",
            recordbasis: "Meteorite",
            datasourcecountry: "Estonia",
            mindat_url: "https://www.mindat.org/min-10859.html",
            occurrenceid: 63262,
            provideraddress: "Estonia",
            has_map: false,
            datasourceurl:
              "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
            datasetowner: "University of Tartu, Natural History Museum",
            fullscientificname: "Tektite",
            providercountry: "Estonia",
            providerurl: "https://geocollections.info/",
            has_image: false,
            recordURI: "https://geocollections.info/specimen/256530",
            providername: "SARV",
            names: ["Tektite"],
            unitid: "526-2",
            _version_: 1685065892776378400
          }
        ],
        responseFromSource: {
          "abcd:DataSets": {
            "abcd:DataSet": {
              "abcd:TechnicalContacts": {
                "abcd:TechnicalContact": {
                  "abcd:Name": "Olle Hints",
                  "abcd:Email": "olle.hints@taltech.ee",
                  "abcd:Phone": "+3726203027"
                }
              },
              "abcd:ContentContacts": {
                "abcd:ContentContact": {
                  "abcd:Name": "Mare Isakar",
                  "abcd:Email": "mare.isakar@ut.ee",
                  "abcd:Phone": "+3727375839",
                  "abcd:Address": "Vanemuise 46, Tartu, Estonia"
                }
              },
              "abcd:Metadata": {
                "abcd:Description": {
                  "abcd:Representation": {
                    "abcd:Title": "TUG geological collections",
                    "abcd:Details": "...",
                    "abcd:Coverage": "fossils, mineral, rocks",
                    "abcd:URI": "https://geocollections.info/about_tug"
                  }
                },
                "abcd:RevisionData": {
                  "abcd:DateModified": "2020-11-04T23:35:07"
                },
                "abcd:Owners": {
                  "abcd:Owner": {
                    "abcd:Organisation": {
                      "abcd:Name": {
                        "abcd:Representation": {
                          "abcd:Text":
                            "University of Tartu, Natural History Museum",
                          "abcd:Abbreviation": "TUG"
                        }
                      }
                    },
                    "abcd:Person": { "abcd:FullName": "Mare Isakar" },
                    "abcd:Roles": { "abcd:Role": "Chief Curator" },
                    "abcd:Addresses": {
                      "abcd:Address": "Vanemuise 46, Tartu, Estonia"
                    },
                    "abcd:EmailAddresses": {
                      "abcd:EmailAddress": "mare.isakar@ut.ee"
                    },
                    "abcd:LogoURI":
                      "https://files.geocollections.info/img/UT_logo.png"
                  }
                },
                "abcd:IPRStatements": {
                  "abcd:Copyrights": {
                    "abcd:Copyright": {
                      "abcd:Text":
                        "© University of Tartu, Natural History Museum"
                    }
                  },
                  "abcd:Licenses": {
                    "abcd:License": {
                      "abcd:Text": "(CC) BY-NC",
                      "abcd:Details":
                        "Creative Commons Attribution-NonCommercial 4.0 Unported License",
                      "abcd:URI":
                        "http://creativecommons.org/licenses/by-nc/4.0/"
                    }
                  },
                  "abcd:TermsOfUseStatements": {
                    "abcd:TermsOfUse": {
                      "abcd:Text":
                        "Free for non-commercial usage, provided that University of Tartu, Natural History Museum, and https://geocollections.info are acknowledged."
                    }
                  },
                  "abcd:Disclaimers": {
                    "abcd:Disclaimer": {
                      "abcd:Text":
                        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility."
                    }
                  },
                  "abcd:Acknowledgements": {
                    "abcd:Acknowledgement": {
                      "abcd:Text":
                        "National geological collection of Estonia: www.geocollections.info; University of Tartu, Natural History Museum"
                    }
                  },
                  "abcd:Citations": {
                    "abcd:Citation": {
                      "abcd:Text":
                        "National geological collection of Estonia: https://geocollections.info;  University of Tartu, Natural History Museum"
                    }
                  }
                }
              },
              "abcd:Units": {
                "abcd:Unit": {
                  "abcd:SourceInstitutionID": "Museum of Geology, UT",
                  "abcd:SourceID": "TUG",
                  "abcd:UnitID": "526-2",
                  "abcd:UnitIDNumeric": "256530",
                  "abcd:DateLastEdited": "2020-12-07T08:47:55",
                  "abcd:UnitReferences": {
                    "abcd:UnitReference": [
                      {
                        "abcd:TitleCitation": "Grewingk & Schmidt, 1864a",
                        "abcd:CitationDetail":
                          "Ueber die Meteoriten-Fälle von Pillistfer, Buschhof und Igast in Liv- und Kurland",
                        "abcd:URI": "https://dspace.ut.ee/handle/10062/45460"
                      },
                      {
                        "abcd:TitleCitation": "Grewingk, 1867b",
                        "abcd:CitationDetail":
                          "Die Meteoriten des mineralogischen Cabinets der Universität Dorpat am 1. Mai 1865",
                        "abcd:URI": "http://dspace.ut.ee/handle/10062/45458"
                      },
                      {
                        "abcd:TitleCitation": "Loewinson-Lessing, 1897",
                        "abcd:CitationDetail":
                          "Catalogue de la collection de Météorites de l'Université Impériale de Jourieff (Dorpat) (Musée Minéralogique)"
                      },
                      {
                        "abcd:TitleCitation": "Tiirmaa, 1996",
                        "abcd:CitationDetail":
                          "Catalogue of meteorites in the Estonian collection",
                        "abcd:URI": "https://www.etera.ee/s/HxLA3rGivA"
                      }
                    ]
                  },
                  "abcd:Identifications": {
                    "abcd:Identification": [
                      {
                        "abcd:Result": {
                          "abcd:Extension": {
                            "efg:MineralRockIdentified": {
                              "efg:ClassifiedName": {
                                "efg:FullScientificNameString": "Tektite",
                                "efg:MineralRockNameAtomised": {
                                  "efg:ScientificNameString": "Tektite"
                                }
                              },
                              "efg:InformalNameString": "Tektite"
                            }
                          }
                        }
                      },
                      {
                        "abcd:Result": {
                          "abcd:Extension": {
                            "efg:MineralRockIdentified": {
                              "efg:ClassifiedName": {
                                "efg:FullScientificNameString":
                                  "Stone meteorites"
                              }
                            }
                          }
                        }
                      }
                    ]
                  },
                  "abcd:RecordBasis": "MeteoriteSpecimen",
                  "abcd:KindOfUnit": "part of specimen",
                  "abcd:Gathering": {
                    "abcd:DateTime": { "abcd:ISODateTimeBegin": "1855-05-17" },
                    "abcd:LocalityText": "Igast",
                    "abcd:Country": {
                      "abcd:Name": "Estonia",
                      "abcd:ISO3166Code": "EE"
                    },
                    "abcd:SiteCoordinateSets": {
                      "abcd:SiteCoordinates": {
                        "abcd:CoordinatesLatLong": {
                          "abcd:LongitudeDecimal": "26.266667",
                          "abcd:LatitudeDecimal": "57.833333",
                          "abcd:SpatialDatum": "WGS84",
                          "abcd:AccuracyStatement": "1-10 km",
                          "abcd:CoordinateErrorDistanceInMeters": "10000"
                        }
                      }
                    },
                    "abcd:Notes": "Igast, Livland"
                  },
                  "abcd:UnitExtension": {
                    "efg:EarthScienceSpecimen": {
                      "efg:UnitStratigraphicDetermination": {
                        "efg:ChronostratigraphicAttributions": {
                          "efg:ChronostratigraphicAttribution": [
                            {
                              "efg:ChronostratigraphicAttribution": "test"
                            }
                          ]
                        }
                      }
                    },
                    "abcd:LocalityText": "Igast",
                    "abcd:Country": {
                      "abcd:Name": "Estonia",
                      "abcd:ISO3166Code": "EE"
                    },
                    "abcd:SiteCoordinateSets": {
                      "abcd:SiteCoordinates": {
                        "abcd:CoordinatesLatLong": {
                          "abcd:LongitudeDecimal": "26.266667",
                          "abcd:LatitudeDecimal": "57.833333",
                          "abcd:SpatialDatum": "WGS84",
                          "abcd:AccuracyStatement": "1-10 km",
                          "abcd:CoordinateErrorDistanceInMeters": "10000"
                        }
                      }
                    },
                    "abcd:Notes": "Igast, Livland"
                  },
                  "abcd:RecordURI":
                    "https://geocollections.info/specimen/256530"
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
          { text: "unitDateText", value: "unitDateText" },
          { text: "kindOfUnit", value: "kindOfUnit" },
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
          collectioncode: "TUG",
          mindat_id: 10859,
          is_mineral: true,
          datasetownerabbrev: "TUG",
          last_harvested_processing: "2020-11-17T17:43:56Z",
          id: "63262",
          recordbasis: "Meteorite",
          datasourcecountry: "Estonia",
          mindat_url: "https://www.mindat.org/min-10859.html",
          occurrenceid: 63262,
          provideraddress: "Estonia",
          has_map: false,
          datasourceurl:
            "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
          datasetowner: "University of Tartu, Natural History Museum",
          fullscientificname: "Tektite",
          providercountry: "Estonia",
          providerurl: "https://geocollections.info/",
          has_image: false,
          recordURI: "https://geocollections.info/specimen/256530",
          providername: "SARV",
          names: ["Tektite"],
          unitid: "526-2",
          _version_: 1685065892776378400
        },
        false,
        false,
        false,
        false,
        false,
        true,
        null,
        {
          "abcd:Address": "Vanemuise 46, Tartu, Estonia",
          "abcd:Email": "mare.isakar@ut.ee",
          "abcd:Name": "Mare Isakar",
          "abcd:Phone": "+3727375839"
        },
        "Mare Isakar",
        "mare.isakar@ut.ee",
        "+3727375839",
        "Vanemuise 46, Tartu, Estonia",
        "https://files.geocollections.info/img/UT_logo.png",
        "TUG geological collections",
        "https://geocollections.info/about_tug",
        "© University of Tartu, Natural History Museum",
        "Free for non-commercial usage, provided that University of Tartu, Natural History Museum, and https://geocollections.info are acknowledged.",
        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility.",
        "National geological collection of Estonia: www.geocollections.info; University of Tartu, Natural History Museum",
        "2020-12-07",
        null,
        null,
        undefined,
        undefined,
        undefined,
        [
          'Grewingk & Schmidt, 1864a Ueber die Meteoriten-Fälle von Pillistfer, Buschhof und Igast in Liv- und Kurland (<a href="https://dspace.ut.ee/handle/10062/45460" target="ReferenceWindow" style="text-decoration: none;">https://dspace.ut.ee/handle/10062/45460</a>)',
          'Grewingk, 1867b Die Meteoriten des mineralogischen Cabinets der Universität Dorpat am 1. Mai 1865 (<a href="http://dspace.ut.ee/handle/10062/45458" target="ReferenceWindow" style="text-decoration: none;">http://dspace.ut.ee/handle/10062/45458</a>)',
          "Loewinson-Lessing, 1897 Catalogue de la collection de Météorites de l'Université Impériale de Jourieff (Dorpat) (Musée Minéralogique)",
          'Tiirmaa, 1996 Catalogue of meteorites in the Estonian collection (<a href="https://www.etera.ee/s/HxLA3rGivA" target="ReferenceWindow" style="text-decoration: none;">https://www.etera.ee/s/HxLA3rGivA</a>)'
        ],
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "part of specimen",
        undefined,
        null,
        [
          { text: "Type", value: "typestatus" },
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Group", value: "highertaxon" },
          { text: "Group", value: "itemMineralGroup" },
          { text: "Name detail", value: "mineralNameDetail" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Nearest place", value: "nearNamedPlace" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Weight", value: "unitWeight" },
          { text: "Acquisition date", value: "acquisitionDate" },
          { text: "Collector", value: "gatheringAgent" },
          { text: "Date collected", value: "unitDateText" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
          { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
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
        ],
        [
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Record URI", value: "recordURI" }
        ],
        [
          { text: "Institution", value: "institutionHomepage" },
          { text: "Dataset owner", value: "datasetowner" },
          { text: "Contact person", value: "contentContactName" },
          { text: "Contact e-mail", value: "contentContactEmail" },
          { text: "Contact phone", value: "contentContactPhone" },
          { text: "Contact address", value: "contentContactAddress" },
          { text: "Data source country", value: "datasourcecountry" },
          { text: "Copyright", value: "copyrights" },
          { text: "Terms of use", value: "termsofusestatements" },
          { text: "Disclaimer", value: "disclaimers" },
          { text: "Acknowledgement", value: "acknowledgements" },
          { text: "Last Edited", value: "dateLastEdited" },
          { text: "Last harvested", value: "last_harvested_processing" },
          { text: "Provider name", value: "providername" },
          { text: "GeoCASe ID", value: "id" }
        ]
      ]
    },
    //  107043 MINERAL TUG
    {
      state: {
        response: [
          {
            country_original: "United Kingdom",
            collectioncode: "TUG",
            is_mineral: false,
            stratigraphytext: "Ülem-Kriit",
            datasetownerabbrev: "TUG",
            last_harvested_processing: "2020-11-17T17:43:56Z",
            id: "107043",
            taxon_hierarchy_string: "29-38-93-340-345",
            longitude: -1.10851,
            highertaxon: "Echinodermata",
            recordbasis: "Mineral",
            higherrank: "Phylum",
            datasourcecountry: "Estonia",
            locality: "Culver Down",
            occurrenceid: 107043,
            provideraddress: "Estonia",
            taxon_id_pbdb: 32733,
            has_map: true,
            highertaxa: ["Echinodermata"],
            datasourceurl:
              "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
            datasetowner: "University of Tartu, Natural History Museum",
            fullscientificname: "Echinoidea",
            latitude: 50.66666,
            providercountry: "Estonia",
            providerurl: "https://geocollections.info/",
            has_image: false,
            recordURI: "https://geocollections.info/specimen/247063",
            coordinates: "50.66666,-1.10851",
            taxon_id: 345,
            collectorname: "Isakar, M.",
            providername: "SARV",
            names: ["Echinoidea"],
            unitid: "1649-10",
            _version_: 1685065904593830000,
            highertaxon_facet: "Echinodermata"
          }
        ],
        responseFromSource: {
          "abcd:DataSets": {
            "abcd:DataSet": {
              "abcd:TechnicalContacts": {
                "abcd:TechnicalContact": {
                  "abcd:Name": "Olle Hints",
                  "abcd:Email": "olle.hints@taltech.ee",
                  "abcd:Phone": "+3726203027"
                }
              },
              "abcd:ContentContacts": {
                "abcd:ContentContact": {
                  "abcd:Name": "Mare Isakar",
                  "abcd:Email": "mare.isakar@ut.ee",
                  "abcd:Phone": "+3727375839",
                  "abcd:Address": "Vanemuise 46, Tartu, Estonia"
                }
              },
              "abcd:Metadata": {
                "abcd:Description": {
                  "abcd:Representation": {
                    "abcd:Title": "TUG geological collections",
                    "abcd:Details": "...",
                    "abcd:Coverage": "fossils, mineral, rocks",
                    "abcd:URI": "https://geocollections.info/about_tug"
                  }
                },
                "abcd:RevisionData": {
                  "abcd:DateModified": "2020-11-04T23:35:07"
                },
                "abcd:Owners": {
                  "abcd:Owner": {
                    "abcd:Organisation": {
                      "abcd:Name": {
                        "abcd:Representation": {
                          "abcd:Text":
                            "University of Tartu, Natural History Museum",
                          "abcd:Abbreviation": "TUG"
                        }
                      }
                    },
                    "abcd:Person": { "abcd:FullName": "Mare Isakar" },
                    "abcd:Roles": { "abcd:Role": "Chief Curator" },
                    "abcd:Addresses": {
                      "abcd:Address": "Vanemuise 46, Tartu, Estonia"
                    },
                    "abcd:EmailAddresses": {
                      "abcd:EmailAddress": "mare.isakar@ut.ee"
                    },
                    "abcd:LogoURI":
                      "https://files.geocollections.info/img/UT_logo.png"
                  }
                },
                "abcd:IPRStatements": {
                  "abcd:Copyrights": {
                    "abcd:Copyright": {
                      "abcd:Text":
                        "© University of Tartu, Natural History Museum"
                    }
                  },
                  "abcd:Licenses": {
                    "abcd:License": {
                      "abcd:Text": "(CC) BY-NC",
                      "abcd:Details":
                        "Creative Commons Attribution-NonCommercial 4.0 Unported License",
                      "abcd:URI":
                        "http://creativecommons.org/licenses/by-nc/4.0/"
                    }
                  },
                  "abcd:TermsOfUseStatements": {
                    "abcd:TermsOfUse": {
                      "abcd:Text":
                        "Free for non-commercial usage, provided that University of Tartu, Natural History Museum, and https://geocollections.info are acknowledged."
                    }
                  },
                  "abcd:Disclaimers": {
                    "abcd:Disclaimer": {
                      "abcd:Text":
                        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility."
                    }
                  },
                  "abcd:Acknowledgements": {
                    "abcd:Acknowledgement": {
                      "abcd:Text":
                        "National geological collection of Estonia: www.geocollections.info; University of Tartu, Natural History Museum"
                    }
                  },
                  "abcd:Citations": {
                    "abcd:Citation": {
                      "abcd:Text":
                        "National geological collection of Estonia: https://geocollections.info;  University of Tartu, Natural History Museum"
                    }
                  }
                }
              },
              "abcd:Units": {
                "abcd:Unit": {
                  "abcd:SourceInstitutionID": "Museum of Geology, UT",
                  "abcd:UnitGUID": "Test UnitGUID",
                  "abcd:SourceID": "TUG",
                  "abcd:UnitID": "1649-10",
                  "abcd:UnitIDNumeric": "247063",
                  "abcd:DateLastEdited": "2013-12-16T14:51:55",
                  "abcd:Identifications": {
                    "abcd:Identification": {
                      "abcd:Result": {
                        "abcd:TaxonIdentified": {
                          "abcd:HigherTaxa": {
                            "abcd:HigherTaxon": [
                              {
                                "abcd:HigherTaxonName": "Echinodermata",
                                "abcd:HigherTaxonRank": "Phylum"
                              },
                              {
                                "abcd:HigherTaxonName": "test name",
                                "abcd:HigherTaxonRank": "test rank"
                              }
                            ]
                          },
                          "abcd:ScientificName": {
                            "abcd:FullScientificNameString": "Echinoidea"
                          }
                        }
                      },
                      "abcd:PreferredFlag": "1"
                    }
                  },
                  "abcd:RecordBasis": "MineralSpecimen",
                  "abcd:KindOfUnit": "part of specimen",
                  "abcd:Gathering": {
                    "abcd:DateTime": { "abcd:ISODateTimeBegin": "2013-09-12" },
                    "abcd:NearNamedPlaces": {
                      "abcd:NamedPlaceRelation": {
                        "abcd:NearNamedPlace": "test place"
                      }
                    },
                    "abcd:Agents": {
                      "abcd:GatheringAgent": {
                        "abcd:AgentText": "Isakar, M.",
                        "abcd:Person": {
                          "abcd:FullName": "Isakar, M.",
                          "abcd:AtomisedName": {
                            "abcd:InheritedName": "Isakar",
                            "abcd:GivenNames": "Mare"
                          }
                        }
                      }
                    },
                    "abcd:LocalityText": "Culver Down",
                    "abcd:Country": { "abcd:Name": "United Kingdom" },
                    "abcd:SiteCoordinateSets": {
                      "abcd:SiteCoordinates": {
                        "abcd:CoordinateMethod": "Wikipedia",
                        "abcd:CoordinatesLatLong": {
                          "abcd:LongitudeDecimal": "-1.10851",
                          "abcd:LatitudeDecimal": "50.66666",
                          "abcd:SpatialDatum": "WGS84"
                        }
                      }
                    },
                    "abcd:Stratigraphy": {
                      "abcd:ChronostratigraphicTerms": {
                        "abcd:ChronostratigraphicTerm": {
                          "abcd:Term": "Cretaceous"
                        }
                      },
                      "abcd:StratigraphyText": "Ülem-Kriit"
                    },
                    "abcd:NamedAreas": [
                      {
                        "abcd:NamedArea": {
                          "abcd:AreaClass": "province",
                          "abcd:AreaName": "Niederösterreich"
                        }
                      },
                      {
                        "abcd:NamedArea": {
                          "abcd:AreaClass": "test class",
                          "abcd:AreaName": "test name"
                        }
                      }
                    ]
                  },
                  "abcd:RecordURI":
                    "https://geocollections.info/specimen/247063",
                  "abcd:UnitExtension": {
                    "efg:EarthScienceSpecimen": {
                      "efg:UnitStratigraphicDetermination": {
                        "efg:ChronostratigraphicAttributions": {
                          "efg:ChronostratigraphicAttribution": {
                            "efg:ChronoStratigraphicDivision": "System",
                            "efg:ChronostratigraphicName": "Cretaceous"
                          }
                        }
                      }
                    }
                  },
                  "abcd:SpecimenUnit": {
                    "abcd:Acquisition": {
                      "abcd:AcquisitionDate": "test date"
                    },
                    "abcd:NomenclaturalTypeDesignations": {
                      "abcd:NomenclaturalTypeDesignation": {
                        "abcd:Verifier": {
                          "abcd:FullName": "Test fullname"
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
          { text: "unitDateText", value: "unitDateText" },
          { text: "kindOfUnit", value: "kindOfUnit" },
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
          country_original: "United Kingdom",
          collectioncode: "TUG",
          is_mineral: false,
          stratigraphytext: "Ülem-Kriit",
          datasetownerabbrev: "TUG",
          last_harvested_processing: "2020-11-17T17:43:56Z",
          id: "107043",
          taxon_hierarchy_string: "29-38-93-340-345",
          longitude: -1.10851,
          highertaxon: "Echinodermata",
          recordbasis: "Mineral",
          higherrank: "Phylum",
          datasourcecountry: "Estonia",
          locality: "Culver Down",
          occurrenceid: 107043,
          provideraddress: "Estonia",
          taxon_id_pbdb: 32733,
          has_map: true,
          highertaxa: ["Echinodermata"],
          datasourceurl:
            "https://bc.geocollections.info/pywrapper.cgi?dsa=sarv",
          datasetowner: "University of Tartu, Natural History Museum",
          fullscientificname: "Echinoidea",
          latitude: 50.66666,
          providercountry: "Estonia",
          providerurl: "https://geocollections.info/",
          has_image: false,
          recordURI: "https://geocollections.info/specimen/247063",
          coordinates: "50.66666,-1.10851",
          taxon_id: 345,
          collectorname: "Isakar, M.",
          providername: "SARV",
          names: ["Echinoidea"],
          unitid: "1649-10",
          _version_: 1685065904593830000,
          highertaxon_facet: "Echinodermata"
        },
        false,
        true,
        false,
        true,
        false,
        false,
        ["System: Cretaceous"],
        {
          "abcd:Address": "Vanemuise 46, Tartu, Estonia",
          "abcd:Email": "mare.isakar@ut.ee",
          "abcd:Name": "Mare Isakar",
          "abcd:Phone": "+3727375839"
        },
        "Mare Isakar",
        "mare.isakar@ut.ee",
        "+3727375839",
        "Vanemuise 46, Tartu, Estonia",
        "https://files.geocollections.info/img/UT_logo.png",
        "TUG geological collections",
        "https://geocollections.info/about_tug",
        "© University of Tartu, Natural History Museum",
        "Free for non-commercial usage, provided that University of Tartu, Natural History Museum, and https://geocollections.info are acknowledged.",
        "We make efforts to ensure that the data we serve are accurate. However, quality and completeness of every data record cannot be guaranteed. Use the data at your own responsibility.",
        "National geological collection of Estonia: www.geocollections.info; University of Tartu, Natural History Museum",
        "2013-12-16",
        ["province: Niederösterreich", "test class: test name"],
        ["Phylum: Echinodermata", "test rank: test name"],
        "Test fullname",
        "Test UnitGUID",
        undefined,
        null,
        undefined,
        undefined,
        "test place",
        "test date",
        "Isakar, M.",
        undefined,
        "part of specimen",
        undefined,
        null,
        [
          { text: "Type", value: "typestatus" },
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Type status", value: "type_status" },
          { text: "Group", value: "highertaxon" },
          { text: "Group", value: "itemMineralGroup" },
          { text: "Name detail", value: "mineralNameDetail" },
          { text: "Country", value: "country" },
          { text: "Area", value: "area" },
          { text: "Area detail", value: "areaDetail" },
          { text: "Nearest place", value: "nearNamedPlace" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Reference", value: "reference" },
          { text: "Mindat", value: "mindat_url" },
          { text: "Weight", value: "unitWeight" },
          { text: "Acquisition date", value: "acquisitionDate" },
          { text: "Collector", value: "gatheringAgent" },
          { text: "Date collected", value: "unitDateText" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in Encyclopedia of Life", value: "taxon_id_eol" },
          { text: "Taxon in Tree of Life", value: "taxon_id_tol" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" },
          { text: "Related resource", value: "relatedResource" }
        ],
        [
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
        ],
        [
          { text: "Collection", value: "collectioncode" },
          { text: "Object ID", value: "unitid" },
          { text: "Group", value: "highertaxon" },
          { text: "Area", value: "area" },
          { text: "Nearest place", value: "nearNamedPlace" },
          { text: "Locality", value: "locality" },
          { text: "Latitude", value: "latitude" },
          { text: "Longitude", value: "longitude" },
          { text: "Stratigraphy", value: "stratigraphy" },
          { text: "Acquisition date", value: "acquisitionDate" },
          { text: "Collector", value: "gatheringAgent" },
          { text: "Kind of unit", value: "kindOfUnit" },
          { text: "Taxon record in PBDB", value: "taxon_id_pbdb" },
          { text: "Taxon in fossiilid.info", value: "taxon_id" },
          { text: "Record URI", value: "recordURI" }
        ],
        [
          { text: "Institution", value: "institutionHomepage" },
          { text: "Dataset owner", value: "datasetowner" },
          { text: "Contact person", value: "contentContactName" },
          { text: "Contact e-mail", value: "contentContactEmail" },
          { text: "Contact phone", value: "contentContactPhone" },
          { text: "Contact address", value: "contentContactAddress" },
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
        ]
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

    it("isItemMineral", () => {
      const item = testCase.expected[1];
      const result = getters.isItemMineral(testCase.state, {
        item
      });

      expect(result).toEqual(testCase.expected[5]);
    });

    it("isItemRock", () => {
      const item = testCase.expected[1];
      const result = getters.isItemRock(testCase.state, {
        item
      });

      expect(result).toEqual(testCase.expected[6]);
    });

    it("isItemMeteorite", () => {
      const item = testCase.expected[1];
      const result = getters.isItemMeteorite(testCase.state, {
        item
      });

      expect(result).toEqual(testCase.expected[7]);
    });

    it("itemStratigraphy", () => {
      const result = getters.itemStratigraphy(testCase.state);

      expect(result).toEqual(testCase.expected[8]);
    });

    it("contentContact", () => {
      const result = getters.contentContact(testCase.state);

      expect(result).toEqual(testCase.expected[9]);
    });

    it("contentContactName", () => {
      const contentContact = testCase.expected[9];
      const result = getters.contentContactName(testCase.state, {
        contentContact
      });

      expect(result).toEqual(testCase.expected[10]);
    });

    it("contentContactEmail", () => {
      const contentContact = testCase.expected[9];
      const result = getters.contentContactEmail(testCase.state, {
        contentContact
      });

      expect(result).toEqual(testCase.expected[11]);
    });

    it("contentContactPhone", () => {
      const contentContact = testCase.expected[9];
      const result = getters.contentContactPhone(testCase.state, {
        contentContact
      });

      expect(result).toEqual(testCase.expected[12]);
    });

    it("contentContactAddress", () => {
      const contentContact = testCase.expected[9];
      const result = getters.contentContactAddress(testCase.state, {
        contentContact
      });

      expect(result).toEqual(testCase.expected[13]);
    });

    it("logoURI", () => {
      const result = getters.logoURI(testCase.state);

      expect(result).toEqual(testCase.expected[14]);
    });

    it("representationTitle", () => {
      const result = getters.representationTitle(testCase.state);

      expect(result).toEqual(testCase.expected[15]);
    });

    it("representationURI", () => {
      const result = getters.representationURI(testCase.state);

      expect(result).toEqual(testCase.expected[16]);
    });

    it("copyrights", () => {
      const result = getters.copyrights(testCase.state);

      expect(result).toEqual(testCase.expected[17]);
    });

    it("termsofusestatements", () => {
      const result = getters.termsofusestatements(testCase.state);

      expect(result).toEqual(testCase.expected[18]);
    });

    it("disclaimers", () => {
      const result = getters.disclaimers(testCase.state);

      expect(result).toEqual(testCase.expected[19]);
    });

    it("acknowledgements", () => {
      const result = getters.acknowledgements(testCase.state);

      expect(result).toEqual(testCase.expected[20]);
    });

    it("dateLastEdited", () => {
      const result = getters.dateLastEdited(testCase.state);

      expect(result).toEqual(testCase.expected[21]);
    });

    it("itemArea", () => {
      const item = testCase.expected[1];
      const result = getters.itemArea(testCase.state, { item });

      expect(result).toEqual(testCase.expected[22]);
    });

    it("itemHighertaxon", () => {
      const item = testCase.expected[1];
      const result = getters.itemHighertaxon(testCase.state, { item });

      expect(result).toEqual(testCase.expected[23]);
    });

    it("specimenVerifier", () => {
      const result = getters.specimenVerifier(testCase.state);

      expect(result).toEqual(testCase.expected[24]);
    });

    it("unitGuid", () => {
      const result = getters.unitGuid(testCase.state);

      expect(result).toEqual(testCase.expected[25]);
    });

    it("originalStatus", () => {
      const result = getters.originalStatus(testCase.state);

      expect(result).toEqual(testCase.expected[26]);
    });

    it("itemReference", () => {
      const item = testCase.expected[1];
      const result = getters.itemReference(testCase.state, { item });

      expect(result).toEqual(testCase.expected[27]);
    });

    it("areaDetail", () => {
      const result = getters.areaDetail(testCase.state);

      expect(result).toEqual(testCase.expected[28]);
    });

    it("unitWeight", () => {
      const result = getters.unitWeight(testCase.state);

      expect(result).toEqual(testCase.expected[29]);
    });

    it("nearNamedPlace", () => {
      const result = getters.nearNamedPlace(testCase.state);

      expect(result).toEqual(testCase.expected[30]);
    });

    it("acquisitionDate", () => {
      const result = getters.acquisitionDate(testCase.state);

      expect(result).toEqual(testCase.expected[31]);
    });

    it("gatheringAgent", () => {
      const result = getters.gatheringAgent(testCase.state);

      expect(result).toEqual(testCase.expected[32]);
    });

    it("unitDateText", () => {
      const result = getters.unitDateText(testCase.state);

      expect(result).toEqual(testCase.expected[33]);
    });

    it("kindOfUnit", () => {
      const result = getters.kindOfUnit(testCase.state);

      expect(result).toEqual(testCase.expected[34]);
    });

    it("itemMineralGroup", () => {
      const result = getters.itemMineralGroup(testCase.state);

      expect(result).toEqual(testCase.expected[35]);
    });

    it("mineralNameDetail", () => {
      const result = getters.mineralNameDetail(testCase.state);

      expect(result).toEqual(testCase.expected[36]);
    });

    it("translatedItemHeaders", () => {
      const result = getters.translatedItemHeaders(testCase.state);

      expect(result).toEqual(testCase.expected[37]);
    });

    it("translatedItemHeadersSecondary", () => {
      const result = getters.translatedItemHeadersSecondary(testCase.state);

      expect(result).toEqual(testCase.expected[38]);
    });

    it("filteredItemHeaders", () => {
      const stubs = {
        translatedItemHeaders: testCase.expected[37],
        item: testCase.expected[1],
        itemStratigraphy: testCase.expected[8],
        itemArea: testCase.expected[22],
        unitWeight: testCase.expected[29],
        itemReference: testCase.expected[27],
        areaDetail: testCase.expected[28],
        nearNamedPlace: testCase.expected[30],
        itemHighertaxon: testCase.expected[23],
        itemMineralGroup: testCase.expected[35],
        mineralNameDetail: testCase.expected[36],
        acquisitionDate: testCase.expected[31],
        unitDateText: testCase.expected[33],
        gatheringAgent: testCase.expected[32],
        kindOfUnit: testCase.expected[34]
      };
      const result = getters.filteredItemHeaders(testCase.state, stubs);

      expect(result).toEqual(testCase.expected[39]);
    });

    it("filteredItemHeadersSecondary", () => {
      const stubs = {
        translatedItemHeadersSecondary: testCase.expected[38],
        item: testCase.expected[1],
        contentContactName: testCase.expected[10],
        contentContactEmail: testCase.expected[11],
        contentContactPhone: testCase.expected[12],
        contentContactAddress: testCase.expected[13],
        representationTitle: testCase.expected[15],
        copyrights: testCase.expected[17],
        termsofusestatements: testCase.expected[18],
        disclaimers: testCase.expected[19],
        acknowledgements: testCase.expected[20],
        dateLastEdited: testCase.expected[21],
        specimenVerifier: testCase.expected[24],
        unitGuid: testCase.expected[25]
      };
      const result = getters.filteredItemHeadersSecondary(
        testCase.state,
        stubs
      );

      expect(result).toEqual(testCase.expected[40]);
    });
  });
});
