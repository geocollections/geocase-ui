import axios from "axios";
import { cloneDeep } from "lodash";
import earcut from "earcut";
import Wkt from "wicket/wicket";
import { parseDatasetsResponse } from "@/utils/datasets";

const API_URL = "/api";
const FACET_QUERY =
  "facet=on&facet.mincount=0&facet.limit=200&f.highertaxon_facet.facet.limit=100";
const STATS_QUERY =
  "facet=on&facet.field=datasetowner&facet.field=country&facet.field=recordbasis&facet.field=datasourceurl&facet.limit=500&f.datasourceurl.facet.limit=-1&f.datasourceurl.facet.mincount=1";

type MapSelection = {
  geometry: {
    type: string;
    coordinates: number[][][] | number[];
  };
  properties: { radius: number };
};

type SearchField = {
  id: string;
  type: string;
  lookUpType: string;
  value: string | MapSelection | null;
  fields?: string[];
};

type SearchRequest = {
  page: number;
  paginateBy: number;
  sortBy: string[];
  sortDesc: boolean[];
  search: Record<string, SearchField>;
  searchIds: string[];
};

class SearchService {
  static async search(params: SearchRequest) {
    try {
      const start = (params.page - 1) * params.paginateBy;
      const sort = buildSort(params.sortBy, params.sortDesc, params.search);

      const searchFields = buildSearchFieldsQuery(
        params.search,
        params.searchIds,
      );

      let url = `${API_URL}?start=${start}&rows=${params.paginateBy}&sort=${sort}&defType=edismax&${FACET_QUERY}`;

      if (searchFields && searchFields.length > 0) url += `&${searchFields}`;
      else url += `&q=*`;

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  static async getDetailView(id: string) {
    try {
      const url = `${API_URL}?q=geocase_id:"${decodeURIComponent(id)}"`;

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  static async getDetailViewDataFromSource(dataSourceUrl: string) {
    try {
      const url = `${API_URL}/repeat?url=${encodeURIComponent(dataSourceUrl)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError<{ error?: string }>(error) && error.response?.data.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  static async getStats() {
    try {
      const url = `${API_URL}?q=*&rows=0&${STATS_QUERY}`;

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  static async getDatasets() {
    const field = "datasourceurl,datasetowner,recordbasis";
    const res = await axios.get(`${API_URL}/`, {
      params: {
        q: "*:*",
        rows: 0,
        facet: "on",
        "facet.pivot": field,
        "facet.limit": -1,
        "facet.mincount": 1,
      },
    });
    return parseDatasetsResponse(res.data);
  }

  static async getAllFieldNames() {
    try {
      const url = `${API_URL}?q=*:*&wt=csv&rows=0&facet=on`;

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  static async getAllSpecimensInProximity(data: { lat: number; lng: number }) {
    try {
      const url = `${API_URL}?q=*:*&fq={!geofilt sfield=coordinates}&d=0&pt=${data.lat},${data.lng}&start=0&rows=10000`;

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}

function buildSort(
  sortBy: string[],
  sortDesc: boolean[],
  search: Record<string, SearchField>,
) {
  let sort = "";
  if (sortBy && sortDesc && sortBy.length > 0 && sortDesc.length > 0) {
    sortBy.forEach((field, index) => {
      const fields = search[field]?.fields ?? [];
      if (fields.length > 0) {
        fields.forEach((item) => {
          sort += item + (sortDesc[index] ? " desc" : " asc") + ",";
        });
      } else sort += field + (sortDesc[index] ? " desc" : " asc") + ",";
    });

    if (sort.length > 0) sort = sort.substring(0, sort.length - 1);
  }
  return sort;
}

function buildSearchFieldsQuery(
  search: Record<string, SearchField>,
  searchIds: string[],
) {
  const encodedData: string[] = [];
  const facetFieldList: string[] = [];

  searchIds.forEach((id) => {
    const searchField = search[id];
    if (!searchField) return;
    let name = searchField.id;
    const type = searchField.type;
    const lookUpType = searchField.lookUpType;
    let value = searchField.value;
    const fields = searchField.fields ?? [];
    let isExcluded = false;

    if (fields.length > 1) {
      if (typeof value === "string" && value.trim().length > 0) {
        const searchValue = value;
        const filterQueryValue = fields.map((field) => {
          name = field;
          const encodedValue = encodeURIComponent(searchValue);

          return createSolrFieldQuery(name, encodedValue, lookUpType);
        });

        const filterQuery = `fq=${filterQueryValue.join(" OR ")}`;

        encodedData.push(filterQuery);
      }
    } else {
      if (value && type === "map" && typeof value !== "string") {
        if (value.geometry.type === "Polygon") {
          const clonedValue = cloneDeep(value);

          if (!isPolygonCoordinates(clonedValue.geometry.coordinates)) return;
          const data = earcut.flatten(clonedValue.geometry.coordinates);
          const triangles = earcut(data.vertices, data.holes, data.dimensions);

          const coordinates = triangles.flatMap((item) => {
            const startIndex = item * 2;
            const x = data.vertices[startIndex];
            const y = data.vertices[startIndex + 1];
            return x !== undefined && y !== undefined ? [[x, y]] : [];
          });
          const triangleCoordinates: number[][][] = [];
          for (let index = 2; index < coordinates.length; index += 3) {
            const first = coordinates[index - 2];
            const second = coordinates[index - 1];
            const third = coordinates[index];
            if (first && second && third)
              triangleCoordinates.push([first, second, third, first]);
          }

          const wkt = new Wkt.Wkt();
          wkt.read(
            JSON.stringify({
              coordinates:
                triangleCoordinates.length > 1
                  ? [triangleCoordinates]
                  : triangleCoordinates,
              type: triangleCoordinates.length > 1 ? "MultiPolygon" : "Polygon",
            }),
          );
          let wktString = wkt.write();
          wktString = wktString.replaceAll("),(", ")),((");

          const solrFilter = fields
            .map((field) => `${field}:"isWithin(${wktString})"`)
            .join(" OR ");

          encodedData.push(`fq=${solrFilter}`);
        } else {
          if (!isLineCoordinates(value.geometry.coordinates)) return;
          const reversedCoordinates = [...value.geometry.coordinates].reverse();
          const radius = Math.round((value.properties.radius / 1000) * 10) / 10;

          const solrFilter = fields.map(
            (field) => `{!geofilt sfield=${field}}`,
          );

          encodedData.push(
            `fq=${solrFilter}&d=${radius}&pt=${reversedCoordinates[0]},${reversedCoordinates[1]}`,
          );
        }
      } else if (typeof value === "string" && value.trim().length > 0) {
        if (name === "q" && !(value.includes(" ") || value.includes("*")))
          value = `"${value}"`;

        let filterQuery = `fq=${name}:`;
        if (name === "datasourceurl") value = value.replace(/["\\]/g, "\\$&");
        const encodedValue = encodeURIComponent(value);

        if (type === "checkbox") {
          isExcluded = true;

          filterQuery = `fq={!tag=${name}}${name}:(${encodedValue})`;
        } else {
          if (name === "q") filterQuery = `q=${encodedValue}`;
          else
            filterQuery = `fq=${createSolrFieldQuery(
              name,
              encodedValue,
              lookUpType,
            )}`;
        }

        encodedData.push(filterQuery);
      } else if (name === "q") encodedData.push("q=*");

      if (type === "checkbox") {
        let facetField = `facet.field=${name}`;
        if (isExcluded) facetField = `facet.field={!ex=${name}}${name}`;
        facetFieldList.push(facetField);
      }
    }
  });

  return encodedData.join("&") + "&" + facetFieldList.join("&");
}

function createSolrFieldQuery(
  field: string,
  value: string,
  lookUpType: string,
) {
  switch (lookUpType) {
    case "contains":
      return `${field}:*${value}*`;
    case "equals":
      return `${field}:"${value}"`;
    case "starts with":
      return `${field}:${value}*`;
    case "ends with":
      return `${field}:*${value}`;
    case "does not contain":
      return `-${field}:${value}`;
    case "greater than":
      return `${field}:[${value} TO *]`;
    case "smaller than":
      return `${field}:[* TO ${value}]`;
    default:
      return `${field}:${value}`;
  }
}

function isPolygonCoordinates(
  coordinates: number[][][] | number[],
): coordinates is number[][][] {
  const first = coordinates[0];
  return Array.isArray(first) && Array.isArray(first[0]);
}

function isLineCoordinates(
  coordinates: number[][][] | number[],
): coordinates is number[] {
  return Array.isArray(coordinates) && typeof coordinates[0] === "number";
}

export default SearchService;
