<script setup lang="ts">
import { LngLatBounds, Map, NavigationControl, Popup, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { useI18n } from "vue-i18n";
import { buildInstitutionPopupContent, getInstitutionMarkerCoordinates } from "@/utils/institutionMap";

const { localePath } = useAppNavigation();
const { t } = useI18n();

const props = defineProps<{
  institutions: readonly {
    id: string;
    name: string;
    url: string;
    coordinates: readonly [number, number];
  }[];
}>();

const container = ref<HTMLElement | null>(null);
let map: Map | undefined;
let resizeObserver: ResizeObserver | undefined;
const markerMap = new globalThis.Map<string, HTMLButtonElement>();

const syncMarkerState = (markerElement: HTMLButtonElement, active: boolean) => {
  markerElement.classList.toggle("is-active", active);

};

onMounted(() => {
  if (!container.value) return;
  setWorkerUrl(workerUrl);
  map = new Map({
    container: container.value,
    style: {
      version: 8,
      sources: {
        openstreetmap: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        },
      },
      layers: [{ id: "openstreetmap", type: "raster", source: "openstreetmap" }],
    },
    center: [10, 53],
    zoom: 3,
    minZoom: 2,
  });
  map.addControl(new NavigationControl({ showCompass: false }), "top-right");

  const bounds = new LngLatBounds();
  const positionedInstitutions = getInstitutionMarkerCoordinates(props.institutions);
  const popup = new Popup({ offset: [0, -12], closeOnClick: true, maxWidth: "300px", className: "institution-popup" });
  popup.on("close", () => {
    for (const markerElement of markerMap.values()) {
      syncMarkerState(markerElement, false);
    }
  });

  const updateMarkerPositions = () => {
    if (!container.value || !map) return;

    for (const institution of positionedInstitutions) {
      const markerElement = markerMap.get(institution.id) ?? container.value.querySelector<HTMLButtonElement>(`button[data-institution-id="${institution.id}"]`);
      if (!markerElement) continue;

      if (!markerMap.has(institution.id)) markerMap.set(institution.id, markerElement);

      const point = map.project(institution.markerCoordinates as [number, number]);
      markerElement.style.left = `${point.x}px`;
      markerElement.style.top = `${point.y}px`;

    }
  };

  for (const institution of positionedInstitutions) {
    const coordinates: [number, number] = [...institution.markerCoordinates];
    bounds.extend(coordinates);

    const markerElement = document.createElement("button");
    markerElement.type = "button";
    markerElement.tabIndex = 0;
    markerElement.dataset.institutionId = institution.id;
    markerElement.setAttribute("role", "button");
    markerElement.setAttribute("aria-label", institution.name);
    markerElement.setAttribute("title", institution.name);
    markerElement.className = "institution-marker tw:absolute tw:left-0 tw:top-0 tw:pointer-events-auto tw:block tw:size-[18px] tw:z-1 tw:-translate-x-1/2 tw:-translate-y-full tw:-rotate-45 tw:rounded-[50%_50%_50%_0] tw:border-2 tw:border-home-surface/90 tw:bg-linear-to-br tw:from-home-muted tw:to-home-ink tw:p-0 tw:overflow-visible tw:shadow-lg tw:shadow-home-ink/20 tw:ring-1 tw:ring-home-surface/60 tw:cursor-pointer tw:transition-all tw:duration-150 tw:ease-in-out tw:hover:ring-2 tw:hover:ring-home-surface/90 tw:hover:shadow-xl tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-link tw:[&.is-active]:size-[22px] tw:[&.is-active]:z-3 tw:[&.is-active]:scale-[1.14] tw:[&.is-active]:from-home-accent tw:[&.is-active]:to-geocase tw:[&.is-active]:ring-3 tw:[&.is-active]:ring-home-surface/90 tw:[&.is-active]:shadow-xl tw:[&.is-active]:shadow-home-focus/30";

    const markerDot = document.createElement("span");
    markerDot.className = "tw:absolute tw:inset-1 tw:block tw:rounded-full tw:bg-home-surface/90 tw:rotate-45";
    markerElement.appendChild(markerDot);
    markerMap.set(institution.id, markerElement);

    const { popupContent, link } = buildInstitutionPopupContent({
      institution,
      localePath,
      detailLabel: t("partnersPage.viewDetails"),
    });

    const openPopup = (event?: Event) => {
      event?.preventDefault();
      event?.stopPropagation();
      for (const [markerId, markerElement] of markerMap.entries()) {
        syncMarkerState(markerElement, markerId === institution.id);
      }
      if (map) popup.setLngLat(coordinates).setDOMContent(popupContent).addTo(map);
    };

    markerElement.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    markerElement.addEventListener("click", openPopup);
    markerElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        openPopup(event);
      }
    });
    markerElement.addEventListener("mouseenter", () => {
      if (map) map.getCanvas().style.cursor = "pointer";
    });
    markerElement.addEventListener("mouseleave", () => {
      if (map) map.getCanvas().style.cursor = "";
    });
    link.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    container.value.appendChild(markerElement);
  }

  map.on("move", updateMarkerPositions);
  map.on("zoom", updateMarkerPositions);
  map.on("resize", updateMarkerPositions);
  updateMarkerPositions();

  if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 48, maxZoom: 5, duration: 0 });
  resizeObserver = new ResizeObserver(() => map?.resize());
  resizeObserver.observe(container.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  map?.remove();
});
</script>

<template>
  <div
    ref="container"
    class="partners-map tw:relative tw:overflow-hidden tw:min-h-80 tw:w-full"
    role="region"
    aria-label="Partner institution map"
  />
</template>
