import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import axios from "axios";
import { useSearchStore } from "@/stores/search";
import { useDetailStore } from "@/stores/detail";
import { useFrontpageStore } from "@/stores/frontpage";
import SearchService from "@/services/SearchService";
import i18n from "@/i18n";
vi.mock("axios", () => ({ default: { get: vi.fn() } }));
beforeEach(() => {
  setActivePinia(createPinia());
  vi.clearAllMocks();
  i18n.locale.value = "en";
});
describe("migrated search state and API contract", () => {
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
