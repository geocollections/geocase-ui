export default defineEventHandler(async (event) => {
  try {
    return await loadDatasetCatalog(useRuntimeConfig(event).datasetCatalogUrl);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Dataset catalog unavailable" });
  }
});
