import { parseDatasetCatalog, type CatalogDataset } from "../../app/utils/datasetCatalog";

export const loadDatasetCatalog = defineCachedFunction(async (url: string): Promise<CatalogDataset[]> => {
  const response: unknown = await $fetch<unknown>(url, { responseType: "json", timeout: 15000, retry: 1 });
  return parseDatasetCatalog(response);
}, { name: "dataset-catalog", maxAge: 300 });
