import { institutionProfiles } from "../../app/institutionProfiles";

type Pivot = { value: string | null; count: number; pivot?: Pivot[] };
type FacetResponse = { facet_counts?: { facet_pivot?: Record<string, Pivot[]> } };

export default defineEventHandler(async (event) => {
  const base = `${useRuntimeConfig(event).apiBase.replace(/\/$/, "")}/v1/solr`;
  const field = "datasourceurl,datasetowner,recordbasis";
  const response = await $fetch<FacetResponse>(base, {
    query: { q: "*:*", rows: 0, facet: "on", "facet.pivot": field, "facet.limit": -1, "facet.mincount": 1 },
  });
  return (response.facet_counts?.facet_pivot?.[field] ?? [])
    .filter((dataset) => dataset.value && dataset.count > 0)
    .map((dataset) => ({
      url: dataset.value!,
      count: dataset.count,
      owners: (dataset.pivot ?? []).filter((owner) => owner.value && owner.count > 0).map((owner) => ({
        name: owner.value!,
        count: owner.count,
        institutionId: Object.entries(institutionProfiles).find(([, profile]) => profile.datasetOwner === owner.value)?.[0] ?? null,
      })),
      specimenTypes: [...new Set((dataset.pivot ?? []).flatMap((owner) =>
        (owner.pivot ?? []).filter((type) => type.value && type.count > 0).map((type) => type.value!),
      ))],
    }));
});
