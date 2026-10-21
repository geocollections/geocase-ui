import { test, expect } from "@playwright/test";
import { Buffer } from "node:buffer";
const specimen = {
  id: "1",
  geocase_id: "demo:1",
  unitid: "DEMO-1",
  collectioncode: "GEO",
  fullscientificname: "Quartz",
  recordbasis: "Mineral",
  kindofunit: "Pollen",
  parameter: "Geological age",
  lower_value: 400,
  upper_value: 450,
  unit_of_measurement: "My",
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
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
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
    if (url.searchParams.get("stats") === "true")
      return route.fulfill({
        json: {
          stats: {
            stats_fields: {
              latitude: {
                facets: {
                  country: { Estonia: { count: 75, mean: specimen.latitude } },
                },
              },
              longitude: {
                facets: {
                  country: { Estonia: { count: 75, mean: specimen.longitude } },
                },
              },
            },
          },
        },
      });
    if (url.searchParams.get("group.field") === "locality")
      return route.fulfill({
        json: {
          grouped: {
            locality: {
              groups: [
                {
                  groupValue: specimen.locality,
                  doclist: { numFound: 75, docs: [specimen] },
                },
              ],
            },
          },
        },
      });
    if (url.searchParams.has("group.func"))
      return route.fulfill({ json: { grouped: {
        [url.searchParams.get("group.func")!]: { groups: [
          { groupValue: "59.4,24.7", doclist: { numFound: 1, docs: [specimen] } },
        ] },
      } } });
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
            kindofunit: ["Pollen", 75],
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
  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitem", { name: "Eesti" }).click();
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
  await page.getByRole("button", { name: "Export", exact: true }).click();
  await page.getByRole("menuitem", { name: "Export this page" }).hover();
  const download = page.waitForEvent("download");
  await page.getByText("CSV", { exact: true }).click();
  expect((await download).suggestedFilename()).toBe("GeoCASe-page-1.csv");
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
  await page.getByRole("button", { name: "Language" }).click();
  await page.getByRole("menuitem", { name: "Deutsch" }).click();
  await expect(page).toHaveURL(/\/de\/specimen\/demo/);
  expect(errors).toEqual([]);
});
test("detail returns to the search and wraps long values on narrow screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("link", { name: "DEMO-1" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quartz");

  const row = page
    .getByRole("heading", { name: "Specimen details" })
    .locator("..")
    .locator("tbody tr")
    .first();
  await row.locator("td").evaluate((cell) => {
    cell.textContent =
      "A long specimen value with a URL: https://example.org/" +
      "metadata/".repeat(30);
  });
  const dimensions = await row.evaluate((element) => {
    const header = element.querySelector("th")!.getBoundingClientRect();
    const value = element.querySelector("td")!.getBoundingClientRect();
    return { headerBottom: header.bottom, valueTop: value.top };
  });
  expect(dimensions.valueTop).toBeGreaterThanOrEqual(dimensions.headerBottom);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);

  await page.getByRole("link", { name: "Back to search" }).click();
  await expect(page).toHaveURL(/\/search\?q=quartz/);

  await page.goto("/specimen/demo%3A1");
  await page.getByRole("link", { name: "Back to search" }).click();
  await expect(page).toHaveURL(/\/search\?q=quartz/);
});
test("localized about page and mobile navigation render without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ee/about");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Avasta Maa lugu geoteaduslike kogude kaudu.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Tutvu kogudega" }),
  ).toHaveAttribute("href", "/ee/search");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("button", { name: "Menüü", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Veebilehe navigatsioon", exact: true }),
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

test("localized tutorial content renders responsively without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ee/tutorial");

  await expect(page).toHaveTitle("GeoCASe kasutusjuhend | GeoCASe");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Avasta geoteaduslikke kogusid GeoCASe abil.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Kogust eksemplarini" }),
  ).toBeVisible();
  await expect(page.locator(".tutorial-step-card")).toHaveCount(5);
  await expect(page.locator(".tutorial-step-card img")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Ava otsing" })).toHaveAttribute(
    "href",
    "/ee/search",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
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
  const activateMap = page.getByRole("button", { name: "Click to activate the map" });
  await activateMap.scrollIntoViewIfNeeded();
  await expect(page.locator(".map-canvas")).toHaveClass(/map-inactive/);
  await activateMap.click();
  await expect(page.locator(".map-canvas")).not.toHaveClass(/map-inactive/);
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

test("Nuxt UI header keeps the brand visible and links to the resource page", async ({
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
  await header.getByRole("button", { name: "Menu", exact: true }).click();
  const menu = page.getByRole("dialog");
  await expect(
    menu.getByRole("link", { name: "Links", exact: true }),
  ).toHaveAttribute("href", "/links");
  await expect(menu.locator('a[target="_blank"]')).toHaveCount(0);
  await menu.getByRole("link", { name: "Links", exact: true }).click();
  await expect(page).toHaveURL(/\/links$/);
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("Nuxt UI filters select, clear and reset facets", async ({ page }) => {
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const filters = page.getByRole("complementary", { name: "Search filters" });
  await expect(
    filters.getByRole("checkbox", { name: /Estonia/ }),
  ).toBeVisible();
  await filters.getByRole("checkbox", { name: /Estonia/ }).focus();
  await page.keyboard.press("Space");
  await expect(page).toHaveURL(/country=/);
  await filters.getByRole("checkbox", { name: /Estonia/ }).focus();
  await page.keyboard.press("Space");
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
  await page.getByRole("button", { name: "Ava või sulge navigeerimismenüü" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name: "Menüü", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Veebilehe navigatsioon" })
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
    page.getByText(/This view applies the .* filter\./),
  ).toBeVisible();
  await page.getByRole("tab", { name: /table/i }).click();
  await expect(page).not.toHaveURL(/has_image=/);
  await expect(
    page.getByText(/This view applies the .* filter\./),
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
  test(`map marker opens the specimen detail in ${locale || "English"}`, async ({
    page,
  }) => {
    await page.goto(`${locale}/search?q=quartz`);
    await page.getByRole("button", { name: "OK", exact: true }).click();
    const countryMarker = page.locator(
      '#search-map .map-count-icon[title="Estonia: 75"]',
    );
    await expect(countryMarker).toBeVisible();
    const circle = await countryMarker.boundingBox();
    const number = await countryMarker.locator("span").boundingBox();
    expect(circle).not.toBeNull();
    expect(number).not.toBeNull();
    expect(Math.abs((circle!.x + circle!.width / 2) - (number!.x + number!.width / 2))).toBeLessThan(1);
    expect(Math.abs((circle!.y + circle!.height / 2) - (number!.y + number!.height / 2))).toBeLessThan(1);
    await countryMarker.click();
    await expect(page).toHaveURL(/country=/);
    const marker = page
      .locator("#search-map .leaflet-marker-icon:not(.map-count-icon)")
      .first();
    await expect(marker).toBeVisible();
    await marker.click();
    await expect(page).toHaveURL(new RegExp(`${locale}/specimen/demo`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quartz");
  });
}

test("shared coordinate marker opens a paginated record picker", async ({ page }) => {
  await page.route("**/api?**", async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.has("group.func")) {
      expect(url.searchParams.get("rows")).toBe("3000");
      return route.fulfill({ json: { grouped: {
        [url.searchParams.get("group.func")!]: { groups: [
          { groupValue: "59.4,24.7", doclist: { numFound: 21, docs: [specimen] } },
        ] },
      } } });
    }
    if (url.searchParams.getAll("fq").includes("latitude:59.4")) {
      const start = Number(url.searchParams.get("start"));
      return route.fulfill({ json: { response: { numFound: 21, docs:
        Array.from({ length: start === 0 ? 20 : 1 }, (_, index) => ({
          ...specimen, geocase_id: `demo:${start + index + 1}`, unitid: `DEMO-${start + index + 1}`,
        })),
      } } });
    }
    await route.fallback();
  });
  await page.goto('/ee/search?country=Estonia');
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const map = page.locator('#search-map');
  await expect(map.locator('.leaflet-marker-icon')).toHaveCount(1);
  await expect(map.locator('.map-count-icon')).toHaveCount(0);
  await map.scrollIntoViewIfNeeded();
  const point = await map.locator('.leaflet-marker-icon').boundingBox();
  expect(point).not.toBeNull();
  await page.mouse.move(point!.x + point!.width / 2, point!.y + point!.height / 2);
  for (let step = 0; step < 5; step += 1) {
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(350);
    if (await map.locator('.map-count-icon').count()) break;
  }
  const marker = map.locator('.map-count-icon');
  await expect(marker).toHaveText("21");
  await expect(marker).toBeInViewport();
  await marker.click();
  const popup = page.locator('.leaflet-popup-content');
  await expect(popup).toContainText("Tallinn (21)");
  await expect(popup.locator('a')).toHaveCount(20);
  await popup.getByRole('button', { name: 'Näita rohkem' }).click();
  await expect(popup.locator('a')).toHaveCount(21);
  await expect(popup.getByRole('button', { name: 'Näita rohkem' })).not.toBeVisible();
  await popup.locator('a').last().click();
  await expect(page).toHaveURL(/\/ee\/specimen\/demo(?::|%3A)21/);
});

for (const width of [390, 768]) {
  test(`search filters are selectable in the ${width}px drawer`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/search");
    await page.getByRole("button", { name: "OK", exact: true }).click();
    await page
      .getByRole("button", { name: "Toggle navigation drawer" })
      .click();
    const drawer = page.getByRole("dialog");
    const nameMatchMode = drawer.locator("details").filter({
      has: page.locator('[aria-label="Matching mode for Name"]'),
    });
    await nameMatchMode.locator("summary").click();
    await drawer
      .getByRole("combobox", { name: "Matching mode for Name", exact: true })
      .click();
    await page.getByRole("option", { name: "equals", exact: true }).click();
    await expect(drawer).toBeVisible();
    await drawer
      .getByRole("textbox", { name: "Name", exact: true })
      .fill("Quartz");
    await expect(page).toHaveURL(/fullscientificname__equals=Quartz/);
    await drawer.getByRole("checkbox", { name: /Estonia/ }).check();
    await expect(page).toHaveURL(/country=/);
    await expect(
      drawer.getByRole("checkbox", { name: /Estonia/ }),
    ).toBeChecked();
    await drawer
      .getByRole("button", { name: "Reset search", exact: true })
      .click();
    await expect(page).not.toHaveURL(/fullscientificname|country=/);
    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeVisible();
  });
}

test("material subtype and age filters survive reload and appear in specimen details", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/search?kindofunit=%22Pollen%22&age_min=400&age_max=450");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("button", { name: "Toggle navigation drawer" }).click();
  const drawer = page.getByRole("dialog");
  await expect(
    drawer.getByRole("button", { name: "Material type", exact: true }),
  ).toBeVisible();
  await expect(
    drawer.getByRole("button", { name: "Material subtype", exact: true }),
  ).toBeVisible();
  await expect(
    drawer.getByRole("checkbox", { name: "Pollen (75)" }),
  ).toBeChecked();
  await expect(
    drawer.getByRole("spinbutton", { name: "Minimum age" }),
  ).toHaveValue("400");
  await expect(
    drawer.getByRole("spinbutton", { name: "Maximum age" }),
  ).toHaveValue("450");
  await expect(
    drawer.getByRole("button", { name: "Provider country", exact: true }),
  ).toHaveCount(0);
  await expect(
    drawer.getByRole("combobox", { name: "Matching mode for Name" }),
  ).not.toBeVisible();
  await page.reload();
  await expect(page).toHaveURL(/age_min=400/);
  await page.getByRole("link", { name: "DEMO-1" }).click();
  await expect(page.getByText("400 – 450 My", { exact: true })).toBeVisible();
  await expect(page.getByText("Pollen", { exact: true })).toBeVisible();
});

test("institution gallery falls back to thumbnails and links to specimens", async ({
  page,
}) => {
  // This deployment serves the SPA at unrecognised API paths; the page must use /api.
  await page.route("**/api/institution/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html></html>",
    }),
  );
  await page.route("**/api?**", (route) => {
    const url = new URL(route.request().url());
    if (
      !url.searchParams
        .getAll("fq")
        .some((fq) => fq.includes("Department of Geology, TalTech"))
    )
      return route.fallback();
    return route.fulfill({
      json: {
        response: {
          numFound: 123,
          docs:
            url.searchParams.get("rows") === "0"
              ? []
              : [
                  {
                    geocase_id: "demo:1",
                    images: ["https://example.org/original.jpg"],
                    fullscientificname: "Quartz",
                    image_license: "CC BY 4.0",
                  },
                ],
        },
        facet_counts: {
          facet_fields: { country: ["Estonia", 123] },
          facet_pivot: {
            "latitude,longitude": [
              { value: 59.2, pivot: [{ value: 24.3, count: 2 }] },
            ],
          },
        },
      },
    });
  });
  await page.route("https://example.org/original.jpg", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await page.goto("/institution/tallinn-university-of-technology");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const image = page.getByRole("img", { name: "Quartz", exact: true });
  await image.scrollIntoViewIfNeeded();
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute(
    "src",
    "https://geocase.eu/thumbnails/https%3A%2F%2Fexample.org%2Foriginal.jpg",
  );
  await expect
    .poll(() =>
      image.evaluate((element: HTMLImageElement) => element.naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(
    page.locator('.leaflet-container[role="region"][data-country-markers]'),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Institution location: Tallinn University of Technology",
      exact: true,
    }),
  ).toBeVisible();
  const link = page.getByRole("link", {
    name: "Explore the collection",
    exact: true,
  });
  expect(
    new URL(
      await link.getAttribute("href"),
      "http://localhost",
    ).searchParams.get("datasetowner"),
  ).toBe('"Department of Geology, TalTech"');
  await image.click();
  await expect(page).toHaveURL(/specimen\/demo/);
});

test("institution location remains available without collection data", async ({
  page,
}) => {
  await page.goto("/institution/cetaf");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(
    page.getByRole("button", {
      name: "Institution location: CETAF General Secretariat",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "This partner currently has no dataset in GeoCASE, so no collection points are available.",
      { exact: true },
    ),
  ).toBeVisible();
});

test("institution country circles render after delayed data and open filtered search", async ({
  page,
}) => {
  let releaseData: () => void = () => {};
  const dataReady = new Promise<void>((resolve) => {
    releaseData = resolve;
  });
  await page.route("**/api/institution/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><html></html>",
    }),
  );
  await page.route("**/api?**", async (route) => {
    const url = new URL(route.request().url());
    if (
      !url.searchParams
        .getAll("fq")
        .some((fq) => fq.includes("Department of Geology, TalTech"))
    )
      return route.fallback();
    await dataReady;
    await route.fulfill({
      json: {
        response: {
          numFound: url.searchParams.getAll("fq").includes("images:*") ? 0 : 3,
          docs: [],
        },
        facet_counts: {
          facet_fields: { country: ["Estonia", 2, "Finland", 1] },
          facet_pivot: { "latitude,longitude": [] },
        },
      },
    });
  });
  await page.route("https://services.arcgisonline.com/**", (route) =>
    route.abort(),
  );
  await page.goto("/institution/tallinn-university-of-technology");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const map = page.locator(
    '.leaflet-container[role="region"][data-country-markers]',
  );
  await expect(map).toHaveAttribute("data-country-markers", "0");
  releaseData();
  await expect(map).toHaveAttribute("data-country-markers", "2");
  await expect(map.locator(".map-country-count")).toHaveCount(2);
  await expect(
    page.getByText(
      "This institution has specimens in GeoCASE, but their locality coordinates are missing, so they cannot be shown on the map.",
    ),
  ).toBeHidden();
  await expect(
    page.getByRole("button", {
      name: "Institution location: Tallinn University of Technology",
      exact: true,
    }),
  ).toBeVisible();
  // Both symbols must be clickable, including after recalculating zoom overlap.
  const homeMarker = map.locator(".institution-location-marker");
  const estoniaMarker = map.locator('.map-country-count[title="Estonia: 2"]');
  await homeMarker.click({ trial: true });
  await estoniaMarker.click({ trial: true });
  await map.getByRole("button", { name: "Zoom in", exact: true }).click();
  await homeMarker.click({ trial: true });
  await estoniaMarker.click();
  await expect(page).toHaveURL(/search/);
  const searchUrl = new URL(page.url());
  expect(searchUrl.searchParams.get("datasetowner")).toBe(
    '"Department of Geology, TalTech"',
  );
  expect(searchUrl.searchParams.get("country")).toBe('"Estonia"');
});

test("typing in one search field survives another field submitting", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/search");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("button", { name: "Toggle navigation drawer" }).click();
  const drawer = page.getByRole("dialog");
  const quick = drawer.getByRole("textbox", {
    name: "Quick search...",
    exact: true,
  });
  const name = drawer.getByRole("textbox", { name: "Name", exact: true });
  await quick.pressSequentially("fossil", { delay: 30 });
  // The quick-search debounce expires while the name is still being entered.
  await name.pressSequentially("Quartz", { delay: 70 });
  await expect(name).toHaveValue("Quartz");
  await expect(quick).toHaveValue("fossil");
  await expect
    .poll(() =>
      new URL(page.url()).searchParams.get("fullscientificname__contains"),
    )
    .toBe("Quartz");
  await expect
    .poll(() => new URL(page.url()).searchParams.get("q"))
    .toBe("fossil");
  await page.reload();
  await page.getByRole("button", { name: "Toggle navigation drawer" }).click();
  await expect(name).toHaveValue("Quartz");
  await expect(quick).toHaveValue("fossil");
});

test("image-only checkbox changes table results and can leave the image gallery", async ({
  page,
}) => {
  await page.route("**/api?**", async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("rows") === "0") return route.fallback();
    const onlyImages = url.searchParams.getAll("fq").includes("has_image:true");
    await route.fulfill({
      json: {
        response: {
          numFound: onlyImages ? 1 : 2,
          docs: onlyImages
            ? [specimen]
            : [
                specimen,
                {
                  ...specimen,
                  id: "2",
                  geocase_id: "no-image",
                  unitid: "NO-IMAGE",
                  has_image: false,
                  images: [],
                },
              ],
        },
        facet_counts: { facet_fields: {} },
      },
    });
  });
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/search?q=quartz");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(page.locator("#table")).toContainText("NO-IMAGE");
  await page.getByRole("button", { name: "Toggle navigation drawer" }).click();
  const drawer = page.getByRole("dialog");
  const checkbox = drawer.getByRole("checkbox", {
    name: "Show only records with images",
    exact: true,
  });
  await checkbox.check();
  await expect(page).toHaveURL(/has_image=true/);
  await expect(checkbox).toBeChecked();
  await expect(page.locator("#table")).not.toContainText("NO-IMAGE");
  await checkbox.uncheck();
  await expect(page).not.toHaveURL(/has_image=/);
  await expect(page.locator("#table")).toContainText("NO-IMAGE");
  await page.keyboard.press("Escape");
  await page.getByRole("tab", { name: /images/i }).click();
  await expect(page).toHaveURL(/has_image=true/);
  await page.getByRole("button", { name: "Toggle navigation drawer" }).click();
  await expect(checkbox).toBeChecked();
  await checkbox.uncheck();
  await expect(page).not.toHaveURL(/has_image=/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tab", { name: /table/i })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#table")).toContainText("NO-IMAGE");
  await expect(
    page.getByText(/This view applies the .* filter\./),
  ).toHaveCount(0);
  expect(new URL(page.url()).searchParams.get("q")).toBe("quartz");
  await page.getByRole("button", { name: "Toggle navigation drawer" }).click();
  await checkbox.check();
  await expect(page).toHaveURL(/has_image=true/);
});

