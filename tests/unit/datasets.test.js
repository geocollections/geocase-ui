import { afterEach, expect, it, vi } from "vitest";

afterEach(() => vi.unstubAllGlobals());
it("keeps all owners of a source, links known institutions and deduplicates specimen types", async () => {
  vi.stubGlobal("defineEventHandler", (handler) => handler);
  vi.stubGlobal("useRuntimeConfig", () => ({ apiBase: "https://example.test/" }));
  const fetch = vi.fn().mockResolvedValue({ facet_counts: { facet_pivot: {
    "datasourceurl,datasetowner,recordbasis": [
      { value: "https://source.test", count: 7, pivot: [
        { value: "Department of Geology, TalTech", count: 4, pivot: [{ value: "Fossil", count: 4 }] },
        { value: "Other museum", count: 3, pivot: [{ value: "Fossil", count: 2 }, { value: "Rock", count: 1 }] },
      ] },
      { value: "https://unknown.test", count: 1 },
      { value: "", count: 10 },
      { value: "https://empty.test", count: 0 },
    ],
  } } });
  vi.stubGlobal("$fetch", fetch);
  const handler = (await import("../../server/api/datasets.get.ts")).default;
  expect(await handler({})).toEqual([
    { url: "https://source.test", count: 7, owners: [
      { name: "Department of Geology, TalTech", count: 4, institutionId: "tallinn-university-of-technology" },
      { name: "Other museum", count: 3, institutionId: null },
    ], specimenTypes: ["Fossil", "Rock"] },
    { url: "https://unknown.test", count: 1, owners: [], specimenTypes: [] },
  ]);
  expect(fetch.mock.calls[0][1].query["facet.limit"]).toBe(-1);
});
