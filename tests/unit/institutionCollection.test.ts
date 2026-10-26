import { afterEach, describe, expect, it, vi } from "vitest";

async function handler(id, fetch) {
  vi.stubGlobal("defineEventHandler", (fn) => fn);
  vi.stubGlobal("getRouterParam", () => id);
  vi.stubGlobal("useRuntimeConfig", () => ({
    apiBase: "https://example.test",
  }));
  vi.stubGlobal("createError", (error) => Object.assign(new Error(), error));
  vi.stubGlobal("loadInstitutionCatalog", async () => id === "unknown" ? [] : [{ id, institution_id: 1 }]);
  vi.stubGlobal("loadDatasetCatalog", async () => id === "cetaf" ? [] : [{ institution_id: 1, provider_url: "https://source.test/collection" }]);
  const upstreamFetch = fetch;
  vi.stubGlobal("$fetch", (url, options) => {
    if ([options.query["facet.field"]].flat().includes("country")) {
      return Promise.resolve({
        response: { numFound: 20, docs: [] },
        facet_counts: { facet_fields: { country: ["Estonia", 12, "Finland", 8], datasetowner: ["Department of Geology, TalTech", 20] } },
      });
    }
    return upstreamFetch(url, options);
  });
  return (await import("../../server/api/institution/[id].get.ts")).default({});
}
afterEach(() => vi.unstubAllGlobals());

describe("institution collections", () => {
  it("does not query unrelated collections when the institution has no dataset", async () => {
    const fetch = vi.fn();
    expect(await handler("cetaf", fetch)).toEqual({
      points: [],
      countries: [],
      images: [],
      total: 0,
    });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects unknown institutions", async () => {
    await expect(handler("unknown", vi.fn())).rejects.toMatchObject({
      statusCode: 404,
    });
  });
  it("filters every request by the catalog source, retains zero coordinates and limits images", async () => {
    const docs = Array.from({ length: 8 }, (_, index) => ({
      geocase_id: `id-${index}`,
      images: [`https://images.test/image-${index}.jpg`],
      unitid: `specimen-${index}`,
    }));
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({
        response: { numFound: 20 },
        facet_counts: {
          facet_fields: { country: ["Estonia", 12, "Finland", 8], datasetowner: ["Department of Geology, TalTech", 20] },
          facet_pivot: {
            "latitude,longitude": [
              { value: 0, pivot: [{ value: 0, count: 2 }] },
              {
                value: 59,
                pivot: [
                  { value: 24, count: 3 },
                  { value: 181, count: 1 },
                ],
              },
            ],
          },
        },
      })
      .mockResolvedValueOnce({ response: { numFound: 8 } })
      .mockResolvedValueOnce({ response: { docs } })
      .mockResolvedValueOnce(new Uint8Array([0]).buffer)
      .mockResolvedValue(new Uint8Array([1]).buffer);
    const result = await handler("tallinn-university-of-technology", fetch);
    expect(result.points).toEqual([
      { latitude: 0, longitude: 0, count: 2 },
      { latitude: 59, longitude: 24, count: 3 },
    ]);
    expect(result.countries).toEqual([
      { country: "Estonia", count: 12 },
      { country: "Finland", count: 8 },
    ]);
    expect(fetch.mock.calls[0][1].query["facet.field"]).toBeUndefined();
    expect(result.images).toHaveLength(8);
    expect(new Set(result.images.map((image) => image.id)).size).toBe(8);
    for (const [, options] of fetch.mock.calls.slice(0, 3)) {
      expect([options.query.fq].flat()).toContain(
        'datasourceurl:( "https://source.test/collection" )',
      );
    }
    expect(fetch.mock.calls[0][1].query["facet.limit"]).toBe(-1);
    expect(fetch.mock.calls[2][1].query.start).toBe(0);
  });
  it("omits local file paths and explicit placeholder images", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({ response: { numFound: 1 } })
      .mockResolvedValueOnce({ response: { numFound: 1 } })
      .mockResolvedValueOnce({
        response: {
          docs: [
            { geocase_id: "local", images: ["T:\\pal\\specimen.JPG"] },
            {
              geocase_id: "placeholder",
              images: ["https://images.test/specimen__placeholder.jpg"],
            },
          ],
        },
      });
    const result = await handler("natural-history-museum-stuttgart", fetch);
    expect(result.images).toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("returns direct images without server-side thumbnail probes", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({ response: { numFound: 1 } })
      .mockResolvedValueOnce({ response: { numFound: 1 } })
      .mockResolvedValueOnce({
        response: {
          docs: [
            {
              geocase_id: "working",
              images: ["https://images.test/working.jpg"],
            },
          ],
        },
      });
    const result = await handler("museum-fuer-naturkunde-berlin", fetch);
    expect(result.images).toEqual([
      expect.objectContaining({
        id: "working",
        previewUrl: "https://images.test/working.jpg",
        fallbackUrl:
          "https://geocase.eu/thumbnails/https%3A%2F%2Fimages.test%2Fworking.jpg",
      }),
    ]);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
  it("preserves images when the coordinate query fails", async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("timeout"))
      .mockResolvedValueOnce({ response: { numFound: 1 } })
      .mockResolvedValueOnce({
        response: {
          docs: [
            { geocase_id: "working", images: ["http://images.test/image.jpg"] },
          ],
        },
      });
    const result = await handler("museum-fuer-naturkunde-berlin", fetch);
    expect(result.coordinatesUnavailable).toBe(true);
    expect(result.locationsUnavailable).toBe(false);
    expect(result.countries).toHaveLength(2);
    expect(result.images[0].previewUrl).toBe("https://images.test/image.jpg");
    expect(result.points).toEqual([]);
  });
  it("preserves coordinates when the image query fails", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce({
        response: { numFound: 1 },
        facet_counts: {
          facet_pivot: {
            "latitude,longitude": [
              { value: 59, pivot: [{ value: 24, count: 1 }] },
            ],
          },
        },
      })
      .mockRejectedValueOnce(new Error("timeout"));
    const result = await handler("museum-fuer-naturkunde-berlin", fetch);
    expect(result.imagesUnavailable).toBe(true);
    expect(result.points).toEqual([{ latitude: 59, longitude: 24, count: 1 }]);
  });
});


