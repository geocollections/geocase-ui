import { describe, expect, it } from "vitest";
import { parseInstitutionCatalog, findCatalogInstitution } from "../../app/utils/institutionCatalog";
const row = { institution_id: 1, institution_guid: "20a8ff79-c977-11f1-a7eb-269714084253", cetaf_id: "ee-ttu", organisation_name: "TalTech", country: "Estonia", latitude: 59.3953, longitude: 24.6712, description: "Geological collections", website_url: "https://taltech.ee" };
describe("institution catalog", () => {
  it("uses source descriptions and longitude-latitude coordinates while preserving existing links", () => {
    const items = parseInstitutionCatalog({ data: [row] });
    expect(items[0]).toMatchObject({ id: "tallinn-university-of-technology", coordinates: [24.6712, 59.3953], description: row.description });
    for (const id of ["1", row.institution_guid, "tallinn-university-of-technology"]) expect(findCatalogInstitution(items, id)).toBe(items[0]);
  });
  it("does not invent coordinates or accept unsafe website URLs", () => {
    expect(parseInstitutionCatalog({ data: [{ ...row, latitude: null, website_url: "javascript:alert(1)" }] })[0]).toMatchObject({ coordinates: null, url: "" });
    expect(parseInstitutionCatalog({ data: [{ ...row, latitude: 91 }] })[0]?.coordinates).toBeNull();
  });
  it("rejects invalid payloads and malformed identifiers", () => {
    expect(() => parseInstitutionCatalog({})).toThrow();
    expect(parseInstitutionCatalog({ data: [null, { ...row, institution_guid: "../bad" }] })).toEqual([]);
  });
});
