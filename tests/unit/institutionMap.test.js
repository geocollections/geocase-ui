// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { buildInstitutionPopupContent, getInstitutionMarkerCoordinates } from "@/utils/institutionMap";

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

    expect(positioned[0].markerCoordinates).not.toEqual(positioned[1].markerCoordinates);
    expect(positioned[1].markerCoordinates).not.toEqual(positioned[2].markerCoordinates);
    expect(positioned[0].markerCoordinates[0]).not.toBe(4.35);
    expect(positioned[0].markerCoordinates[1]).not.toBe(50.85);
  });
});

describe("institution map localized detail links", () => {
  it.each(["", "/ee", "/de"])("preserves locale %s in the popup detail link", (locale) => {
    const { link } = buildInstitutionPopupContent({
      institution: { id: "cetaf", name: "CETAF General Secretariat" },
      localePath: (path) => `${locale}${path}`,
      detailLabel: "Vaata detaile",
    });

    expect(link.getAttribute("href")).toBe(`${locale}/institution/cetaf`);
    expect(link.textContent).toBe("Vaata detaile");
    expect(link.tabIndex).toBe(0);
  });
});
