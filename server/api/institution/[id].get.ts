import { findCatalogInstitution, institutionDatasets, institutionSourceUrls } from "../../../app/utils/institutionCatalog";
import { loadInstitutionCollection } from "../../../app/services/institutionCollection";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const institutions = await loadInstitutionCatalog(config.institutionCatalogUrl);
  const institution = findCatalogInstitution(institutions, getRouterParam(event, "id") ?? "");
  if (!institution) throw createError({ statusCode: 404 });
  const datasets = await loadDatasetCatalog(config.datasetCatalogUrl);
  const related = institutionDatasets(datasets, institution.institution_id);
  const sources = institutionSourceUrls(related);
  const labels = [institution.name, ...related.map((item) => item.organisation_name)].filter((name): name is string => typeof name === "string" && !!name);
  return loadInstitutionCollection(sources, `${config.apiBase.replace(/\/$/, "")}/v1/solr`, $fetch, labels);
});
