import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import axios from "axios";
import { useSearchStore } from "@/stores/search";
import { useDetailStore } from "@/stores/detail";
import { useFrontpageStore } from "@/stores/frontpage";
import SearchService from "@/services/SearchService";
import i18n from "@/i18n";
import queryMixin from "@/mixins/queryMixin";
vi.mock("axios", () => ({ default: { get: vi.fn() } }));
beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  i18n.locale.value = "en";
});
describe("migrated search state and API contract", () => {
  it("ignores stale search results, counts and facets", async () => {
    const store = useSearchStore();
    vi.spyOn(store, "fetchMapResults").mockResolvedValue();
    let resolveOld;
    const oldResponse = new Promise((resolve) => { resolveOld = resolve; });
    vi.spyOn(SearchService, "search")
      .mockReturnValueOnce(oldResponse)
      .mockResolvedValueOnce({ response: { docs: [{ unitid: "new" }], numFound: 2 }, facet_counts: { facet_fields: { country: ["Estonia", 2] } } });
    const oldRequest = store.fetchResults();
    await store.fetchResults();
    resolveOld({ response: { docs: [{ unitid: "old" }], numFound: 99 }, facet_counts: { facet_fields: { country: ["Germany", 99] } } });
    await oldRequest;
    expect(store.responseResults).toEqual([{ unitid: "new" }]);
    expect(store.responseResultsCount).toBe(2);
    expect(store.country).toContain("Estonia");
    expect(store.country).not.toContain("Germany");
    vi.restoreAllMocks();
  });

  it("keeps loading while the latest request is pending and suppresses stale errors", async () => {
    const store = useSearchStore();
    vi.spyOn(store, "fetchMapResults").mockResolvedValue();
    let rejectOld, resolveNew;
    vi.spyOn(SearchService, "search")
      .mockReturnValueOnce(new Promise((_, reject) => { rejectOld = reject; }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve; }));
    const oldRequest = store.fetchResults();
    const latestRequest = store.fetchResults();
    rejectOld(new Error("Old search failed"));
    await oldRequest;
    expect(store.isLoading).toBe(true);
    resolveNew({ response: { docs: [], numFound: 0 } });
    await latestRequest;
    expect(store.isLoading).toBe(false);
    vi.restoreAllMocks();
  });

  it("limits the map to 3000 coordinate groups, counts duplicates and preserves table rows", async () => {
    const store = useSearchStore();
    const tableResults = [{ unitid: "table-row" }, { unitid: "same-location-row" }];
    store.responseResults = tableResults;
    store.mapBounds = { west: 20, south: 55, east: 30, north: 60 };
    store.updateSearchField({ id: "q", value: "quartz" });
    store.updateSearchField({ id: "country", value: "Estonia", lookUpType: "equals" });
    axios.get.mockResolvedValue({ data: {
      grouped: { "concat(latitude,',',longitude)": { groups: [
        { groupValue: "0,0", doclist: { numFound: 4000, docs: [
          { geocase_id: "mapped-record", latitude: 0, longitude: 0 },
        ] } },
        { groupValue: "1,2", doclist: { numFound: 1, docs: [
          { geocase_id: "another-location", latitude: 1, longitude: 2 },
        ] } },
      ] } },
    } });
    await store.fetchMapResults();
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.get("rows")).toBe("3000");
    expect(url.searchParams.get("group.func")).toBe("concat(latitude,',',longitude)");
    expect(url.searchParams.get("group.limit")).toBe("1");
    expect(url.searchParams.get("q")).toBe('"quartz"');
    expect(url.searchParams.getAll("fq")).toContain("has_map:true");
    expect(url.searchParams.getAll("fq").some((filter) => filter.includes("ENVELOPE"))).toBe(false);
    expect(store.mapResults).toEqual([
      { geocase_id: "mapped-record", has_map: true, latitude: 0, longitude: 0, mapCount: 4000 },
      { geocase_id: "another-location", has_map: true, latitude: 1, longitude: 2, mapCount: 1 },
    ]);
    expect(store.responseResults).toEqual(tableResults);
    expect(store.isMapLoading).toBe(false);
  });

  it("pages through all records at an exact location with active search filters", async () => {
    const store = useSearchStore();
    store.updateSearchField({ id: "q", value: "quartz" });
    store.updateSearchField({ id: "country", value: '"Estonia"' });
    const response = { docs: [{ geocase_id: "second-page" }], numFound: 21 };
    axios.get.mockResolvedValue({ data: { response } });
    const result = await SearchService.searchMapLocation({
      page: 1, paginateBy: 20, sortBy: ["unitid"], sortDesc: [true],
      search: store.search, searchIds: store.searchIds,
    }, 0, 2.5, 2);
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.get("start")).toBe("20");
    expect(url.searchParams.get("rows")).toBe("20");
    expect(url.searchParams.getAll("fq")).toEqual(expect.arrayContaining([
      "latitude:0", "longitude:2.5", 'country:"Estonia"',
    ]));
    expect(url.searchParams.get("q")).toBe('"quartz"');
    expect(url.searchParams.get("sort")).toBe("unitid desc,geocase_id asc");
    expect(result).toEqual(response);
  });

  it("loads country marker counts from Solr coordinate statistics", async () => {
    const store = useSearchStore();
    store.updateSearchField({ id: "q", value: "quartz" });
    axios.get.mockResolvedValue({
      data: {
        stats: {
          stats_fields: {
            latitude: {
              facets: {
                country: {
                  Estonia: { count: 12, mean: 58.7 },
                  "United States": { count: 20, mean: 39.8 },
                  Invalid: { count: 3, mean: null },
                },
              },
            },
            longitude: {
              facets: {
                country: {
                  Estonia: { count: 12, mean: 25.5 },
                  "United States": { count: 20, mean: -98.6 },
                  Invalid: { count: 3, mean: null },
                },
              },
            },
          },
        },
      },
    });

    await store.fetchMapResults();

    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.get("rows")).toBe("0");
    expect(url.searchParams.get("stats")).toBe("true");
    expect(url.searchParams.get("stats.facet")).toBe("country");
    expect(store.mapResultsLevel).toBe("country");
    expect(store.mapResults).toEqual([
      {
        country: "Estonia",
        latitude: 59,
        longitude: 26,
        mapCount: 12,
        has_map: true,
      },
      {
        country: "United States",
        latitude: 38,
        longitude: -97,
        mapCount: 20,
        has_map: true,
      },
    ]);
  });

  it("shows points for a selected country at low zoom and preserves table sorting", async () => {
    const store = useSearchStore();
    store.updateSearchField({ id: "country", value: '"Estonia"' });
    store.updateSortBy(["unitid"]);
    store.updateSortDesc([true]);
    store.mapZoom = 2;
    axios.get.mockResolvedValue({ data: { response: { docs: [] } } });
    await store.fetchMapResults();
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(store.mapResultsLevel).toBe("points");
    expect(url.searchParams.get("sort")).toBe("unitid desc");
    expect(url.searchParams.getAll("fq")).toContain('country:"Estonia"');
    store.updateMapViewport({
      zoom: 10,
      bounds: { west: 20, south: 55, east: 30, north: 60 },
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it("keeps the default table focused on its primary columns", () => {
    const store = useSearchStore();
    const visibleHeaders = store.getAllShownTableHeaders.map(
      (header) => header.key,
    );

    expect(visibleHeaders).toEqual([
      "collectioncode",
      "unitid",
      "highertaxon",
      "fullscientificname",
      "country",
      "locality",
      "stratigraphy",
      "recordURI",
      "url",
    ]);

    store.updateTableHeaders(["collectioncode"]);
    store.resetTableHeaders();
    expect(store.getAllShownTableHeaders.map((header) => header.key)).toEqual(
      visibleHeaders,
    );
  });

  it("preserves pagination, sort order and encoded filters", async () => {
    const store = useSearchStore();
    store.updateSearchField({ id: "q", value: "quartz & calcite" });
    store.updatePage(2);
    store.updateSortBy(["unitid"]);
    store.updateSortDesc([true]);
    axios.get.mockResolvedValue({
      data: {
        response: { docs: [{ unitid: "42" }], numFound: 80 },
        facet_counts: { facet_fields: { country: ["Estonia", 3] } },
      },
    });
    await store.fetchResults();
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.get("start")).toBe("25");
    expect(url.searchParams.get("sort")).toBe("unitid desc");
    expect(url.searchParams.get("q")).toBe("quartz & calcite");
    expect(store.responseResults[0].unitid).toBe("42");
    expect(store.country).toEqual(["Estonia"]);
    expect(store.getCheckboxesCount("country")).toEqual([3]);
    expect(store.isLoading).toBe(false);
  });
  it("uses dataset navigation as an exact source filter with match-all search", async () => {
    const store = useSearchStore();
    const source = 'https://example.org/query?filter=a&schema=b#"source"';
    queryMixin.methods.deconstructQueryParams.call(
      {
        searchIds: store.searchIds,
        lookUpTypes: store.lookUpTypes,
        searchParamsList: store.searchParamsList,
        updateSearchField: store.updateSearchField,
        updateSearchParam: store.updateSearchParam,
      },
      { datasourceurl__equals: source },
    );
    axios.get.mockResolvedValue({
      data: { response: { docs: [], numFound: 7 } },
    });
    await store.fetchResults();
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.get("q")).toBe("*");
    expect(url.searchParams.getAll("fq")).toContain(
      `datasourceurl:"${source.replace(/["\\]/g, "\\$&")}"`,
    );
    expect(store.responseResultsCount).toBe(7);
    store.resetSearch();
    expect(store.search.datasourceurl.value).toBeNull();
  });
  it("resets filters and pagination and preserves translated column identities", () => {
    const store = useSearchStore();
    expect(store.search.map.showCheckboxes).toBe(false);
    expect(
      store.searchCheckboxIds.every((id) => store.search[id].showCheckboxes),
    ).toBe(true);
    expect(
      store.searchCheckboxIds.every((id) => !store.search[id].showMore),
    ).toBe(true);
    store.updateSearchParam({ field: "page", value: "4" });
    store.updateSearchParam({ field: "sort_desc", value: "true,false" });
    store.updateSearchField({ id: "country", value: '"Estonia"' });
    expect(store.page).toBe(4);
    expect(store.sortDesc).toEqual([true, false]);
    const before = store.getAllShownTableHeaders.find(
      (h) => h.key === "unitid",
    ).title;
    i18n.locale.value = "ee";
    expect(
      store.getAllShownTableHeaders.find((h) => h.key === "unitid").title,
    ).not.toBe(before);
    store.resetSearch();
    expect(store.page).toBe(1);
    expect(store.search.country.value).toBeNull();
  });
  it("keeps computed specimen fields and map counts reactive", async () => {
    const detail = useDetailStore();
    detail.UPDATE_RESPONSE([
      {
        id: "1",
        geocase_id: "1",
        recordbasis: "Mineral",
        fullscientificname: "Quartz",
      },
    ]);
    expect(detail.itemExists).toBe(true);
    expect(detail.isItemMineral).toBe(true);
    expect(detail.filteredItemHeaders.length).toBeGreaterThanOrEqual(0);
    const front = useFrontpageStore();
    expect(front.getCards.fossil.url).toBe(
      '/search?recordbasis="Fossil"',
    );
    expect(front.getCards.mineral.url).toBe(
      '/search?recordbasis="Mineral"',
    );
    expect(front.getCards.rock.url).toBe(
      '/search?recordbasis="Rock"',
    );
    expect(front.getCards.meteorite.url).toBe(
      '/search?recordbasis="Meteorite"',
    );
    axios.get.mockResolvedValue({
      data: { response: { docs: [{ unitid: "42" }], numFound: 1 } },
    });
    await front.getLocalitySpecimens({ id: "site", lat: 59, lng: 24 });
    expect(front.mapResults.site.numFound).toBe(1);
  });
  it("preserves repeat-source request encoding", async () => {
    axios.get.mockResolvedValue({ data: {} });
    const source = "https://example.org/query?filter=a&schema=b";
    await SearchService.getDetailViewDataFromSource(source);
    expect(
      new URL(axios.get.mock.calls[0][0], "http://localhost").searchParams.get(
        "url",
      ),
    ).toBe(source);
  });
});

