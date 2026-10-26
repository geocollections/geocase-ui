import { createServer } from "node:http";
const server = createServer((request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (url.pathname === "/dcat/institutions.json") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ data: [
      { institution_id: 1, institution_guid: "20a8ff79-c977-11f1-a7eb-269714084253", cetaf_id: "ee-ttu", organisation_name: "TalTech", description: "Geological collections at TalTech.", country: "Estonia", latitude: 59.3953, longitude: 24.6712, website_url: "https://taltech.ee" },
      { institution_id: 2, institution_guid: "6119946d-c979-11f1-a7eb-269714084253", cetaf_id: "cetaf", organisation_name: "Consortium of European Taxonomic Facilities", description: "European natural history collections network.", country: "Belgium", latitude: 50.8366, longitude: 4.3768, website_url: "https://cetaf.org" },
    ] }));
    return;
  }
  if (url.pathname === "/dcat/datasets.json") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ data: [
      { dataset_id: 1, dataset_guid: "8fa26a2c-c99d-11f1-a7eb-269714084253", institution_id: 1, title: "TalTech geological collections", description: "Fossils and minerals", is_active: 1, is_published_geocase: 1 },
      { dataset_id: 2, dataset_guid: "58221cb2-ca04-11f1-a7eb-269714084253", institution_id: 2, title: "Other institution dataset", is_active: 1, is_published_geocase: 1 },
    ] }));
    return;
  }
  response.writeHead(Number(url.searchParams.get("status")) || 200, {
    "content-type": "application/json",
  });
  response.end(
    JSON.stringify({
      path: url.pathname,
      query: url.search,
      params: [...url.searchParams],
    }),
  );
});
server.listen(3101, "127.0.0.1");
process.on("SIGTERM", () => server.close());
