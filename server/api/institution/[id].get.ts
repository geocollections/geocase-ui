import { institutionProfiles } from "../../../app/institutionProfiles";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") ?? "";
  if (!Object.hasOwn(institutionProfiles, id))
    throw createError({ statusCode: 404 });
  const owner = institutionProfiles[id]!.datasetOwner;
  if (!owner) return { points: [], countries: [], images: [], total: 0 };
  const base = `${useRuntimeConfig(event).apiBase.replace(/\/$/, "")}/v1/solr`;
  const fq = `datasetowner:"${owner.replace(/["\\]/g, "\\$&")}"`;
  type Response = {
    response: { numFound: number; docs: Record<string, any>[] };
    facet_counts?: {
      facet_fields?: { country?: (string | number)[] };
      facet_pivot?: {
        "latitude,longitude"?: {
          value: number;
          pivot?: { value: number; count: number }[];
        }[];
      };
    };
  };
  const [coordinateResult, countryResult, imageResult] = await Promise.allSettled([
    $fetch<Response>(base, {
      query: {
        q: "*",
        fq,
        rows: 0,
        facet: "on",
        "facet.pivot": "latitude,longitude",
        "facet.limit": -1,
        "facet.mincount": 1,
      },
      timeout: 15000,
      retry: 0,
    }),
    $fetch<Response>(base, {
      query: {
        q: "*",
        fq,
        rows: 0,
        facet: "on",
        "facet.field": "country",
        "facet.limit": -1,
        "facet.mincount": 1,
      },
      timeout: 15000,
      retry: 0,
    }),
    $fetch<Response>(base, {
      query: { q: "*", fq: [fq, "images:*"], rows: 0 },
      timeout: 15000,
      retry: 0,
    }),
  ]);
  const empty: Response = { response: { numFound: 0, docs: [] } };
  const locations =
    coordinateResult.status === "fulfilled" ? coordinateResult.value : empty;
  const imageCount =
    imageResult.status === "fulfilled" ? imageResult.value : empty;
  const facets =
    locations.facet_counts?.facet_pivot?.["latitude,longitude"] ?? [];
  const points: { latitude: number; longitude: number; count: number }[] = [];
  for (const facet of facets) {
    for (const child of facet.pivot ?? []) {
      const latitude = facet.value;
      const longitude = child.value;
      if (
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180
      )
        points.push({ latitude, longitude, count: child.count });
    }
  }
  const countryData = countryResult.status === "fulfilled" ? countryResult.value : empty;
  const countryFacets = countryData.facet_counts?.facet_fields?.country ?? [];
  const countries: { country: string; count: number }[] = [];
  for (let index = 0; index < countryFacets.length; index += 2) {
    const country = countryFacets[index];
    const count = Number(countryFacets[index + 1]);
    if (
      typeof country === "string" &&
      country.trim() &&
      Number.isFinite(count) &&
      count > 0
    )
      countries.push({ country, count });
  }
  const count = imageCount.response.numFound;
  let imagesUnavailable = imageResult.status === "rejected";
  const docs = count
    ? (
        await $fetch<Response>(base, {
          query: {
            q: "*",
            fq: [fq, "images:*"],
            rows: 100,
            start: Math.floor(Math.random() * Math.max(1, count - 99)),
          },
          timeout: 15000,
          retry: 0,
        }).catch(() => {
          imagesUnavailable = true;
          return empty;
        })
      ).response.docs
    : [];
  // Shuffle a bounded sample, then select one image per specimen.
  for (let i = docs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [docs[i], docs[j]] = [docs[j]!, docs[i]!];
  }
  const validDocs = docs.map(
    (doc): Record<string, any> & { images: string[] } => ({
      ...doc,
      images: Array.isArray(doc.images)
        ? doc.images.filter(
            (url: unknown): url is string =>
              typeof url === "string" &&
              /^https?:\/\//i.test(url) &&
              !/placeholder/i.test(url),
          )
        : [],
    }),
  );
  // Do not gate the entire gallery on a remote thumbnail or placeholder probe.
  // Original HTTPS images load in the browser; thumbnails provide a fallback.
  const images = validDocs
    .filter((doc) => doc.geocase_id && doc.images.length)
    .filter(
      (doc, index, docs) =>
        docs.findIndex((other) => other.geocase_id === doc.geocase_id) ===
        index,
    )
    .slice(0, 12)
    .map((doc) => {
      const url = doc.images[0]!;
      return {
        id: String(doc.geocase_id),
        url,
        previewUrl: url.replace(/^http:/i, "https:"),
        fallbackUrl: "https://geocase.eu/thumbnails/" + encodeURIComponent(url),
        title: doc.fullscientificname || doc.unitid || doc.locality || owner,
        locality: doc.locality,
        author: doc.image_author,
        license: doc.image_license,
      };
    });
  return {
    points,
    countries,
    images,
    total: countryData.response.numFound,
    locationsUnavailable: countryResult.status === "rejected",
    coordinatesUnavailable: coordinateResult.status === "rejected",
    imagesUnavailable,
  };
});
