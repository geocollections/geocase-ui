const express = require('express');

const router = express.Router();

const mockData = {
  "responseHeader": {
    "status": 0,
    "QTime": 0,
    "params": {
      "q": "*",
      "defType": "edismax",
      "start": "0",
      "sort": "fullscientificname asc",
      "rows": "10"
    }
  },
  "response": {
    "numFound": 1110026, "start": 0, "docs": [
      {
        collectioncode: "GIT",
        collectorname: "Viira",
        country: "Estonia",
        datasetowner: "Department of Geology, TalTech",
        datasetownerabbrev: "GIT",
        datasourcecountry: "Estonia",
        datasourceurl: "https://bc.geocollections.info/pywrapper.cgi?dsa=geocase-git",
        fullscientificname: "'Cirognathus'? sp.",
        has_image: true,
        higherrank: "Classis",
        highertaxon: "Conodonta",
        id: "51021",
        image_author: "Baranov, G.",
        image_date: "2011-12-15",
        images: ["https://files.geocollections.info/medium/7b/5c/7b5c92b6-c1b1-498e-9de8-981236c6b7a3.jpg"],
        is_mineral: false,
        last_harvested_processing: "2020-01-08T13:56:39Z",
        latitude: 57.993092,
        locality: "Ohesaare borehole",
        longitude: 22.017741,
        names: ["'Cirognathus'? sp.", "Conodonta", "Erraticodon balticus Dzik, 1978", "Erraticodon balticus", "?Gen. et sp. indet. B"],
        occurrenceid: 51021,
        provideraddress: "EE",
        providercountry: "Estonia",
        providername: "Geocollections of Estonia",
        providerurl: "https://geocollections.info",
        recordURI: "https://geocollections.info/specimen/139933",
        recordbasis: "FossilSpecimen",
        relatedResource: "https://geocollections.info/file/43975",
        stratigraphytext: "Uhaku Stage",
        unitid: "74-85",
        url: "https://files.geocollections.info/medium/7b/5c/7b5c92b6-c1b1-498e-9de8-981236c6b7a3.jpg",
        _version_: 1672185993580511200
      },
      {
        collectioncode: "GIT",
        datasetowner: "Department of Geology, TalTech",
        datasetownerabbrev: "GIT",
        datasourcecountry: "Estonia",
        datasourceurl: "https://bc.geocollections.info/pywrapper.cgi?dsa=git",
        fullscientificname: "Seviculina reticulata",
        has_image: true,
        higherrank: "Classis",
        highertaxon: "Ostracoda",
        id: "189451",
        images: ["https://files.geocollections.info/medium/6f/d1/6fd1ced7-920e-4240-89e4-d97ef9d2f4c0.jpg",
          "https://files.geocollections.info/medium/6f/d1/6fd1ced7-920e-4240-89e4-d97ef9d2f4c0.jpg",
          "https://files.geocollections.info/medium/5a/83/5a83571e-ec8a-4df7-8d36-34fb04548105.jpg",
          "https://files.geocollections.info/medium/61/7f/617f0dea-ce00-4452-adc3-e12770dfce32.jpg"],
        is_mineral: false,
        last_harvested_processing: "2020-01-09T07:28:54Z",
        names: ["Seviculina reticulata"],
        0: "Seviculina reticulata",
        occurrenceid: 189451,
        provideraddress: "Estonia",
        providercountry: "Estonia",
        providername: "SARV",
        providerurl: "https://geocollections.info",
        recordURI: "https://geocollections.info/specimen/57840",
        recordbasis: "FossilSpecimen",
        relatedResource: "https://geocollections.info/file/59380",
        stratigraphy: "Rakvere Stage",
        type_status: "holotype",
        unitid: "229-1",
        url: "https://files.geocollections.info/medium/6f/d1/6fd1ced7-920e-4240-89e4-d97ef9d2f4c0.jpg",
        _version_: 1672186031994044400
      },
      {
        "id": "298858",
        "collectioncode": "SMNS Palaeontology IX",
        "unitid": "12929/1",
        "fullscientificname": "(?) Acrochordiceras",
        "is_mineral": false,
        "country": "Turkey",
        "recordbasis": "RockSpecimen",
        "_version_": 1669767305210363913
      },
      {
        "collectioncode": "SMNS Palaeontology VII",
        "fullscientificname": "Pyrit (Pyrite)",
        "id": "311795",
        "is_mineral": false,
        "mindat_id": 3314,
        "mindat_url": "https://www.mindat.org/min-3314.html",
        "recordbasis": "MeteoriteSpecimen",
        "unitid": "BB-2244-U",
        "_version_": 1669767306419372000
      },
      {
        "collectioncode": "TUG",
        "country": "Italy",
        "fullscientificname": "Andradite",
        "id": "357410",
        "is_mineral": true,
        "latitude": 41.816667,
        "locality": "Frascati",
        "longitude": 12.683333,
        "mindat_id": 223,
        "mindat_url": "https://www.mindat.org/min-223.html",
        "recordURI": "https://geocollections.info/specimen/298564",
        "relatedResource": "https://geocollections.info/file/117239",
        "unitid": "135-1707-2",
        "url": "https://files.geocollections.info/medium/fc/91/fc912711-cb4f-4aab-9bbb-c5d302542205.jpg",
        "_version_": 1669767311599337500
      },
      {
        "id": "326851",
        "collectioncode": "SMNS Palaeontology III",
        "unitid": "60241",
        "fullscientificname": "(?) Goniochirus aff. cristatus",
        "is_mineral": false,
        "country": "Germany",
        "_version_": 1669767308147425287
      },
      {
        "id": "300378",
        "collectioncode": "SMNS Palaeontology IX",
        "unitid": "12984",
        "fullscientificname": "(?) Megalodon cf. rimosum (Münster)",
        "is_mineral": false,
        "country": "Turkey",
        "_version_": 1669767305372893190
      },
      {
        "id": "68172",
        "collectioncode": "GIT",
        "unitid": "821-167",
        "highertaxon": "Brachiopoda",
        "higherrank": "Phylum",
        "fullscientificname": "(Porambonites (P.) latus",
        "is_mineral": false,
        "country": "Russia",
        "locality": "Syass River, Leningrad District",
        "latitude": 60.049105,
        "longitude": 32.595286,
        "stratigraphytext": "Volkhov Stage",
        "recordURI": "https://geocollections.info/specimen/317985",
        "_version_": 1669767259249180673
      },
      {
        "id": "68174",
        "collectioncode": "GIT",
        "unitid": "821-169",
        "highertaxon": "Brachiopoda",
        "higherrank": "Phylum",
        "fullscientificname": "(Porambonites (P.) latus",
        "is_mineral": false,
        "country": "Russia",
        "locality": "Syass River, Leningrad District",
        "latitude": 60.049105,
        "longitude": 32.595286,
        "stratigraphytext": "Volkhov Stage",
        "recordURI": "https://geocollections.info/specimen/317987",
        "_version_": 1669767259249180675
      },
      {
        "id": "47620",
        "collectioncode": "GIT",
        "unitid": "754-130",
        "highertaxon": "Chitinozoa",
        "higherrank": "Classis",
        "fullscientificname": "+ Calpichitina?",
        "is_mineral": false,
        "country": "Estonia",
        "locality": "Ruhnu 500 borehole",
        "latitude": 57.80317,
        "longitude": 23.24138,
        "stratigraphytext": "Jaagarahu Stage",
        "recordURI": "https://geocollections.info/specimen/275343",
        "url": "https://files.geocollections.info/medium/9c/5b/9c5bba4a-d74b-48b8-bb55-2df062406ec9.jpg",
        "relatedResource": "https://geocollections.info/file/104419",
        "_version_": 1669767255729111044
      }]
  }
}

router.get('/', (req, res) => {
  if (req.query && req.query.q && req.query.q.includes("id:")) {
    let clonedData = JSON.parse(JSON.stringify(mockData));
    let id = req.query.q.split(":")[1]
    let item = clonedData.response.docs.find(item => item.id === id)
    clonedData.response.docs = [item];
    res.send(clonedData)
  } else res.send(mockData)
});

module.exports = router;
