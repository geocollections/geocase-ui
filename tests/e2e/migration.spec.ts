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
  await page.getByRole("button", { name: "Search help", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "OK", exact: true })
    .click();
  const quickSearch = page
    .getByRole("search")
    .getByRole("textbox", { name: "Quick search...", exact: true });
  await quickSearch.fill("quartz");
  await quickSearch.press("Enter");
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
  await page
    .locator("#table")
    .getByRole("button", { name: "Object ID", exact: true })
    .click();
  await expect(page).toHaveURL(/sort_by=unitid/);
  await page.getByRole("button", { name: "export table" }).click();
  const download = page.waitForEvent("download");
  await page.getByText("CSV", { exact: true }).click();
  expect((await download).suggestedFilename()).toBe("GeoCASe.csv");
  await page
    .locator(".table-top")
    .getByRole("button", { name: "Next page" })
    .click();
  await expect(page).toHaveURL(/page=2/);
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
  await page.getByRole("button", { name: "Menüü", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Site navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Menüü", exact: true }),
  ).toBeFocused();
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
  await page
    .getByRole("button", { name: /^open gallery:/i })
    .first()
    .click();
  await expect(page.getByRole("dialog")).toContainText("Image gallery");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Map", exact: true })
      .locator(".leaflet-container"),
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

test("Nuxt UI header keeps the brand visible and exposes external resources", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const header = page.getByRole("banner");
  for (const width of [390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const brand = header.getByRole("link", { name: /GeoCASe/ });
    await expect(brand).toBeVisible();
    expect(await brand.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(
      true,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.mouse.move(0, 200);
  await expect(
    header.getByRole("button", { name: "Menu", exact: true }),
  ).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await header.getByRole("button", { name: /resources/i }).click();
  await expect(page.getByRole("menuitem", { name: /github/i })).toHaveAttribute(
    "href",
    "https://github.com/geocollections/geocase-ui",
  );
});

test("Nuxt UI filters select, clear and reset facets", async ({ page }) => {
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const filters = page.getByRole("complementary", { name: "Search filters" });
  await expect(
    filters.getByRole("checkbox", { name: /Estonia/ }),
  ).toBeVisible();
  await filters.getByRole("checkbox", { name: /Estonia/ }).check();
  await expect(page).toHaveURL(/country=/);
  await filters.getByRole("checkbox", { name: /Estonia/ }).uncheck();
  await expect(page).not.toHaveURL(/country=/);
  await filters.getByRole("button", { name: /reset search/i }).click();
  await expect(page).not.toHaveURL(/q=quartz/);
});

test("mobile search filters close with Escape and preserve navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ee/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("button", { name: "Toggle navigation drawer" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Menüü", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Site navigation" })
    .getByRole("link", { name: "Pealeht", exact: true })
    .click();
  await expect(page).toHaveURL(/\/ee$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("editing a filter returns to page one and clears quick-search sorting", async ({
  page,
}) => {
  await page.goto("/search?q=quartz&page=2&sort_by=unitid&sort_desc=true");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const input = page.locator(".search-drawer-text-field input").first();
  await input.fill("calcite");
  await expect(page).toHaveURL(/q=calcite/);
  await expect
    .poll(() => new URL(page.url()).searchParams.get("page"))
    .toBe("1");
  await expect(page).not.toHaveURL(/sort_by|sort_desc/);
  await page.reload();
  await expect(input).toHaveValue("calcite");
});

test("desktop search filters stop before the footer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const filters = page.getByRole("complementary", { name: "Search filters" });
  const footer = page.getByRole("contentinfo");
  await expect(filters).toBeVisible();
  await expect(page.locator("#table")).toContainText("DEMO-1");
  await footer.scrollIntoViewIfNeeded();
  await expect(async () => {
    const panelBounds = await filters.boundingBox();
    const footerBounds = await footer.boundingBox();
    expect(panelBounds).not.toBeNull();
    expect(footerBounds).not.toBeNull();
    expect(panelBounds!.y + panelBounds!.height).toBeLessThanOrEqual(
      footerBounds!.y + 1,
    );
  }).toPass();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(async () => {
    expect((await filters.boundingBox())!.y).toBeCloseTo(64, 0);
  }).toPass();
});

test("filter map fills its container after opening and resizing", async ({
  page,
}) => {
  await page.route("https://services.arcgisonline.com/**", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#dae5d0"/></svg>',
    }),
  );
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const region = page.getByRole("region", { name: "Map", exact: true });
  const toggle = region.getByRole("button", { name: /hide map|show map/i });
  const map = region.locator("#search-map");
  await expect(map).toBeVisible();
  const expectTilesToFillMap = async () => {
    await expect(async () => {
      const covered = await map.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const tiles = Array.from(
          element.querySelectorAll<HTMLImageElement>(".leaflet-tile-loaded"),
        )
          .filter((tile) => tile.complete && tile.naturalWidth > 0)
          .map((tile) => tile.getBoundingClientRect());
        return [10, bounds.width - 10].every((x) =>
          [10, bounds.height - 10].every((y) =>
            tiles.some(
              (tile) =>
                tile.left <= bounds.left + x &&
                tile.right >= bounds.left + x &&
                tile.top <= bounds.top + y &&
                tile.bottom >= bounds.top + y,
            ),
          ),
        );
      });
      expect(covered).toBe(true);
    }).toPass();
  };
  await expectTilesToFillMap();
  await toggle.click();
  await toggle.click();
  await expectTilesToFillMap();
  await region.getByRole("button", { name: "Expand map", exact: true }).click();
  await expect(map).toHaveCSS("height", "468px");
  await expectTilesToFillMap();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expectTilesToFillMap();
});

test("images tab automatically searches for records with images", async ({
  page,
}) => {
  await page.route("**/api?**", async (route) => {
    const url = new URL(route.request().url());
    if (
      url.searchParams.get("wt") === "csv" ||
      url.searchParams.get("rows") === "0"
    )
      return route.fallback();
    const hasImageFilter = url.searchParams
      .getAll("fq")
      .includes("has_image:true");
    await route.fulfill({
      json: {
        response: {
          numFound: hasImageFilter ? 1 : 75,
          docs: hasImageFilter
            ? [specimen]
            : [{ ...specimen, images: [], has_image: false }],
        },
        facet_counts: { facet_fields: {} },
      },
    });
  });
  await page.goto("/search?q=quartz&page=2&country=%22Estonia%22");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("tab", { name: /images/i }).click();
  await expect(page).toHaveURL(/has_image=true/);
  await expect(page).toHaveURL(/page=1/);
  const images = page.getByRole("tabpanel", { name: /images/i });
  await expect(
    images.getByRole("button", { name: /^open gallery:/i }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.get("q")).toBe("quartz");
  expect(new URL(page.url()).searchParams.get("country")).toBe('"Estonia"');
  await expect(images.getByRole("button", { name: /add filter/i })).toHaveCount(
    0,
  );
  await expect(
    page.getByText("Only results with images are shown in this view."),
  ).toBeVisible();
  await page.getByRole("tab", { name: /table/i }).click();
  await expect(page).not.toHaveURL(/has_image=/);
  await expect(
    page.getByText("Only results with images are shown in this view."),
  ).toHaveCount(0);
  expect(new URL(page.url()).searchParams.get("q")).toBe("quartz");
  expect(new URL(page.url()).searchParams.get("country")).toBe('"Estonia"');
});

test("images tab preserves an explicitly selected image filter", async ({
  page,
}) => {
  await page.goto("/search?q=quartz&has_image=true");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("tab", { name: /images/i }).click();
  await page.getByRole("tab", { name: /table/i }).click();
  await expect(page).toHaveURL(/has_image=true/);
});

test("search combines the map with table previews and image view", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  const map = page.getByRole("region", { name: "Map", exact: true });
  await expect(map.locator(".leaflet-container")).toBeVisible();
  const table = page.getByRole("tabpanel", { name: /table/i });
  await table
    .getByRole("button", { name: "Open gallery: DEMO-1", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("Image gallery");
  await expect(page).not.toHaveURL(/has_image=/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(table).toBeVisible();
  await page.getByRole("tab", { name: /images/i }).click();
  await expect(map.locator(".leaflet-container")).toBeVisible();
  await map.getByRole("button", { name: "Hide map", exact: true }).click();
  await expect(map.locator(".leaflet-container")).not.toBeVisible();
  await page.getByRole("tab", { name: /table/i }).click();
  await expect(page).not.toHaveURL(/has_image=/);
  await page.setViewportSize({ width: 390, height: 844 });
  await map.getByRole("button", { name: "Show map", exact: true }).click();
  await expect(map.locator(".leaflet-container")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});


for (const locale of ["", "/ee"]) {
  test(`map marker opens the specimen detail in ${locale || "English"}`, async ({ page }) => {
    await page.goto(`${locale}/search?q=quartz`);
    await page.getByRole("button", { name: "OK", exact: true }).click();
    const marker = page.locator("#search-map .leaflet-marker-icon").first();
    await expect(marker).toBeVisible();
    await marker.click();
    await expect(page).toHaveURL(new RegExp(`${locale}/specimen/demo`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quartz");
  });
}
