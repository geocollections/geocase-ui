import { quoteFilterValue } from "./sourceFilters";
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
  headerUrl?: string;
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
    headerUrl: datasetWebUrl(row.header_url),
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
export function institutionCollectionSearchQuery(urls: string[], country?: string, owners: string[] = []) {
  const names = [...new Set(owners)].filter(Boolean).map(quoteFilterValue);
  return {
    ...(urls.length ? { datasourceurl__equals: urls.length === 1 ? urls[0]! : urls } : {}),
    ...(names.length ? { datasetowner: names.length === 1 ? names[0]! : `(${names.join(" OR ")})` } : {}),
    ...(country ? { country: quoteFilterValue(country) } : {}),
    page: "1",
  };
}

/** Match catalog organisation names to real index owners, allowing word-order and punctuation differences. */
export function resolveInstitutionOwners(candidates: string[], labels: string[]): string[] {
  const names = new Set(labels.filter(Boolean).map(institutionNameKey));
  const owners = [...new Set(candidates.filter(Boolean))];
  const matched = owners.filter((owner) => names.has(institutionNameKey(owner)));
  if (matched.length) return matched;
  const expanded = owners.filter((owner) => labels.some((label) => institutionOwnerMatchesLabel(owner, label)));
  return expanded.length === 1 ? expanded : owners.length === 1 ? owners : [];
}

export function institutionOwnerMatchesLabel(owner: string, label: string): boolean {
  const words = institutionNameKey(label).split(" ").filter(Boolean);
  const ownerWords = new Set(institutionNameKey(owner).split(" "));
  return words.length > 0 && words.every((word) => ownerWords.has(word));
}

export function institutionNameKey(value: string): string {
  return (value.toLocaleLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").match(/[\p{L}\p{N}]+/gu) ?? []).sort().join(" ");
}
