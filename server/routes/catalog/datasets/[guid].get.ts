import { findCatalogDataset, isDatasetIdentifier, type CatalogDataset } from "../../../../app/utils/datasetCatalog";

export default defineEventHandler(async (event): Promise<CatalogDataset> => {
  const guid = getRouterParam(event, "guid") ?? "";
  if (!isDatasetIdentifier(guid)) {
    throw createError({ statusCode: 404, statusMessage: "Dataset not found" });
  }
  let datasets: CatalogDataset[];
  try {
    datasets = await loadDatasetCatalog(useRuntimeConfig(event).datasetCatalogUrl);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Dataset catalog unavailable" });
  }
  const dataset = findCatalogDataset(datasets, guid);
  if (!dataset) throw createError({ statusCode: 404, statusMessage: "Dataset not found" });
  return dataset;
});
