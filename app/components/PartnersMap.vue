<script setup lang="ts">
import { LngLatBounds, Map, Marker, NavigationControl, Popup, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { useI18n } from "vue-i18n";

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
  for (const institution of props.institutions) {
    const coordinates: [number, number] = [...institution.coordinates];
    bounds.extend(coordinates);

    const markerElement = document.createElement("button");
    markerElement.type = "button";
    markerElement.className = "tw:size-[18px] tw:cursor-pointer tw:rounded-full tw:border-[3px] tw:border-white tw:bg-home-link tw:p-0 tw:shadow-md tw:transition-transform tw:hover:scale-125 tw:focus-visible:scale-125 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-link";
    markerElement.setAttribute("aria-label", institution.name);

    const popupContent = document.createElement("div");
    const name = document.createElement("strong");
    name.className = "tw:block";
    name.textContent = institution.name;
    const link = document.createElement("a");
    link.className = "tw:mt-1 tw:block tw:text-home-link";
    link.href = localePath(`/institution/${institution.id}`);
    link.textContent = t("partnersPage.viewDetails");
    popupContent.append(name, link);

    new Marker({ element: markerElement, anchor: "bottom" })
      .setLngLat(coordinates)
      .setPopup(new Popup({ offset: 18 }).setDOMContent(popupContent))
      .addTo(map);
  }

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
    class="tw:min-h-80 tw:w-full tw:[&_.maplibregl-popup-content]:rounded-xl tw:[&_.maplibregl-popup-content]:px-4 tw:[&_.maplibregl-popup-content]:py-3"
    role="region"
    aria-label="Partner institution map"
  />
</template>
