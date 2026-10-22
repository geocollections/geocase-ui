export interface CatalogDataset {
  dataset_guid: string;
  title: string;
  source_id?: string | null;
  description?: string | null;
  organisation_name?: string | null;
  coverage?: string | null;
  spatial_label?: string | null;
  taxonomic_terms?: string | null;
  geoecological_terms?: string | null;
  citation?: string | null;
  license_text?: string | null;
  license_uri?: string | null;
  rights_statement?: string | null;
  landing_page_url?: string | null;
  access_rights_uri?: string | null;
}
export function datasetWebUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
export function parseDatasetCatalog(value: unknown): CatalogDataset[] {
  const data = (value as { data?: unknown } | null)?.data;
  if (!Array.isArray(data)) throw new Error("Invalid dataset catalog");
  return data.filter((row): row is CatalogDataset =>
    row !== null && typeof row === "object" &&
    typeof row.dataset_guid === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.dataset_guid) &&
    typeof row.title === "string" &&
    (row.is_active === 1 || row.is_active === true) &&
    (row.is_published === 1 || row.is_published === true),
  );
}
