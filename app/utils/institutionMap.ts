type InstitutionLike = {
  id: string;
  name: string;
  coordinates?: readonly [number, number];
};

export function getInstitutionMarkerCoordinates<T extends InstitutionLike>(institutions: readonly T[]) {
  const countsByCoordinates = new Map<string, number>();

  for (const institution of institutions) {
    const coordinates = institution.coordinates ?? [0, 0] as [number, number];
    const key = coordinates.join(",");
    countsByCoordinates.set(key, (countsByCoordinates.get(key) ?? 0) + 1);
  }

  return institutions.map((institution) => {
    const coordinates = institution.coordinates ?? [0, 0] as [number, number];
    const key = coordinates.join(",");
    const duplicateCount = countsByCoordinates.get(key) ?? 1;

    if (duplicateCount === 1) {
      return { ...institution, markerCoordinates: coordinates };
    }

    const groupIndex = institutions.filter((item) => (item.coordinates ?? [0, 0]).join(",") === key).findIndex((item) => item.id === institution.id);
    const angle = (((groupIndex + 1) / duplicateCount) * Math.PI * 2) % (Math.PI * 2);
    const radius = 0.16 + groupIndex * 0.08;
    const [lng, lat] = coordinates;

    return {
      ...institution,
      markerCoordinates: [lng + Math.cos(angle) * radius, lat + Math.sin(angle) * radius] as [number, number],
    };
  });
}

export function buildInstitutionPopupContent({
  institution,
  localePath,
  detailLabel,
}: {
  institution: InstitutionLike;
  localePath: (path: string) => string;
  detailLabel: string;
}) {
  const popupContent = document.createElement("div");

  const name = document.createElement("strong");
  name.className = "institution-popup-name";
  name.textContent = institution.name;

  const link = document.createElement("a");
  link.className = "institution-popup-link";
  link.href = localePath(`/institution/${institution.id}`);
  link.textContent = detailLabel;

  popupContent.append(name, link);

  return { popupContent, link };
}
