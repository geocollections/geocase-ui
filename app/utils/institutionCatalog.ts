import { datasetWebUrl, type CatalogDataset } from "./datasetCatalog";

export interface CatalogInstitution {
  id: string;
  institution_id: number;
  institution_guid: string;
  name: string;
  country: string;
  countryKey: string;
  description: string;
  url: string;
  address: string;
  logoUrl?: string;
  coordinates: [number, number] | null;
}
const aliases: Record<string, string> = {
  cetaf: "cetaf", "fi-fmnh-luomus": "finnish-museum-natural-history",
  "de-mfn": "museum-fuer-naturkunde-berlin", "uk-nms": "national-museums-scotland",
  "at-nhm": "natural-history-museum-vienna", "nl-naturalis": "naturalis-biodiversity-center",
  "de-smns": "natural-history-museum-stuttgart", "ee-ttu": "tallinn-university-of-technology",
};
const countries: Record<string, string> = { Belgium: "belgium", Germany: "germany", UK: "unitedKingdom", "United Kingdom": "unitedKingdom", Austria: "austria", Estonia: "estonia", Finland: "finland", Netherlands: "netherlands", "Czech Republic": "czechRepublic" };
export function parseInstitutionCatalog(value: unknown): CatalogInstitution[] {
  const rows = (value as { data?: unknown } | null)?.data;
  if (!Array.isArray(rows)) throw new Error("Invalid institution catalog");
  return rows.filter((row) => row && typeof row.organisation_name === "string" && typeof row.institution_guid === "string" && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(row.institution_guid) && Number.isInteger(row.institution_id)).map((row) => ({
    id: aliases[row.cetaf_id] ?? row.institution_guid,
    institution_id: row.institution_id,
    institution_guid: row.institution_guid,
    name: row.organisation_name,
    country: typeof row.country === "string" ? row.country : "",
    countryKey: countries[row.country] ?? "",
    description: typeof row.description === "string" ? row.description : "",
    url: datasetWebUrl(row.website_url) ?? "",
    address: typeof row.address === "string" ? row.address : "",
    logoUrl: datasetWebUrl(row.logo_url),
    coordinates: typeof row.longitude === "number" && typeof row.latitude === "number" && Number.isFinite(row.longitude) && Number.isFinite(row.latitude) && Math.abs(row.longitude) <= 180 && Math.abs(row.latitude) <= 90 ? [row.longitude, row.latitude] : null,
  }));
}
export function findCatalogInstitution(items: CatalogInstitution[], id: string) {
  return items.find((item) => item.id === id || item.institution_guid === id || String(item.institution_id) === id);
}

export function institutionDatasets(datasets: CatalogDataset[], institutionId: number) {
  return datasets.filter((item) => item.institution_id === institutionId || item.creator_institution_id === institutionId);
}
export function institutionSourceUrls(datasets: CatalogDataset[]) {
  return [...new Set(datasets.map((item) => item.provider_url).filter((url): url is string => !!datasetWebUrl(url)))];
}
export function institutionCollectionFilter(urls: string[]) {
  if (!urls.length) return "";
  const quoted = [...new Set(urls)].map((url) => `"${url.replace(/["\\]/g, "\\$&")}"`);
  return `datasourceurl:( ${quoted.join(" OR ")} )`;
}
export function institutionCollectionSearchQuery(urls: string[], country?: string) {
  return { q: institutionCollectionFilter(urls), ...(country ? { country: `"${country.replace(/["\\]/g, "\\$&")}"` } : {}), page: "1" };
}