describe("homepage material samples navigation", () => {
  it("uses the requested collection images and display order", () => {
    const store = useFrontpageStore();
    const imageBase =
      "https://files.geocollections.info/img/geocase/front_page/";

    expect(store.cardIds).toEqual([
      "mineral",
      "rock",
      "meteorite",
      "fossil",
      "materialSample",
    ]);
    expect(store.cards.fossil.image).toBe(`${imageBase}fossil2.jpg`);
    expect(store.cards.rock.image).toBe(`${imageBase}rock2.jpg`);
    expect(store.cards.meteorite.image).toBe(`${imageBase}meteorite2.jpg`);
    expect(store.cards.materialSample.image).toBe(
      `${imageBase}materialsample2.jpg`,
    );
  });

  it("only filters material samples when the unfiltered statistics contain them", async () => {
    const store = useFrontpageStore();
    expect(store.getCards.materialSample.url).toBe("/search");
    for (const [types, expected] of [
      [["Mineral", 12], "/search"],
      [["MaterialSample", 0], "/search"],
      [["MaterialSample", 3], '/search?recordbasis="MaterialSample"'],
      [[], "/search"],
    ]) {
      axios.get.mockResolvedValue({
        data: {
          response: { numFound: 12 },
          facet_counts: {
            facet_fields: { recordbasis: types, country: ["Estonia", 12] },
          },
        },
      });
      await store.getStats();
      expect(store.getCards.materialSample.url).toBe(expected);
      expect(store.country).toBe(1);
    }
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.getAll("facet.field")).toContain("recordbasis");
  });
});

