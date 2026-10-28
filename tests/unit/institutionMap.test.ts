// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  getCollectionLocations,
  getInstitutionCountryMarkers,
  institutionCountrySearchQuery,
  buildInstitutionPopupContent,
  getInstitutionMarkerCoordinates,
} from "@/utils/institutionMap";

describe("institution map popup content", () => {
  it("includes the institution name and a link to the detail page", () => {
    const institution = {
      id: "cetaf",
      name: "CETAF General Secretariat",
      coordinates: [4.35, 50.85],
    };

    const { popupContent, link } = buildInstitutionPopupContent({
      institution,
      localePath: (path) => path,
      detailLabel: "View details",
    });

    expect(popupContent.textContent).toContain("CETAF General Secretariat");
    expect(link.getAttribute("href")).toBe("/institution/cetaf");
    expect(link.textContent).toBe("View details");
  });

  it("offsets duplicate institution coordinates so markers stay individually clickable", () => {
    const institutions = [
      { id: "a", name: "A", coordinates: [4.35, 50.85] },
      { id: "b", name: "B", coordinates: [4.35, 50.85] },
      { id: "c", name: "C", coordinates: [4.35, 50.85] },
    ];

    const positioned = getInstitutionMarkerCoordinates(institutions);

    expect(positioned[0].markerCoordinates).not.toEqual(
      positioned[1].markerCoordinates,
    );
    expect(positioned[1].markerCoordinates).not.toEqual(
      positioned[2].markerCoordinates,
    );
    expect(positioned[0].markerCoordinates[0]).not.toBe(4.35);
    expect(positioned[0].markerCoordinates[1]).not.toBe(50.85);
  });
});

describe("institution map localized detail links", () => {
  it.each(["", "/ee", "/de"])(
    "preserves locale %s in the popup detail link",
    (locale) => {
      const { link } = buildInstitutionPopupContent({
        institution: { id: "cetaf", name: "CETAF General Secretariat" },
        localePath: (path) => `${locale}${path}`,
        detailLabel: "Vaata detaile",
      });

      expect(link.getAttribute("href")).toBe(`${locale}/institution/cetaf`);
      expect(link.textContent).toBe("Vaata detaile");
      expect(link.tabIndex).toBe(0);
    },
  );
});

describe("institution collection locations", () => {
  it("retains all locations without grouping or truncating them", () => {
    const points = Array.from({ length: 5001 }, (_, index) => ({
      latitude: index / 1000,
      longitude: 24,
      count: index + 1,
    }));
    expect(getCollectionLocations(points)).toEqual(points);
  });
  it("accepts numeric coordinates and zero while excluding missing and invalid values", () => {
    expect(
      getCollectionLocations([
        { latitude: 0, longitude: 0, count: 2 },
        { latitude: "59.2", longitude: "24.3", count: 3 },
        { latitude: null, longitude: 20, count: 1 },
        { latitude: "", longitude: 20, count: 1 },
        { latitude: 91, longitude: 20, count: 1 },
        { latitude: 59, longitude: 181, count: 1 },
        { latitude: NaN, longitude: 20, count: 1 },
      ]),
    ).toEqual([
      { latitude: 0, longitude: 0, count: 2 },
      { latitude: 59.2, longitude: 24.3, count: 3 },
    ]);
  });
});

describe("institution country circles", () => {
  it("uses fixed country centers and preserves institution-specific counts", () => {
    expect(
      getInstitutionCountryMarkers([
        { country: "Estonia", count: 123 },
        { country: "Finland", count: 42 },
        { country: "Unknown", count: 1 },
      ]),
    ).toEqual([
      { country: "Estonia", count: 123, latitude: 59, longitude: 26 },
      { country: "Finland", count: 42, latitude: 64, longitude: 26 },
    ]);
  });
  it("links directly to the exact institution and country on the first search page", () => {
    expect(
      institutionCountrySearchQuery(
        "Department of Geology, TalTech",
        "Estonia",
      ),
    ).toEqual({
      datasetowner: '"Department of Geology, TalTech"',
      country: '"Estonia"',
      page: "1",
    });
  });
});
