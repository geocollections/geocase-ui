import axios from "axios";

const API_URL = "/api";
const FACET_QUERY =
  "facet=on&facet.mincount=0&facet.limit=100&facet.field=recordbasis&facet.field=highertaxon&facet.field=type_status&facet.field=country&facet.field=datasetowner&facet.field=providername&facet.field=providercountry";
const STATS_QUERY =
  "facet=on&facet.field=providername&facet.field=providercountry";

class SearchService {
  static async search(searchParams) {
    try {
      let start = (searchParams.page - 1) * searchParams.paginateBy;
      let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);

      let searchFields = buildSearchFieldsQuery(searchParams.searchFields);

      let url = `${API_URL}?start=${start}&rows=${searchParams.paginateBy}&sort=${sort}&defType=edismax&${FACET_QUERY}`;

      if (searchFields && searchFields.length > 0) url += `&${searchFields}`;
      else url += `&q=*`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  static async getDetailView(id) {
    try {
      let url = `${API_URL}?q=id:${decodeURIComponent(id)}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async getStats() {
    try {
      let url = `${API_URL}?q=*&rows=0&${STATS_QUERY}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
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

function buildSearchFieldsQuery(searchFields) {
  let encodedData = [];

  Object.keys(searchFields).forEach(field => {
    let name = searchFields[field].field;
    let lookUpType = searchFields[field].lookUpType;
    let value = searchFields[field].value;
    let fieldType = searchFields[field].fieldType;

    if (value && value.trim().length > 0) {
      if (name === "q" && !(value.includes(" ") || value.includes("*")))
        value = `"${value}"`;

      let encodedObject = `fq=${name}:`;
      let encodedValue = encodeURIComponent(value);
      if (name === "q") encodedObject = encodedObject.substring(1, 3);

      if (fieldType === "checkbox") {
        if (name === "highertaxon_checkbox") encodedObject = "fq=highertaxon:";
        // encodedValue = encodedValue.replace(/%2C/g, " OR ");
        encodedObject += encodedValue;
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
  });

  return encodedData.join("&");
}

export default SearchService;
