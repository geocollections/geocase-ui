<script setup lang="ts">
import {
  Map,
  LngLatBounds,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
const props = defineProps<{
  points: { latitude: number; longitude: number; count: number }[];
  label: string;
}>();
const container = ref<HTMLElement | null>(null);
let map: Map | undefined;
let observer: ResizeObserver | undefined;
onMounted(() => {
  if (!container.value) return;
  setWorkerUrl(workerUrl);
  map = new Map({
    container: container.value,
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: [
            "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution:
            "Tiles &copy; Esri, HERE, Garmin, OpenStreetMap contributors, and the GIS user community",
        },
      },
      layers: [{ id: "osm", type: "raster", source: "osm" }],
    },
    center: [10, 40],
    zoom: 2,
  });
  map.addControl(new NavigationControl({ showCompass: false }), "top-right");
  map.on("load", () => {
    if (!map) return;
    map.addSource("collection", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: props.points.map((point) => ({
          type: "Feature",
          properties: { count: point.count },
          geometry: {
            type: "Point",
            coordinates: [point.longitude, point.latitude],
          },
        })),
      },
    });
    map.addLayer({
      id: "collection-points",
      type: "circle",
      source: "collection",
      paint: {
        "circle-radius": 6,
        "circle-color": "#C694D8",
        "circle-opacity": 0.5,
      },
    });
    const bounds = new LngLatBounds();
    props.points.forEach((point) =>
      bounds.extend([point.longitude, point.latitude]),
    );
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 24, maxZoom: 10, duration: 0 });
      map.setZoom(Math.min(map.getZoom() + 0.75, 10));
    }
  });
  observer = new ResizeObserver(() => map?.resize());
  observer.observe(container.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  map?.remove();
});
</script>

<template>
  <div
    ref="container"
    role="region"
    :aria-label="label"
    class="tw:h-96 tw:w-full"
  />
</template>
