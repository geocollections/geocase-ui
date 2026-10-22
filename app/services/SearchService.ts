import axios from "axios";
import { cloneDeep } from "lodash";
import earcut from "earcut";
import Wkt from "wicket/wicket";
import { parseDatasetsResponse } from "@/utils/datasets";

import { getCountryCenter } from "@/utils/countryCenters";

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

type SolrStatistic = { count?: number; mean?: number | null };
type SolrLocalityGroup = {
  groupValue?: unknown;
  doclist?: {
    docs?: Array<Record<string, unknown>>;
    numFound?: number;
  };
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

export type MapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export type MapLevel = "country" | "locality" | "points";

class SearchService {
  static async search(
    params: SearchRequest,
    options: { includeFacets?: boolean; fields?: string[]; signal?: AbortSignal } = {},
  ) {
    try {
      const start = (params.page - 1) * params.paginateBy;
      const sort = buildSort(params.sortBy, params.sortDesc, params.search);

      const searchFields = buildSearchFieldsQuery(
        params.search,
        params.searchIds,
        options.includeFacets !== false,
      );

      const facetsQuery =
        options.includeFacets === false ? "" : `&${FACET_QUERY}`;
      const fieldsQuery = options.fields?.length
        ? `&fl=${encodeURIComponent(options.fields.join(","))}`
        : "";
      let url = `${API_URL}?start=${start}&rows=${params.paginateBy}&sort=${sort}&defType=edismax${facetsQuery}${fieldsQuery}`;

      if (searchFields && searchFields.length > 0) url += `&${searchFields}`;
      else url += `&q=*`;

      const res = await axios.get(url, { signal: options.signal });
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  static async *exportRecords(
    params: SearchRequest,
    fields: string[],
    signal?: AbortSignal,
  ): AsyncGenerator<{ docs: Record<string, unknown>[]; total: number }> {
    const sortBy = [...params.sortBy];
    const sortDesc = [...params.sortDesc];
    if (!sortBy.includes("geocase_id")) {
      sortBy.push("geocase_id");
      sortDesc.push(false);
    }
    let total = Infinity;
    let loaded = 0;
    for (let page = 1; loaded < total; page += 1) {
      signal?.throwIfAborted();
      const response = await this.search(
        { ...params, page, paginateBy: 1000, sortBy, sortDesc },
        { includeFacets: false, fields, signal },
      );
      const docs = response?.response?.docs;
      total = Number(response?.response?.numFound);
      if (!Array.isArray(docs) || !Number.isFinite(total)) {
        throw new Error("Invalid export response");
      }
      if (docs.length === 0 && loaded < total) throw new Error("Incomplete export response");
      loaded += docs.length;
      yield { docs, total };
    }
  }

  static async searchMap(
    params: SearchRequest,
    level: MapLevel,
    bounds?: MapBounds | null,
  ) {
    const hasMapField = params.search.has_map;
    if (!hasMapField) throw new Error("Map search requires the has_map field.");

    const mapSearch = {
      ...params.search,
      has_map: {
        ...hasMapField,
        value: hasMapField.value ?? "true",
      },
    };

    const mapParams = {
      ...params,
      page: 1,
      sortBy: [],
      sortDesc: [],
      search: mapSearch,
    };

    if (level === "country") {
      const searchFields = buildSearchFieldsQuery(
        mapParams.search,
        mapParams.searchIds,
        false,
      );
      const url = `${API_URL}?rows=0&stats=true&stats.field=latitude&stats.field=longitude&stats.facet=country&fq=country%3A%5B*%20TO%20*%5D&${searchFields}`;
      const res = await axios.get(url);
      const latitudeFacets: Record<string, SolrStatistic> =
        res.data?.stats?.stats_fields?.latitude?.facets?.country ?? {};
      return Object.entries(latitudeFacets).flatMap(([country, latitude]) => {
        const center = getCountryCenter(country);
        const lat = center?.[0] ?? Number.NaN;
        const lng = center?.[1] ?? Number.NaN;
        const count = Number(latitude.count);
        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng) ||
          !Number.isFinite(count) ||
          count <= 0
        )
          return [];

        return [
          {
            country,
            latitude: lat,
            longitude: lng,
            mapCount: count,
            has_map: true,
          },
        ];
      });
    }

    if (level === "locality") {
      const searchFields = buildSearchFieldsQuery(
        mapParams.search,
        mapParams.searchIds,
        false,
      );
      const spatialFilter = buildMapBoundsFilter(bounds);
      const url = `${API_URL}?rows=500&group=true&group.field=locality&group.limit=1&group.ngroups=true&group.sort=geocase_id%20asc&fl=country%2Clocality%2Clatitude%2Clongitude&fq=locality%3A%5B*%20TO%20*%5D${spatialFilter}&${searchFields}`;
      const res = await axios.get(url);
      const groups: SolrLocalityGroup[] =
        res.data?.grouped?.locality?.groups ?? [];

      return groups.flatMap((group: SolrLocalityGroup) => {
        const locality = group.groupValue;
        const record = group.doclist?.docs?.[0];
        if (!record) return [];
        const latitude = Number(record?.latitude);
        const longitude = Number(record?.longitude);
        const count = Number(group.doclist?.numFound);
        if (
          typeof locality !== "string" ||
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          !Number.isFinite(count) ||
          count <= 0
        )
          return [];

        return [
          {
            country: record.country,
            locality,
            latitude,
            longitude,
            mapCount: count,
            has_map: true,
          },
        ];
      });
    }

    const searchFields = buildSearchFieldsQuery(mapSearch, params.searchIds, false);
    const grouping = "concat(latitude,',',longitude)";
    const sort = buildSort(params.sortBy, params.sortDesc, params.search);
    const url = `${API_URL}?start=0&rows=1000&group=true&group.func=${encodeURIComponent(grouping)}&group.limit=1&sort=${sort}&fl=geocase_id,unitid,fullscientificname,locality,country,latitude,longitude&fq=latitude:[-90%20TO%2090]&fq=longitude:[-180%20TO%20180]&${searchFields}`;
    const res = await axios.get(url);
    const groups: SolrLocalityGroup[] = res.data?.grouped?.[grouping]?.groups ?? [];
    return groups.flatMap((group) => {
      const record = group.doclist?.docs?.[0];
      if (!record || record.latitude == null || record.longitude == null) return [];
      return [{ ...record, has_map: true, mapCount: group.doclist?.numFound ?? 1 }];
    });
  }

  static async searchMapLocation(
    params: SearchRequest,
    latitude: number,
    longitude: number,
    page = 1,
  ) {
    const hasMapField = params.search.has_map;
    if (!hasMapField) throw new Error("Map search requires the has_map field.");

    const searchFields = buildSearchFieldsQuery({
      ...params.search,
      has_map: { ...hasMapField, value: hasMapField.value ?? "true" },
    }, params.searchIds, false);
    const requestedSort = buildSort(params.sortBy, params.sortDesc, params.search);
    const sort = requestedSort.includes("geocase_id ")
      ? requestedSort
      : [requestedSort, "geocase_id asc"].filter(Boolean).join(",");
    const url = `${API_URL}?start=${(page - 1) * 20}&rows=20&sort=${sort}&fl=geocase_id,unitid,fullscientificname,locality&fq=latitude:${encodeURIComponent(latitude)}&fq=longitude:${encodeURIComponent(longitude)}&${searchFields}`;
    const res = await axios.get(url);
    return res.data.response;
  }

  static async getDetailView(id: string) {
    try {
      const url = `${API_URL}?q=geocase_id:"${decodeURIComponent(id)}"`;

      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  static async getDetailViewDataFromSource(dataSourceUrl: string) {
    try {
      const url = `${API_URL}/repeat?url=${encodeURIComponent(dataSourceUrl)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error(error);
      if (
        axios.isAxiosError<{ error?: string }>(error) &&
        error.response?.data.error
      ) {
        throw new Error(error.response.data.error);
      }
      throw new Error(error instanceof Error ? error.message : String(error));
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

  static async getDatasets(owner?: string) {
    const field = "datasourceurl,datasetowner,recordbasis";
    const res = await axios.get(`${API_URL}/`, {
      params: {
        q: "*:*",
        rows: 0,
        facet: "on",
        "facet.pivot": field,
        ...(owner
          ? { fq: `datasetowner:"${owner.replace(/["\\]/g, "\\$&")}"` }
          : {}),
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
      throw new Error(error instanceof Error ? error.message : String(error));
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
  includeFacets = true,
) {
  const encodedData: string[] = [];
  const facetFieldList: string[] = [];

  const ageNumber = (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : null;
  };
  let minimum = ageNumber(search.age_min?.value);
  let maximum = ageNumber(search.age_max?.value);
  if (minimum !== null && maximum !== null && minimum > maximum)
    [minimum, maximum] = [maximum, minimum];
  if (minimum !== null || maximum !== null) {
    const unit = search.age_unit?.value === "years" ? "*years*" : "My";
    const filters = [
      'parameter:"Geological age"',
      `unit_of_measurement:${unit}`,
    ];
    if (maximum !== null) filters.push(`lower_value:[* TO ${maximum}]`);
    if (minimum !== null) filters.push(`upper_value:[${minimum} TO *]`);
    encodedData.push(
      ...filters.map((filter) => `fq=${encodeURIComponent(filter)}`),
    );
  }

  searchIds.forEach((id) => {
    const searchField = search[id];
    if (!searchField || searchField.type === "age") return;
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

        if (includeFacets && type === "checkbox") {
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

      if (includeFacets && type === "checkbox") {
        let facetField = `facet.field=${name}`;
        if (isExcluded) facetField = `facet.field={!ex=${name}}${name}`;
        facetFieldList.push(facetField);
      }
    }
  });

  return encodedData.join("&") + "&" + facetFieldList.join("&");
}

function buildMapBoundsFilter(bounds?: MapBounds | null) {
  if (!bounds || bounds.west > bounds.east) return "";
  return `&fq=${encodeURIComponent(
    `coordinates:"Intersects(ENVELOPE(${bounds.west},${bounds.east},${bounds.north},${bounds.south}))"`,
  )}`;
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
