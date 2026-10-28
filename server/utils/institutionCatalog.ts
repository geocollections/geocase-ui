import { parseInstitutionCatalog, type CatalogInstitution } from "../../app/utils/institutionCatalog";

export const loadInstitutionCatalog = defineCachedFunction(async (url: string): Promise<CatalogInstitution[]> => {
  return parseInstitutionCatalog(await $fetch<unknown>(url, { responseType: "json", timeout: 15000, retry: 1 }));
}, { name: "institution-catalog-v2", maxAge: 300 });