describe("material subtype and geological age", () => {
  it("requests and filters material subtypes without a provider country control", async () => {
    const store = useSearchStore();
    store.updateSearchField({
      id: "kindofunit",
      value: '"Microfossil preparation" "Pollen"',
    });
    axios.get.mockResolvedValue({
      data: {
        response: { docs: [] },
        facet_counts: {
          facet_fields: { kindofunit: ["Pollen", 2, "Drillcore", 1] },
        },
      },
    });
    await store.fetchResults();
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.getAll("fq")).toContain(
      '{!tag=kindofunit}kindofunit:("Microfossil preparation" "Pollen")',
    );
    expect(url.searchParams.getAll("facet.field")).toContain(
      "{!ex=kindofunit}kindofunit",
    );
    expect(store.kindofunit).toEqual(["Pollen", "Drillcore"]);
    expect(store.searchCheckboxIds.slice(0, 2)).toEqual([
      "recordbasis",
      "kindofunit",
    ]);
    expect(store.searchCheckboxIds).not.toContain("providercountry");
  });

  it.each([
    ["My", "My"],
    ["years", "*years*"],
  ])("builds an overlapping age range in %s", async (unit, expected) => {
    const store = useSearchStore();
    store.updateSearchField({ id: "age_min", value: "400" });
    store.updateSearchField({ id: "age_max", value: "450" });
    store.updateSearchField({ id: "age_unit", value: unit });
    axios.get.mockResolvedValue({ data: { response: { docs: [] } } });
    await store.fetchResults();
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.getAll("fq")).toEqual(
      expect.arrayContaining([
        'parameter:"Geological age"',
        `unit_of_measurement:${expected}`,
        "lower_value:[* TO 450]",
        "upper_value:[400 TO *]",
      ]),
    );
    expect(
      url.searchParams.getAll("fq").some((filter) => filter.startsWith("age_")),
    ).toBe(false);
  });

  it("defaults to My, accepts zero, and resets age fields", async () => {
    const store = useSearchStore();
    store.updateSearchField({ id: "age_min", value: "0" });
    axios.get.mockResolvedValue({ data: { response: { docs: [] } } });
    await store.fetchResults();
    const filters = new URL(
      axios.get.mock.calls[0][0],
      "http://localhost",
    ).searchParams.getAll("fq");
    expect(filters).toContain("unit_of_measurement:My");
    expect(filters).toContain("upper_value:[0 TO *]");
    expect(filters.some((filter) => filter.startsWith("lower_value:"))).toBe(
      false,
    );
    store.resetSearch();
    expect(store.search.age_min.value).toBeNull();
    expect(store.search.age_unit.value).toBeNull();
  });

  it("reads subtype and geological ages from Solr without provider data", () => {
    const store = useDetailStore();
    store.UPDATE_RESPONSE([
      {
        id: "demo",
        kindofunit: "Pollen",
        parameter: ["Weight", "Geological age"],
        lower_value: [10, 400],
        upper_value: [20, 450],
        unit_of_measurement: ["g", "My"],
      },
    ]);
    expect(store.kindOfUnit).toBe("Pollen");
    expect(store.geologicalAge).toEqual(["400 – 450 My"]);
    expect(store.filteredItemHeaders.map((header) => header.value)).toContain(
      "geologicalAge",
    );
    store.UPDATE_RESPONSE([
      {
        id: "demo",
        parameter: "Geological age",
        value_lower: 0,
        value_upper: 100,
        unit_of_measurement: "years",
      },
    ]);
    expect(store.geologicalAge).toEqual(["0 – 100 years"]);
    store.UPDATE_RESPONSE([
      { id: "demo", parameter: "Weight", lower_value: 10, upper_value: 20 },
    ]);
    expect(store.geologicalAge).toBeNull();
  });
});

