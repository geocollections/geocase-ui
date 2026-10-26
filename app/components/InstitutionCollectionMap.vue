<script setup>
import * as L from "leaflet";
import { useRouter } from "#imports";
import "leaflet/dist/leaflet.css";
import {
  getInstitutionCountryMarkers,
} from "@/utils/institutionMap";
import { institutionCollectionSearchQuery } from "@/utils/institutionCatalog";

const props = defineProps({
  countries: { type: Array, default: () => [] },
  sourceUrls: { type: Array, default: () => [] },
  institution: { type: Object, required: true },
  label: { type: String, required: true },
  homeLabel: { type: String, required: true },
  countLabel: { type: String, required: true },
});
const router = useRouter();
const { localePath } = useAppNavigation();
const container = ref(null);
const pointCount = ref(0);
let map;
let collectionLayer;
let institutionMarker;
let observer;
const locations = computed(() => getInstitutionCountryMarkers(props.countries));

function fitCollection() {
  if (!map) return;
  const [longitude, latitude] = props.institution.coordinates;
  const bounds = L.latLngBounds([[latitude, longitude]]);
  locations.value.forEach((point) =>
    bounds.extend([point.latitude, point.longitude]),
  );
  map.fitBounds(bounds, {
    padding: [40, 40],
    maxZoom: locations.value.length ? 10 : 12,
    animate: false,
  });
}
function showInstitution() {
  const [longitude, latitude] = props.institution.coordinates;
  map?.setView([latitude, longitude], 12);
  institutionMarker?.openPopup();
}
function updatePoints() {
  if (!map || !collectionLayer) return;
  collectionLayer.clearLayers();
  locations.value.forEach((point) => {
    const radius = Math.min(38, 20 + Math.log10(point.count) * 2);
    const position = L.latLng(point.latitude, point.longitude);
    const [homeLongitude, homeLatitude] = props.institution.coordinates;
    const homePixel = map.latLngToLayerPoint([homeLatitude, homeLongitude]);
    const countryPixel = map.latLngToLayerPoint(position);
    const delta = countryPixel.subtract(homePixel);
    const distance = countryPixel.distanceTo(homePixel);
    const clearance = radius + 18 + 8;
    let offset = L.point(0, 0);
    // Separate nearby symbols in screen pixels while retaining the country anchor.
    if (distance < clearance) {
      const direction = distance ? delta.divideBy(distance) : L.point(1, 0);
      offset = direction.multiplyBy(clearance - distance);
      L.polyline([position, map.layerPointToLatLng(countryPixel.add(offset))], {
        color: "#a96ac3",
        weight: 1,
        interactive: false,
      }).addTo(collectionLayer);
    }
    const content = document.createElement("span");
    content.className = "tw:leading-none tw:whitespace-nowrap";
    content.textContent =
      point.count >= 1_000_000
        ? `${(point.count / 1_000_000).toFixed(1)}M`
        : point.count >= 1000
          ? `${(point.count / 1000).toFixed(1)}k`
          : String(point.count);
    const tooltip = document.createElement("span");
    tooltip.textContent = `${point.country}: ${point.count.toLocaleString()} ${props.countLabel}`;
    const countryMarker = L.marker(position, {
      title: `${point.country}: ${point.count}`,
      icon: L.divIcon({
        className: "map-country-count",
        html: content.outerHTML,
        iconSize: [radius * 2, radius * 2],
        iconAnchor: [radius - offset.x, radius - offset.y],
      }),
    })
      .bindTooltip(tooltip, { offset })
      .addTo(collectionLayer);
    countryMarker.on("click", () => {
      if (!props.sourceUrls.length) return;
      router.push({
        path: localePath("/search"),
        query: institutionCollectionSearchQuery(props.sourceUrls, point.country),
      });
    });
  });
  pointCount.value = locations.value.length;
}
watch(locations, updatePoints, { deep: true });
onMounted(() => {
  if (!container.value) return;
  const [longitude, latitude] = props.institution.coordinates;
  map = L.map(container.value, {
    preferCanvas: true,
    scrollWheelZoom: false,
  }).setView([46, 12], 3);
  L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        'Tiles &copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, (c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, and the GIS user community',
      maxZoom: 18,
    },
  ).addTo(map);
  L.control.scale({ imperial: false }).addTo(map);
  collectionLayer = L.layerGroup().addTo(map);
  const name = document.createElement("strong");
  name.textContent = props.institution.name;
  institutionMarker = L.marker([latitude, longitude], {
    title: props.institution.name,
    zIndexOffset: 1000,
    icon: L.divIcon({
      className: "institution-location-marker",
      html: '<span class="institution-location-dot tw:size-9">●</span>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    }),
  })
    .bindPopup(name)
    .addTo(map);
  institutionMarker
    .getElement()
    ?.setAttribute(
      "aria-label",
      `${props.homeLabel}: ${props.institution.name}`,
    );
  // Leaflet layers are independent of tile loading and work without WebGL/workers.
  updatePoints();
  map.on("zoomend", updatePoints);
  observer = new ResizeObserver(() => map?.invalidateSize());
  observer.observe(container.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  map?.remove();
  map = undefined;
});
</script>

<template>
  <div class="detail-map">
    <div class="tw:flex tw:flex-wrap tw:gap-2 tw:bg-home-surface tw:p-3">
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-landmark"
        @click="showInstitution"
        >{{ homeLabel }}</UButton
      >
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-maximize"
        @click="fitCollection"
        >{{ label }}</UButton
      >
    </div>
    <div
      ref="container"
      role="region"
      :aria-label="label"
      :data-country-markers="pointCount"
      class="tw:h-112 tw:w-full tw:sm:h-128"
    />
  </div>
</template>
