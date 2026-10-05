import { afterEach, describe, expect, it, vi } from "vitest";

async function handler(id, fetch) {
  vi.stubGlobal("defineEventHandler", (fn) => fn);
  vi.stubGlobal("getRouterParam", () => id);
  vi.stubGlobal("useRuntimeConfig", () => ({ apiBase: "https://example.test" }));
  vi.stubGlobal("createError", (error) => Object.assign(new Error(), error));
  vi.stubGlobal("$fetch", fetch);
  return (await import("../../server/api/institution/[id].get.ts")).default({});
}
afterEach(() => vi.unstubAllGlobals());

describe("institution collections", () => {
  it("does not query unrelated collections when the institution has no dataset", async () => {
    const fetch = vi.fn();
    expect(await handler("cetaf", fetch)).toEqual({ points: [], images: [], total: 0 });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects unknown institutions", async () => {
    await expect(handler("unknown", vi.fn())).rejects.toMatchObject({ statusCode: 404 });
  });
  it("filters every request by the exact owner, retains zero coordinates and limits images", async () => {
    const docs = Array.from({ length: 8 }, (_, index) => ({ geocase_id: `id-${index}`, images: [`https://images.test/image-${index}.jpg`], unitid: `specimen-${index}` }));
    const fetch = vi.fn()
      .mockResolvedValueOnce({ response: { numFound: 20 }, facet_counts: { facet_pivot: { "latitude,longitude": [
        { value: 0, pivot: [{ value: 0, count: 2 }] },
        { value: 59, pivot: [{ value: 24, count: 3 }, { value: 181, count: 1 }] },
      ] } } })
      .mockResolvedValueOnce({ response: { numFound: 8 } })
      .mockResolvedValueOnce({ response: { docs } })
      .mockResolvedValueOnce(new Uint8Array([0]).buffer)
      .mockResolvedValue(new Uint8Array([1]).buffer);
    const result = await handler("tallinn-university-of-technology", fetch);
    expect(result.points).toEqual([{ latitude: 0, longitude: 0, count: 2 }, { latitude: 59, longitude: 24, count: 3 }]);
    expect(result.images).toHaveLength(6);
    expect(new Set(result.images.map((image) => image.id)).size).toBe(6);
    for (const [, options] of fetch.mock.calls.slice(0, 3)) {
      expect([options.query.fq].flat()).toContain('datasetowner:"Department of Geology, TalTech"');
    }
    expect(fetch.mock.calls[0][1].query["facet.limit"]).toBe(-1);
    expect(fetch.mock.calls[2][1].query.start).toBe(0);
  });
  it("omits local file paths and explicit placeholder images", async () => {
    const fetch = vi.fn()
      .mockResolvedValueOnce({ response: { numFound: 1 } })
      .mockResolvedValueOnce({ response: { numFound: 1 } })
      .mockResolvedValueOnce({ response: { docs: [
        { geocase_id: "local", images: ["T:\\pal\\specimen.JPG"] },
        { geocase_id: "placeholder", images: ["https://images.test/specimen__placeholder.jpg"] },
      ] } });
    const result = await handler("natural-history-museum-stuttgart", fetch);
    expect(result.images).toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("rejects successful placeholder responses and tries another image after a failed preview", async () => {
    const missing = new Uint8Array([0, 1, 2]).buffer;
    const fetch = vi.fn()
      .mockResolvedValueOnce({ response: { numFound: 2 } })
      .mockResolvedValueOnce({ response: { numFound: 2 } })
      .mockResolvedValueOnce({ response: { docs: [
        { geocase_id: "missing", images: ["https://images.test/missing.jpg"] },
        { geocase_id: "working", images: ["https://images.test/broken.jpg", "https://images.test/working.jpg"] },
      ] } })
      .mockImplementation(async (url) => {
        if (url.includes("broken.jpg")) throw new Error("404");
        return url.includes("working.jpg") ? new Uint8Array([3, 4, 5]).buffer : missing;
      });
    const result = await handler("museum-fuer-naturkunde-berlin", fetch);
    expect(result.images).toEqual([expect.objectContaining({
      id: "working", url: "https://images.test/working.jpg",
      previewUrl: "https://geocase.eu/thumbnails/https%3A%2F%2Fimages.test%2Fworking.jpg",
    })]);
  });

});