describe("age filter URL state", () => {
  it("restores subtype and age from a bookmarked query", () => {
    const store = useSearchStore();
    queryMixin.methods.deconstructQueryParams.call(
      {
        searchIds: store.searchIds,
        searchParamsList: store.searchParamsList,
        lookUpTypes: store.lookUpTypes,
        updateSearchField: store.updateSearchField,
        updateSearchParam: store.updateSearchParam,
      },
      {
        kindofunit: '"Pollen"',
        age_min: "400",
        age_max: "450",
        age_unit: "years",
      },
    );
    expect(store.search.kindofunit.value).toBe('"Pollen"');
    expect(store.search.age_min.value).toBe("400");
    expect(store.search.age_max.value).toBe("450");
    expect(store.search.age_unit.value).toBe("years");
  });
  it("ignores invalid ages and normalizes reversed bounds", async () => {
    const store = useSearchStore();
    axios.get.mockResolvedValue({ data: { response: { docs: [] } } });
    store.updateSearchField({ id: "age_min", value: "-10" });
    store.updateSearchField({ id: "age_max", value: "NaN" });
    await store.fetchResults();
    let filters = new URL(
      axios.get.mock.calls[0][0],
      "http://localhost",
    ).searchParams.getAll("fq");
    expect(filters.some((filter) => filter.includes("Geological age"))).toBe(
      false,
    );
    store.updateSearchField({ id: "age_min", value: "450" });
    store.updateSearchField({ id: "age_max", value: "400" });
    await store.fetchResults();
    filters = new URL(
      axios.get.mock.calls.findLast(([url]) => !url.includes("stats=true"))[0],
      "http://localhost",
    ).searchParams.getAll("fq");
    expect(filters).toContain("lower_value:[* TO 450]");
    expect(filters).toContain("upper_value:[400 TO *]");
  });
});