for (const entry of ["search", "specimen"]) {
  test(`original images support zoom and pan from ${entry}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    if (entry === "specimen")
      await page.setViewportSize({ width: 390, height: 844 });
    await page.route(/https:\/\/example.org\/(quartz|other)\.jpg/, (route) =>
      route.fulfill({
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200"><rect width="1600" height="1200" fill="purple"/><circle cx="800" cy="600" r="300" fill="white"/></svg>',
      }),
    );
    await page.route("**/api?**", (route) => {
      const url = new URL(route.request().url());
      if (url.searchParams.get("rows") === "0") return route.fallback();
      return route.fulfill({
        json: {
          response: {
            numFound: 1,
            docs: [
              {
                ...specimen,
                image_author: "GeoCASe photographer",
                image_license: "CC BY 4.0",
                image_date: "2024-03-12",
                relatedResource: "https://example.org/source-record",
                collectorname: "Example collector",
                images: [
                  "https://example.org/quartz.jpg",
                  "https://example.org/other.jpg",
                ],
              },
            ],
          },
          facet_counts: { facet_fields: {} },
        },
      });
    });
    await page.goto(entry === "search" ? "/search?q=quartz" : "/specimen/demo");
    await page.getByRole("button", { name: "OK", exact: true }).click();
    if (entry === "search") {
      await page.getByRole("tab", { name: /images/i }).click();
      await page
        .getByRole("button", { name: /^open gallery:/i })
        .first()
        .click();
    } else {
      await page
        .getByRole("button", { name: "Zoom image", exact: true })
        .click();
    }
    const gallery = page.getByRole("dialog");
    const viewer = gallery.getByRole("region", {
      name: "Zoomable image",
      exact: true,
    });
    const image = viewer.locator("img");
    const information = gallery.getByRole("region", {
      name: "Image information",
      exact: true,
    });
    await expect(
      information.getByText("GeoCASe photographer", { exact: true }),
    ).toBeVisible();
    await expect(
      information.locator(":scope > dl").getByText("CC BY 4.0", { exact: true }),
    ).toBeVisible();
    await expect(
      information.getByText("2024-03-12", { exact: true }),
    ).toBeHidden();
    await information.getByText("More information", { exact: true }).click();
    await expect(
      information.getByText("2024-03-12", { exact: true }),
    ).toBeVisible();
    await expect(
      information.getByText("Test Museum", { exact: true }),
    ).toBeVisible();
    await expect(
      information.getByText("Tallinn", { exact: true }),
    ).toBeVisible();
    const actions = gallery.getByRole("navigation", { name: "Image links" });
    await expect(
      actions.getByRole("link", { name: "Source record" }),
    ).toHaveAttribute("href", "https://example.org/source-record");
    await expect(
      actions.getByRole("link", { name: "Link to image" }),
    ).toHaveAttribute("href", "https://example.org/quartz.jpg");
    expect((await actions.boundingBox())!.y).toBeLessThan(
      (await viewer.boundingBox())!.y,
    );
    expect(
      await gallery.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    await information.getByText("More information", { exact: true }).click();
    await expect(
      information.getByText("2024-03-12", { exact: true }),
    ).toBeHidden();
    await gallery.screenshot({ path: test.info().outputPath("gallery.png") });

    await expect(
      gallery.getByRole("button", { name: "Zoom in", exact: true }),
    ).toBeEnabled();
    await expect(image).toHaveAttribute(
      "src",
      "https://example.org/quartz.jpg",
    );
    const initial = await image.evaluate(
      (element) => element.getBoundingClientRect().width,
    );
    await gallery.getByRole("button", { name: "Zoom in", exact: true }).click();
    await expect
      .poll(() =>
        image.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(initial * 1.4);
    await gallery
      .getByRole("button", { name: "Original size", exact: true })
      .click();
    await expect
      .poll(() =>
        image.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeCloseTo(1600, 0);
    const before = await image.evaluate(
      (element) => element.getBoundingClientRect().x,
    );
    const box = await viewer.boundingBox();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      box!.x + box!.width / 2 + 40,
      box!.y + box!.height / 2 + 30,
      { steps: 4 },
    );
    await page.mouse.up();
    await expect
      .poll(() =>
        image.evaluate((element) => element.getBoundingClientRect().x),
      )
      .toBeGreaterThan(before);
    await gallery
      .getByRole("button", { name: "Fit to screen", exact: true })
      .click();
    await expect
      .poll(() =>
        image.evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeCloseTo(initial, 0);
    await expect(
      gallery.getByRole("button", { name: "Zoom out", exact: true }),
    ).toBeDisabled();
    await gallery.getByRole("button", { name: "Zoom in", exact: true }).click();
    await gallery
      .getByRole("button", { name: "Next image", exact: true })
      .click();
    await expect(image).toHaveAttribute("src", "https://example.org/other.jpg");
    await expect(
      gallery.getByRole("button", { name: "Zoom out", exact: true }),
    ).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(gallery).not.toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const [locale, title] of [
  ["", "Explore beyond GeoCASe."],
  ["/ee", "Avasta enamat kui GeoCASe."],
  ["/de", "Über GeoCASe hinaus entdecken."],
]) {
  test(`resource page has unique links and responsive localized content ${locale || "English"}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${locale}/links`);
    await page.getByRole("button", { name: "OK", exact: true }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: title, exact: true }),
    ).toBeVisible();
    const cards = page.locator("article .resource-card");
    await expect(cards).toHaveCount(15);
    const hrefs = await cards.evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    expect(new Set(hrefs).size).toBe(15);
    expect(hrefs).toContain("https://www.gbif.org/");
    expect(hrefs).toContain("https://api.geocase.eu/");
    expect(hrefs).toContain("https://github.com/geocollections/geocase-ui");
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute("target", "_blank");
      await expect(card).toHaveAttribute("rel", "noopener noreferrer");
    }
    await page.locator('article nav a[href="#standards"]').click();
    await expect(page).toHaveURL(/#standards$/);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    if (!locale)
      await page.screenshot({
        path: "test-results/links-desktop.png",
        fullPage: true,
      });
    expect(errors).toEqual([]);
  });
}

for (const width of [1100, 1440, 1920]) {
  test(`table columns stay aligned between image and imageless pages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.route("**/api?**", (route) => {
      const url = new URL(route.request().url());
      if (url.searchParams.get("rows") === "0" || url.searchParams.has("stats") || url.searchParams.has("group.field")) return route.fallback();
      const secondPage = Number(url.searchParams.get("start")) > 0;
      return route.fulfill({ json: { response: { numFound: 75, docs: [{ ...specimen, unitid: secondPage ? "NO-IMAGE" : "DEMO-1", images: secondPage ? [] : specimen.images, has_image: !secondPage }] } } });
    });
    await page.goto("/search?q=quartz");
    await page.getByRole("button", { name: "OK", exact: true }).click();
    const table = page.locator("#table");
    await expect(table.getByRole("columnheader", { name: "Images", exact: true })).toBeVisible();
    const positions = () => table.locator("thead th").evaluateAll((cells) => cells.map((cell) => ({ x: cell.getBoundingClientRect().x, width: cell.getBoundingClientRect().width })));
    const initial = await positions();
    await page.getByRole("button", { name: "Next page", exact: true }).first().click();
    await expect(table).toContainText("NO-IMAGE");
    await expect(table.getByRole("columnheader", { name: "Images", exact: true })).toHaveCount(0);
    expect(await positions()).toEqual(initial);
    await page.getByRole("button", { name: "Previous page", exact: true }).first().click();
    await expect(table).toContainText("DEMO-1");
    await expect(table.getByRole("columnheader", { name: "Images", exact: true })).toBeVisible();
    expect(await positions()).toEqual(initial);
  });
}

