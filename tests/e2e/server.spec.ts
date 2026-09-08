import { test, expect } from "@playwright/test";
test("Nitro proxies preserve encoded and repeated Solr parameters", async ({
  request,
}) => {
  const response = await request.get(
    "/api?q=quartz%20%26%20calcite&fq=country%3AEstonia&fq=recordbasis%3AMineral",
  );
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    path: "/v1/solr",
    params: [
      ["q", "quartz & calcite"],
      ["fq", "country:Estonia"],
      ["fq", "recordbasis:Mineral"],
    ],
  });
});
test("provider proxy preserves source URLs and upstream error status", async ({
  request,
}) => {
  const source = "https://example.org/query?filter=a&schema=b";
  const response = await request.get(
    `/api/repeat?url=${encodeURIComponent(source)}`,
  );
  expect(await response.json()).toMatchObject({
    path: "/v1/repeat",
    params: [["url", source]],
  });
  expect((await request.get("/api?status=503")).status()).toBe(503);
});
test("sitemap and localized direct entry routes are served", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("https://geocase.eu/ee/search");
  expect((await request.get("/de/specimen/demo%3A1")).status()).toBe(200);
});
