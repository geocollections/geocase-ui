import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useDetailStore } from "@/stores/detail";

beforeEach(() => setActivePinia(createPinia()));
describe("detail records with missing values", () => {
  it("omits whitespace and empty arrays while preserving numeric zero", () => {
    const store = useDetailStore();
    store.UPDATE_RESPONSE([
      {
        id: "1",
        unitid: "   ",
        country: " ",
        locality: [],
        latitude: 0,
        longitude: 25,
        datasetowner: "  ",
      },
    ]);
    const fields = store.filteredItemHeaders.map((header) => header.value);
    expect(fields).not.toContain("country");
    expect(fields).not.toContain("locality");
    expect(fields).not.toContain("unitid");
    expect(fields).toContain("latitude");
    expect(
      store.filteredItemHeadersSecondary.map((header) => header.value),
    ).not.toContain("datasetowner");
  });
  it("does not create a gallery from blank image entries", () => {
    const store = useDetailStore();
    store.UPDATE_RESPONSE([{ id: "1", images: [null, "", "   "] }]);
    expect(store.imageExists).toBe(false);
    store.UPDATE_RESPONSE([
      { id: "1", images: ["", "https://example.org/image.jpg"] },
    ]);
    expect(store.imageExists).toBe(true);
  });
  it.each([
    [0, 25, true],
    [59, 0, true],
    [null, 25, false],
    [" ", 25, false],
    [91, 25, false],
    [59, 181, false],
    ["invalid", 25, false],
  ])("validates coordinates %s, %s", (latitude, longitude, expected) => {
    const store = useDetailStore();
    store.UPDATE_RESPONSE([{ id: "1", has_map: true, latitude, longitude }]);
    expect(store.localityExists).toBe(expected);
  });
});
