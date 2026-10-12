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
  it("fetches viewport-bounded mapped records separately from table results", async () => {
    const store = useSearchStore();
    const tableResults = [{ unitid: "table-row" }];
    store.responseResults = tableResults;
    store.mapZoom = 9;
    store.mapBounds = { west: 20, south: 55, east: 30, north: 60 };
    store.updateSearchField({ id: "q", value: "quartz" });
    store.updateSearchField({
      id: "country",
      value: "Estonia",
      lookUpType: "equals",
    });
    axios.get.mockResolvedValue({
      data: {
        response: {
          docs: [{ geocase_id: "mapped-record", has_map: true }],
          numFound: 1200,
        },
      },
    });

    await store.fetchMapResults();

    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.get("start")).toBe("0");
    expect(url.searchParams.get("rows")).toBe("1000");
    expect(url.searchParams.get("q")).toBe('"quartz"');
    expect(url.searchParams.getAll("fq")).toContain("has_map:true");
    expect(url.searchParams.getAll("fq")).toContain(
      'coordinates:"Intersects(ENVELOPE(20,30,60,55))"',
    );
    expect(url.searchParams.get("fl")).toContain(
      "geocase_id,recordURI,has_map,latitude,longitude",
    );
    expect(url.searchParams.has("facet")).toBe(false);
    expect(url.searchParams.has("facet.field")).toBe(false);
    expect(store.mapResults).toEqual([
      { geocase_id: "mapped-record", has_map: true },
    ]);
    expect(store.responseResults).toEqual(tableResults);
    expect(store.isMapLoading).toBe(false);
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
        latitude: 58.7,
        longitude: 25.5,
        mapCount: 12,
        has_map: true,
      },
      {
        country: "United States",
        latitude: 39.8,
        longitude: -98.6,
        mapCount: 20,
        has_map: true,
      },
    ]);
  });

  it("loads locality groups after a country is selected and zoomed", async () => {
    const store = useSearchStore();
    store.updateSearchField({
      id: "country",
      value: "Estonia",
      lookUpType: "equals",
    });
    store.mapZoom = 5;
    store.mapBounds = { west: 20, south: 55, east: 30, north: 60 };
    axios.get.mockResolvedValue({
      data: {
        grouped: {
          locality: {
            groups: [
              {
                groupValue: "Tartu",
                doclist: {
                  numFound: 9,
                  docs: [
                    {
                      country: "Estonia",
                      latitude: 58.38,
                      longitude: 26.72,
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    });

    await store.fetchMapResults();

    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.get("group")).toBe("true");
    expect(url.searchParams.get("group.field")).toBe("locality");
    expect(url.searchParams.getAll("fq")).toContain(
      'coordinates:"Intersects(ENVELOPE(20,30,60,55))"',
    );
    expect(store.mapResultsLevel).toBe("locality");
    expect(store.mapResults).toEqual([
      {
        country: "Estonia",
        locality: "Tartu",
        latitude: 58.38,
        longitude: 26.72,
        mapCount: 9,
        has_map: true,
      },
    ]);
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
    queryMixin.methods.deconstructQueryParams.call({
      searchIds: store.searchIds,
      lookUpTypes: store.lookUpTypes,
      searchParamsList: store.searchParamsList,
      updateSearchField: store.updateSearchField,
      updateSearchParam: store.updateSearchParam,
    }, { datasourceurl__equals: source });
    axios.get.mockResolvedValue({ data: { response: { docs: [], numFound: 7 } } });
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
      store.searchCheckboxIds.every(
        (id) => store.search[id].showCheckboxes,
      ),
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
      '/search?recordbasis="Fossil" "FossilSpecimen"',
    );
    expect(front.getCards.mineral.url).toBe(
      '/search?recordbasis="Mineral" "MineralSpecimen"',
    );
    expect(front.getCards.rock.url).toBe(
      '/search?recordbasis="Rock" "RockSpecimen"',
    );
    expect(front.getCards.meteorite.url).toBe(
      '/search?recordbasis="Meteorite" "MeteoriteSpecimen"',
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
    const imageBase = "https://files.geocollections.info/img/geocase/front_page/";

    expect(store.cardIds).toEqual([
      "fossil",
      "mineral",
      "rock",
      "meteorite",
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
      axios.get.mockResolvedValue({ data: {
        response: { numFound: 12 },
        facet_counts: { facet_fields: { recordbasis: types, country: ["Estonia", 12] } },
      } });
      await store.getStats();
      expect(store.getCards.materialSample.url).toBe(expected);
      expect(store.country).toBe(1);
    }
    const url = new URL(axios.get.mock.calls[0][0], "http://localhost");
    expect(url.searchParams.getAll("facet.field")).toContain("recordbasis");
  });
});
