import axios from "axios";

const API_URL = "/api";

let query = "*";

class SearchService {
  static getDetailSearch(searchParams) {
    console.log(searchParams);
    return new Promise(async (resolve, reject) => {
      try {
        let start = (searchParams.page - 1) * searchParams.paginateBy;
        let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);

        let textFields = buildTextFieldsQuery(
          searchParams.detailSearch.textFields
        );
        if (textFields.length > 0) textFields = "&fq=" + textFields;

        let extraFields = buildExtraFieldsQuery(
          searchParams.detailSearch.extraFields
        );

        // Todo: Build search query #7
        query = "*";

        let url = `${API_URL}?q=${query}&start=${start}&rows=${searchParams.paginateBy}${textFields}&sort=${sort}`;

        const res = await axios.get(url);
        const data = res.data;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getFastSearch(searchParams) {
    return new Promise(async (resolve, reject) => {
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

        let url = "";

        if (query === "*") {
          url = `${API_URL}?q=${query}&start=${start}&rows=${searchParams.paginateBy}&sort=${sort}&defType=edismax`;
        } else {
          url = `${API_URL}?q=${query}&start=${start}&rows=${searchParams.paginateBy}&defType=edismax`;
        }

        const res = await axios.get(url);
        const data = res.data;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static updateSearchQuery(searchParams) {
    return new Promise(async (resolve, reject) => {
      try {
        let start = (searchParams.page - 1) * searchParams.paginateBy;
        let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);

        let url = `${API_URL}?q=${query}&start=${start}&rows=${searchParams.paginateBy}&sort=${sort}`;

        const res = await axios.get(url);
        const data = res.data;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getDetailView(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let url = `${API_URL}?q=id:${id}`;

        const res = await axios.get(url);
        const data = res.data;
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
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

function buildTextFieldsQuery(textFields) {
  let encodedData = [];

  Object.keys(textFields).forEach(field => {
    if (textFields[field].value && textFields[field].value.trim().length > 0) {
      let encodedObject = `${field}:*${encodeURIComponent(
        textFields[field].value
      )}*`;
      encodedData.push(encodedObject);
    }
  });

  return encodedData.join("&fq=");
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
