import axios from "axios";

const API_URL = "/api";
const FACET_QUERY =
  "facet=on&facet.mincount=0&facet.limit=200&f.highertaxon_facet.facet.limit=100";
const STATS_QUERY =
  "facet=on&facet.field=datasetowner&facet.field=country&facet.limit=500";

class SearchService {
  static async search(params) {
    try {
      let start = (params.page - 1) * params.paginateBy;
      let sort = buildSort(params.sortBy, params.sortDesc);

      let searchFields = buildSearchFieldsQuery(
        params.search,
        params.searchIds
      );

      let url = `${API_URL}?start=${start}&rows=${params.paginateBy}&sort=${sort}&defType=edismax&${FACET_QUERY}`;

      if (searchFields && searchFields.length > 0) url += `&${searchFields}`;
      else url += `&q=*`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  static async getDetailView(id) {
    try {
      let url = `${API_URL}?q=id:${decodeURIComponent(id)}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  static async getDetailViewDataFromSource(dataSourceUrl) {
    try {
      let url = `${API_URL}/repeat?url=${encodeURIComponent(dataSourceUrl)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error(err);
      if (err?.response?.data?.error) throw new Error(err.response.data.error);
      else throw new Error(err);
    }
  }

  static async getStats() {
    try {
      let url = `${API_URL}?q=*&rows=0&${STATS_QUERY}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  static async getAllFieldNames() {
    try {
      let url = `${API_URL}?q=*:*&wt=csv&rows=0&facet=on`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }
}

function buildSort(sortBy, sortDesc) {
  let sort = "";
  if (sortBy && sortDesc && sortBy.length > 0 && sortDesc.length > 0) {
    sortBy.forEach((field, index) => {
      sort += field + (sortDesc[index] ? " desc" : " asc") + ",";
    });

    if (sort.length > 0) sort = sort.substring(0, sort.length - 1);
  }
  return sort;
}

function buildSearchFieldsQuery(search, searchIds) {
  let encodedData = [];
  let facetFieldList = [];

  searchIds.forEach(id => {
    let name = search[id].id;
    let type = search[id].type;
    let lookUpType = search[id].lookUpType;
    let value = search[id].value;
    let isExcluded = false;

    if (value && value.trim().length > 0) {
      if (name === "q" && !(value.includes(" ") || value.includes("*")))
        value = `"${value}"`;

      let encodedObject = `fq=${name}:`;
      let encodedValue = encodeURIComponent(value);
      if (name === "q") encodedObject = encodedObject.substring(1, 3);

      if (type === "checkbox") {
        isExcluded = true;

        encodedObject = `fq={!tag=${name}}${name}:(${encodedValue})`;
      } else {
        if (lookUpType === "") encodedObject += encodedValue;
        else if (lookUpType === "contains")
          encodedObject += `*${encodedValue}*`;
        else if (lookUpType === "equals") encodedObject += `"${encodedValue}"`;
        else if (lookUpType === "starts with")
          encodedObject += `${encodedValue}*`;
        else if (lookUpType === "does not contain")
          encodedObject = `fq=-${name}:${encodedValue}`;
        else if (lookUpType === "greater than")
          encodedObject += `[${encodedValue} TO *]`;
        else if (lookUpType === "smaller than")
          encodedObject += `[* TO ${encodedValue}]`;
      }

      encodedData.push(encodedObject);
    } else if (name === "q") encodedData.push("q=*");

    if (type === "checkbox") {
      let facetField = `facet.field=${name}`;
      if (isExcluded) facetField = `facet.field={!ex=${name}}${name}`;
      facetFieldList.push(facetField);
    }
  });

  return encodedData.join("&") + "&" + facetFieldList.join("&");
}

export default SearchService;
