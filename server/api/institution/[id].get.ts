import { institutionProfiles } from "../../../app/institutionProfiles";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id") ?? "";
  if (!Object.hasOwn(institutionProfiles, id)) throw createError({ statusCode: 404 });
  const owner = institutionProfiles[id]!.datasetOwner;
  if (!owner) return { points: [], images: [], total: 0 };
  const base = `${useRuntimeConfig(event).apiBase.replace(/\/$/, "")}/v1/solr`;
  const fq = `datasetowner:"${owner.replace(/["\\]/g, "\\$&")}"`;
  type Response = { response: { numFound: number; docs: Record<string, any>[] }; facet_counts?: { facet_pivot?: { "latitude,longitude"?: { value: number; pivot?: { value: number; count: number }[] }[] } } };
  const [locations, imageCount] = await Promise.all([
    $fetch<Response>(base, { query: { q: "*", fq, rows: 0, facet: "on", "facet.pivot": "latitude,longitude", "facet.limit": -1, "facet.mincount": 1 } }),
    $fetch<Response>(base, { query: { q: "*", fq: [fq, "images:*"], rows: 0 } }),
  ]);
  const facets = locations.facet_counts?.facet_pivot?.["latitude,longitude"] ?? [];
  const points: { latitude: number; longitude: number; count: number }[] = [];
  for (const facet of facets) {
    for (const child of facet.pivot ?? []) {
      const latitude = facet.value;
      const longitude = child.value;
      if (Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180)
        points.push({ latitude, longitude, count: child.count });
    }
  }
  const count = imageCount.response.numFound;
  const docs = count ? (await $fetch<Response>(base, { query: { q: "*", fq: [fq, "images:*"], rows: 100, start: Math.floor(Math.random() * Math.max(1, count - 99)) } })).response.docs : [];
  // Shuffle a bounded sample, then select one image per specimen.
  for (let i = docs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [docs[i], docs[j]] = [docs[j]!, docs[i]!];
  }
  const validDocs = docs.map((doc): Record<string, any> & { images: string[] } => ({
    ...doc,
    images: Array.isArray(doc.images)
      ? doc.images.filter((url: unknown): url is string => typeof url === "string" && /^https?:\/\//i.test(url) && !/placeholder/i.test(url))
      : [],
  }));
  // The thumbnail service returns a shared "image not found" PNG with HTTP 200.
  // Compare its bytes so a successful response cannot expose that placeholder.
  const thumbnailBase = "https://geocase.eu/thumbnails/";
  const fetchPreview = (url: string) => $fetch<ArrayBuffer>(url, { responseType: "arrayBuffer", timeout: 5000, retry: 0 });
  const missingPreview = validDocs.some((doc) => doc.geocase_id && doc.images.length) ? await fetchPreview(`${thumbnailBase}geocase-missing-preview`).catch(() => null) : null;
  const missingBytes = missingPreview ? new Uint8Array(missingPreview) : null;
  if (!missingBytes) return { points, images: [], total: locations.response.numFound };
  const candidates = validDocs.filter((doc) => doc.geocase_id && doc.images.length).slice(0, 24);
  const images: { id: string; url: string; previewUrl: string; title: string; locality?: string; author?: string; license?: string }[] = [];
  const seenIds = new Set<string>();
  for (let offset = 0; offset < candidates.length && images.length < 6; offset += 6) {
    const previews = await Promise.all(candidates.slice(offset, offset + 6).map(async (doc) => {
      for (const url of doc.images) {
        const previewUrl = thumbnailBase + encodeURIComponent(url);
        try {
          const bytes = new Uint8Array(await fetchPreview(previewUrl));
          if (!bytes.length || (missingBytes && bytes.length === missingBytes.length && bytes.every((byte, index) => byte === missingBytes[index]))) continue;
          return {
            id: String(doc.geocase_id), url, previewUrl,
            title: doc.fullscientificname || doc.unitid || doc.locality || owner,
            locality: doc.locality, author: doc.image_author, license: doc.image_license,
          };
        } catch {
          // Try another image from this specimen, then another specimen.
        }
      }
      return null;
    }));
    for (const image of previews) {
      if (!image || seenIds.has(image.id) || images.length === 6) continue;
      seenIds.add(image.id);
      images.push(image);
    }
  }
  return { points, images, total: locations.response.numFound };
});
