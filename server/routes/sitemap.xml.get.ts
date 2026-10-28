const pages = [
  "",
  "/search",
  "/about",
  "/access",
  "/tutorial",
  "/efg",
  "/institution",
  "/dataset",
  "/help",
  "/links",
];
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const [institutions, datasets] = await Promise.all([
    loadInstitutionCatalog(config.institutionCatalogUrl),
    loadDatasetCatalog(config.datasetCatalogUrl),
  ]);
  const paths = [...pages, ...institutions.map((item) => `/institution/${encodeURIComponent(item.id)}`), ...datasets.map((item) => `/dataset/${encodeURIComponent(item.dataset_guid)}`)];
  setResponseHeader(event, "Content-Type", "application/xml; charset=utf-8");
  const urls = ["", "/ee", "/de"].flatMap((locale) =>
    paths.map(
      (page) =>
        `<url><loc>https://geocase.eu${locale}${page || "/"}</loc></url>`,
    ),
  );
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`;
});
