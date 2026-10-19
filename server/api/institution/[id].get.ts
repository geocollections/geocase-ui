import { institutionProfiles } from "../../../app/institutionProfiles";
import { loadInstitutionCollection } from "../../../app/services/institutionCollection";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") ?? "";
  if (!Object.hasOwn(institutionProfiles, id))
    throw createError({ statusCode: 404 });
  const owner = institutionProfiles[id]!.datasetOwner;
  const base = `${useRuntimeConfig(event).apiBase.replace(/\/$/, "")}/v1/solr`;
  return loadInstitutionCollection(owner, base, $fetch);
});
