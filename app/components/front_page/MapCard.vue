<template>
  <div class="front-map">
    <div ref="container" class="map-canvas" />
    <Teleport v-if="popupTarget && activePopupData.id" :to="popupTarget">
      <MglPopupWrapper
        :popup="{}"
        :active-popup-data="activePopupData"
        :map-results="frontpage.mapResults"
        :popup-max-width="popupMaxWidth"
        @clicked:searchButton="loadSpecimens"
      />
    </Teleport>
  </div>
</template>
<script setup>
import {
  Map,
  setWorkerUrl,
  Popup,
  NavigationControl,
  GeolocateControl,
  FullscreenControl,
  ScaleControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { shallowRef, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useDisplay } from "vuetify";
import { useFrontpageStore } from "@/stores/frontpage";
import MglPopupWrapper from "./MglPopupWrapper.vue";
const frontpage = useFrontpageStore();
const container = ref(null);
const popupTarget = shallowRef(null);
const activePopupData = ref({ id: null, locality: "", lat: null, lng: null });
const { smAndDown } = useDisplay();
const popupMaxWidth = computed(() => (smAndDown.value ? "250px" : "400px"));
let map, popup, resizeObserver, resizeFrame;
const showLocality = (event) => {
  const feature = event.features?.[0];
  if (!feature?.geometry?.coordinates || !feature.properties) return;
  const coordinates = [...feature.geometry.coordinates];
  while (Math.abs(event.lngLat.lng - coordinates[0]) > 180)
    coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
  const data = feature.properties;
  activePopupData.value = {
    id: data.id,
    locality: data.locality,
    lat: data.latitude,
    lng: data.longitude,
  };
  popup.setLngLat(coordinates).setMaxWidth(popupMaxWidth.value).addTo(map);
};
const loadSpecimens = () =>
  frontpage.getLocalitySpecimens(activePopupData.value);
onMounted(() => {
  setWorkerUrl(workerUrl);
  map = new Map({
    container: container.value,
    style: "https://map.geocase.eu/styles/geocase-heatmap/style.json",
    center: [15, 45],
    zoom: 1.5,
    minZoom: 1,
    maxZoom: 19,
  });
  map.addControl(new NavigationControl(), "top-right");
  map.addControl(new GeolocateControl(), "top-right");
  map.addControl(new FullscreenControl(), "top-right");
  map.addControl(new ScaleControl(), "bottom-left");
  popupTarget.value = document.createElement("div");
  popup = new Popup({
    closeOnClick: false,
    focusAfterOpen: false,
  }).setDOMContent(popupTarget.value);
  map.on("load", () => {
    if (!map.getLayer("geocase-distinct")) return;
    map.on("mouseenter", "geocase-distinct", showLocality);
    map.on("click", "geocase-distinct", showLocality);
  });
  resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => map.resize());
  });
  resizeObserver.observe(container.value);
});
onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  cancelAnimationFrame(resizeFrame);
  popup?.remove();
  map?.remove();
});
</script>
<style scoped>
.front-map,
.map-canvas {
  width: 100%;
  height: 100%;
  min-height: 320px;
}
.front-map :deep(.maplibregl-popup-content) {
  padding: 0;
}
</style>
