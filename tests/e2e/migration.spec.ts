import { test, expect } from "@playwright/test";
const specimen = {
  id: "1",
  geocase_id: "demo:1",
  unitid: "DEMO-1",
  collectioncode: "GEO",
  fullscientificname: "Quartz",
  recordbasis: "Mineral",
  country: "Estonia",
  locality: "Tallinn",
  datasetowner: "Test Museum",
  has_image: true,
  images: ["https://example.org/quartz.jpg"],
  has_map: true,
  latitude: 59.4,
  longitude: 24.7,
};
test.beforeEach(async ({ page }) => {
  await page.route(
    /https:\/\/(geocase.eu\/thumbnails|files.geocollections.info|example.org)\//,
    (route) =>
      route.fulfill({
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
          "base64",
        ),
      }),
  );
  await page.route("https://map.geocase.eu/**", (route) =>
    route.fulfill({
      json: {
        version: 8,
        sources: {
          sites: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: { type: "Point", coordinates: [15, 45] },
                  properties: {
                    id: "site-1",
                    locality: "Test locality",
                    latitude: 45,
                    longitude: 15,
                  },
                },
              ],
            },
          },
        },
        layers: [
          {
            id: "geocase-distinct",
            type: "circle",
            source: "sites",
            paint: { "circle-radius": 10, "circle-color": "#FFA000" },
          },
        ],
      },
    }),
  );
  await page.route("**/api?**", (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("wt") === "csv")
      return route.fulfill({
        body: "geocase_id,unitid,fullscientificname,country",
        contentType: "text/csv",
      });
    const isDetail = url.searchParams.get("q")?.startsWith("geocase_id:");
    return route.fulfill({
      json: {
        response: {
          numFound: isDetail ? 1 : 75,
          docs: url.searchParams.get("rows") === "0" ? [] : [specimen],
        },
        facet_counts: {
          facet_fields: {
            country: ["Estonia", 75],
            datasetowner: ["Test Museum", 75],
            recordbasis: ["Mineral", 75],
          },
        },
      },
    });
  });
});
test("homepage quick search, help and localized routes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "GeoCASe",
  );
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page
    .locator('.fast-search-input .v-input__append [role="button"]')
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "OK", exact: true })
    .click();
  await page.locator(".fast-search-input input:visible").fill("quartz");
  await page.locator(".fast-search-input input:visible").press("Enter");
  await expect(page).toHaveURL(/search.*q=quartz/);
  await expect(page.locator("#table")).toContainText("DEMO-1");
  await page.getByRole("button", { name: "select language" }).click();
  await page.getByText("EST", { exact: true }).click();
  await expect(page).toHaveURL(/\/ee\/search/);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "et");
  expect(errors).toEqual([]);
});
test("server table sorting, pagination, export and specimen navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page.locator("#table")).toContainText("DEMO-1");
  await page.locator("#table th").filter({ hasText: "Object ID" }).click();
  await expect(page).toHaveURL(/sort_by=unitid/);
  await page
    .locator(".table-top button")
    .filter({ has: page.locator(".mdi-chevron-right") })
    .last()
    .click();
  await expect(page).toHaveURL(/page=2/);
  await page.getByRole("button", { name: "export table" }).click();
  const download = page.waitForEvent("download");
  await page.getByText("CSV", { exact: true }).click();
  expect((await download).suggestedFilename()).toBe("GeoCASe.csv");
  await page.getByRole("link", { name: "DEMO-1" }).click();
  await expect(page).toHaveURL(/specimen\/demo/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quartz");
  await expect(
    page.locator('.v-carousel-item a[href="https://example.org/quartz.jpg"]'),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/specimen-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "select language" }).click();
  await page.getByText("GER", { exact: true }).click();
  await expect(page).toHaveURL(/\/de\/specimen\/demo/);
  expect(errors).toEqual([]);
});
test("static pages and mobile navigation render without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ee/about");
  await expect(page.locator(".static-page")).toContainText("GeoCASe");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("button", { name: "Open navigation drawer" }).click();
  await expect(page.locator(".v-navigation-drawer--active")).toBeVisible();
  await page.screenshot({
    path: "test-results/navigation-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("image gallery, filter changes and map tab", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("tab", { name: /images/i }).click();
  await page.locator(".image-hover").first().click();
  await expect(page.getByRole("dialog")).toContainText("Image gallery");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("tab", { name: /map/i }).click();
  await expect(
    page.locator(".v-window-item--active .leaflet-container"),
  ).toBeVisible();
  await page.getByRole("tab", { name: /table/i }).click();
  const quick = page.locator(".search-drawer-text-field input").first();
  await quick.fill("calcite");
  await expect(page).toHaveURL(/q=calcite/);
  await page.goBack();
  await expect(quick).toHaveValue("quartz");
  expect(errors).toEqual([]);
});

test("homepage map loads its worker and opens locality specimens", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const canvas = page.locator(".map-canvas canvas");
  await canvas.scrollIntoViewIfNeeded();
  await expect(canvas).toBeVisible();
  await expect(async () => {
    await canvas.click();
    await expect(page.locator(".maplibregl-popup")).toContainText(
      "Test locality",
      { timeout: 1000 },
    );
  }).toPass({ timeout: 15000 });
  await page
    .locator(".maplibregl-popup")
    .getByRole("button", { name: /search/i })
    .click();
  await expect(page.locator(".maplibregl-popup")).toContainText("DEMO-1");
  await page.screenshot({
    path: "test-results/homepage-desktop.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
