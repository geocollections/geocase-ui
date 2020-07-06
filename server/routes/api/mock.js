const express = require('express');

const router = express.Router();

const mockData = {
  "responseHeader":{
    "status":0,
    "QTime":0,
    "params":{
      "q":"*",
      "defType":"edismax",
      "start":"0",
      "sort":"fullscientificname asc",
      "rows":"10"}},
  "response":{"numFound":1110026,"start":0,"docs":[
      {
        "id":"315364",
        "collectioncode":"SMNS Palaeontology VII",
        "unitid":"BB-211-K/1",
        "fullscientificname":"! ist Do-4858-K! Blatt",
        "recordbasis": "FossileSpecimen",
        "is_mineral":false,
        "_version_":1669767306844045316},
      {
        "collectioncode":"GIT",
        "country":"Latvia",
        "fullscientificname":"afaniitne lubjakivi",
        "id":"65018",
        "is_mineral":true,
        "latitude":57.162796,
        "locality":"Engure 4 borehole",
        "longitude":23.21743,
        "recordURI":"https://geocollections.info/specimen/299199",
        "stratigraphytext":"Nabala Stage",
        "recordbasis": "MineralSpecimen",
        "unitid":"312-158",
        "_version_":1669767258615840800},
      {
        "id":"298858",
        "collectioncode":"SMNS Palaeontology IX",
        "unitid":"12929/1",
        "fullscientificname":"(?) Acrochordiceras",
        "is_mineral":false,
        "country":"Turkey",
        "recordbasis": "RockSpecimen",
        "_version_":1669767305210363913},
      {
        "collectioncode": "SMNS Palaeontology VII",
        "fullscientificname": "Pyrit (Pyrite)",
        "id": "311795",
        "is_mineral": false,
        "mindat_id": 3314,
        "mindat_url": "https://www.mindat.org/min-3314.html",
        "recordbasis": "MeteoriteSpecimen",
        "unitid": "BB-2244-U",
        "_version_": 1669767306419372000},
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
        "id":"326851",
        "collectioncode":"SMNS Palaeontology III",
        "unitid":"60241",
        "fullscientificname":"(?) Goniochirus aff. cristatus",
        "is_mineral":false,
        "country":"Germany",
        "_version_":1669767308147425287},
      {
        "id":"300378",
        "collectioncode":"SMNS Palaeontology IX",
        "unitid":"12984",
        "fullscientificname":"(?) Megalodon cf. rimosum (Münster)",
        "is_mineral":false,
        "country":"Turkey",
        "_version_":1669767305372893190},
      {
        "id":"68172",
        "collectioncode":"GIT",
        "unitid":"821-167",
        "highertaxon":"Brachiopoda",
        "higherrank":"Phylum",
        "fullscientificname":"(Porambonites (P.) latus",
        "is_mineral":false,
        "country":"Russia",
        "locality":"Syass River, Leningrad District",
        "latitude":60.049105,
        "longitude":32.595286,
        "stratigraphytext":"Volkhov Stage",
        "recordURI":"https://geocollections.info/specimen/317985",
        "_version_":1669767259249180673},
      {
        "id":"68174",
        "collectioncode":"GIT",
        "unitid":"821-169",
        "highertaxon":"Brachiopoda",
        "higherrank":"Phylum",
        "fullscientificname":"(Porambonites (P.) latus",
        "is_mineral":false,
        "country":"Russia",
        "locality":"Syass River, Leningrad District",
        "latitude":60.049105,
        "longitude":32.595286,
        "stratigraphytext":"Volkhov Stage",
        "recordURI":"https://geocollections.info/specimen/317987",
        "_version_":1669767259249180675},
      {
        "id":"47620",
        "collectioncode":"GIT",
        "unitid":"754-130",
        "highertaxon":"Chitinozoa",
        "higherrank":"Classis",
        "fullscientificname":"+ Calpichitina?",
        "is_mineral":false,
        "country":"Estonia",
        "locality":"Ruhnu 500 borehole",
        "latitude":57.80317,
        "longitude":23.24138,
        "stratigraphytext":"Jaagarahu Stage",
        "recordURI":"https://geocollections.info/specimen/275343",
        "url":"https://files.geocollections.info/medium/9c/5b/9c5bba4a-d74b-48b8-bb55-2df062406ec9.jpg",
        "relatedResource":"https://geocollections.info/file/104419",
        "_version_":1669767255729111044}]
  }}

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
