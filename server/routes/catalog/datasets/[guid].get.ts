import type { CatalogDataset } from "../../../../app/utils/datasetCatalog";

export default defineEventHandler(async (event): Promise<CatalogDataset> => {
  const guid = getRouterParam(event, "guid") ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guid)) {
    throw createError({ statusCode: 404, statusMessage: "Dataset not found" });
  }
  let datasets: CatalogDataset[];
  try {
    datasets = await loadDatasetCatalog(useRuntimeConfig(event).datasetCatalogUrl);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Dataset catalog unavailable" });
  }
  const dataset = datasets.find((item) => item.dataset_guid.toLowerCase() === guid.toLowerCase());
  if (!dataset) throw createError({ statusCode: 404, statusMessage: "Dataset not found" });
  return dataset;
});
