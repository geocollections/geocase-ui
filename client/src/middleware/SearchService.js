import axios from "axios";

const API_URL = "/api";

let query = "*";

class SearchService {
  static async search(searchParams) {
    try {
      let start = (searchParams.page - 1) * searchParams.paginateBy;
      let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);

      let searchFields = buildSearchFieldsQuery(searchParams.searchFields);

      let url = `${API_URL}?start=${start}&rows=${searchParams.paginateBy}&sort=${sort}&defType=edismax`;

      if (searchFields && searchFields.length > 0) url += `&${searchFields}`;
      else url += `&q=*`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  static async getDetailSearch(searchParams) {
    try {
      let start = (searchParams.page - 1) * searchParams.paginateBy;
      let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);

      let textFields = buildSearchFieldsQuery(
        searchParams.detailSearch.textFields
      );
      if (textFields.length > 0) textFields = "&fq=" + textFields;

      let extraFields = buildExtraFieldsQuery(
        searchParams.detailSearch.extraFields
      );

      let url = `${API_URL}?q=*&start=${start}&rows=${searchParams.paginateBy}&sort=${sort}${textFields}&defType=edismax`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  static async getFastSearch(searchParams) {
    try {
      let start = (searchParams.page - 1) * searchParams.paginateBy;
      let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);
      if (
        typeof searchParams.fastSearch === "undefined" ||
        searchParams.fastSearch === null ||
        searchParams.fastSearch.trim().length === 0
      )
        query = "*";
      else query = encodeURIComponent(searchParams.fastSearch);

      let url = `${API_URL}?q=${query}&start=${start}&rows=${searchParams.paginateBy}&sort=${sort}&defType=edismax`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async updateSearchQuery(searchParams) {
    try {
      let start = (searchParams.page - 1) * searchParams.paginateBy;
      let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);

      // Detail search
      let textFields = buildSearchFieldsQuery(
        searchParams.detailSearch.textFields
      );

      let url = `${API_URL}?start=${start}&rows=${searchParams.paginateBy}&sort=${sort}&defType=edismax`;

      if (textFields && textFields.length > 0) {
        url += `&${textFields}`;
      }

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async getDetailView(id) {
    try {
      let url = `${API_URL}?q=id:${id}`;

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

    if (value && value.trim().length > 0) {
      let encodedObject = `fq=${name}:`;
      let encodedValue = encodeURIComponent(value);
      if (name === "fastsearch") encodedObject = encodedObject.substring(1, 3);

      if (lookUpType === "contains" || lookUpType === "")
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

      encodedData.push(encodedObject);
    }
  });

  return encodedData.join("&");
}

function buildExtraFieldsQuery(extraFields) {
  let query = "";

  Object.keys(extraFields).forEach(key => {
    // Todo: Skipping 'object' because there is no field to differentiate fossils from minerals
    if (key === "url") {
      if (extraFields[key].value !== "- Any -") {
        if (extraFields[key].value !== "Yes") {
          query += "url:*";
        } else if (extraFields[key].value !== "No") {
          query += '-url:["" TO *]';
        }
      }
    }
  });

  return query;
}

export default SearchService;