describe("institution collection owner scope", () => {
  it("uses the same exact owner and source scope for counts, map and images", async () => {
    const { loadInstitutionCollection } = await import("../../app/services/institutionCollection");
    const fetcher = vi.fn(async (_url, options) => {
      if (options.query["facet.field"] === "datasetowner") return {
        response: { numFound: 30, docs: [] },
        facet_counts: { facet_fields: { datasetowner: ["Department of Geology, TalTech", 7, "University of Tartu", 23] } },
      };
      return { response: { numFound: [options.query.fq].flat().includes("images:*") ? 0 : 7, docs: [] } };
    });
    const result = await loadInstitutionCollection(["https://source.test/shared"], "/api", fetcher, ["TalTech Department of Geology"]);
    expect(result.total).toBe(7);
    expect(fetcher).toHaveBeenCalledTimes(4);
    for (const [, options] of fetcher.mock.calls.slice(1)) {
      const filter = [options.query.fq].flat().join(" ");
      expect(filter).toContain('datasourceurl:( "https://source.test/shared" )');
      expect(filter).toContain('AND datasetowner:( "Department of Geology, TalTech" )');
      expect(filter).not.toContain("University of Tartu");
    }
  });

  it("does not silently include other institutions when the owner is ambiguous", async () => {
    const { loadInstitutionCollection } = await import("../../app/services/institutionCollection");
    const fetcher = vi.fn().mockResolvedValue({ response: { numFound: 30, docs: [] }, facet_counts: { facet_fields: { datasetowner: ["Museum A", 10, "Museum B", 20] } } });
    await expect(loadInstitutionCollection(["https://source.test/shared"], "/api", fetcher, ["Museum C"])).rejects.toThrow("owner could not be resolved");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
