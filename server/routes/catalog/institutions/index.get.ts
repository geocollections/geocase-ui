export default defineEventHandler(async (event) => {
  try {
    return await loadInstitutionCatalog(useRuntimeConfig(event).institutionCatalogUrl);
  } catch {
    throw createError({ statusCode: 502, statusMessage: "Institution catalog unavailable" });
  }
});
