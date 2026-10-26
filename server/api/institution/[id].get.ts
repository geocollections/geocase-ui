import { findCatalogInstitution, institutionDatasets, institutionSourceUrls } from "../../../app/utils/institutionCatalog";
import { loadInstitutionCollection } from "../../../app/services/institutionCollection";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const institutions = await loadInstitutionCatalog(config.institutionCatalogUrl);
  const institution = findCatalogInstitution(institutions, getRouterParam(event, "id") ?? "");
  if (!institution) throw createError({ statusCode: 404 });
  const datasets = await loadDatasetCatalog(config.datasetCatalogUrl);
  const sources = institutionSourceUrls(institutionDatasets(datasets, institution.institution_id));
  return loadInstitutionCollection(sources, `${config.apiBase.replace(/\/$/, "")}/v1/solr`, $fetch);
});