for (const [locale, skip] of [["", "Skip to main content"], ["/ee", "Liigu põhisisu juurde"], ["/de", "Zum Hauptinhalt springen"]]) {
  test(`keyboard skip link reaches main content in ${locale || "English"}`, async ({ page }) => {
    await page.goto(`${locale}/search?q=quartz`);
    await expect(page.locator(".skip-link")).toBeAttached();
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    await expect(page.getByRole("link", { name: skip, exact: true })).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector("#main-content")?.contains(document.activeElement))).toBe(true);
  });
}

test("keyboard search and gallery close restore focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const search = page.getByRole("search").getByRole("textbox");
  await search.focus();
  await search.fill("quartz");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/q=quartz/);
  const trigger = page.locator("#table").getByRole("button", { name: "Open gallery: DEMO-1", exact: true });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("map location list opens popup by keyboard and Escape returns focus", async ({ page }) => {
  await page.route("**/api?**", (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.has("group.func")) return route.fulfill({ json: { grouped: {
      [url.searchParams.get("group.func")!]: { groups: [{ groupValue: "59.4,24.7", doclist: { numFound: 21, docs: [specimen] } }] }
    } } });
    return route.fallback();
  });
  await page.goto("/ee/search?country=Estonia");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  const summary = page.locator("summary").filter({ hasText: "Kaardi asukohad" });
  await summary.focus();
  await page.keyboard.press("Enter");
  const location = summary.locator("..").getByRole("button", { name: /Ava asukoht:.*Tallinn/ });
  await location.focus();
  await page.keyboard.press("Enter");
  const popup = page.locator(".leaflet-popup");
  await expect(popup).toBeVisible();
  await expect(popup).toBeFocused();
  const markerBox = await page.locator("#search-map .leaflet-marker-icon").first().boundingBox();
  expect(markerBox!.width).toBeGreaterThanOrEqual(24);
  expect(markerBox!.height).toBeGreaterThanOrEqual(24);
  await expect(popup.getByRole("button", { name: "Sulge hüpikaken" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).not.toBeVisible();
  await expect(location).toBeFocused();
  const marker = page.locator("#search-map .leaflet-marker-icon").first();
  await marker.focus();
  await page.keyboard.press("Space");
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).not.toBeVisible();
  await expect(marker).toBeFocused();
});
