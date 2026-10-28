import { institutionProfiles } from "@/institutionProfiles";

const DATASET_PIVOT = "datasourceurl,datasetowner,recordbasis";

export type Dataset = {
  url: string;
  count: number;
  owners: { name: string; count: number; institutionId: string | null }[];
  specimenTypes: string[];
};

type FacetNode = {
  value: string;
  count: number;
  pivot?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isFacetNode(value: unknown): value is FacetNode {
  return (
    isRecord(value) &&
    typeof value.value === "string" &&
    typeof value.count === "number"
  );
}

export function parseDatasetsResponse(response: unknown): Dataset[] {
  const facetCounts = isRecord(response) ? response.facet_counts : undefined;
  const facetPivot = isRecord(facetCounts) ? facetCounts.facet_pivot : undefined;
  const datasets = isRecord(facetPivot) ? facetPivot[DATASET_PIVOT] : undefined;

  if (!Array.isArray(datasets)) {
    throw new Error("The Solr response is missing dataset facet data");
  }

  return datasets.flatMap((value): Dataset[] => {
    if (!isFacetNode(value) || !value.value || value.count <= 0) {
      return [];
    }
    const item = value;

    const owners = (Array.isArray(item.pivot) ? item.pivot : [])
      .filter((owner): owner is FacetNode => isFacetNode(owner) && owner.count > 0)
      .map((owner) => ({
        name: owner.value,
        count: owner.count,
        institutionId:
          Object.entries(institutionProfiles).find(
            ([, profile]) => profile.datasetOwner === owner.value,
          )?.[0] ?? null,
      }));

    const specimenTypes = [
      ...new Set(
        (Array.isArray(item.pivot) ? item.pivot : []).flatMap((owner) =>
          isFacetNode(owner) && Array.isArray(owner.pivot)
            ? owner.pivot
              .filter((type): type is FacetNode => isFacetNode(type) && type.count > 0)
              .map((type) => type.value)
            : [],
        ),
      ),
    ];

    return [{
      url: item.value,
      count: item.count,
      owners,
      specimenTypes,
    }];
  });
}
