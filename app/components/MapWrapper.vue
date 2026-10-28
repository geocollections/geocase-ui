<template>
  <div>
    <div
      :id="mapId"
      :style="{
        height: `${height}`,
      }"
    ></div>
    <details v-if="markers.length" class="tw:bg-default tw:p-3">
      <summary class="tw:cursor-pointer tw:py-2 tw:font-semibold">
        {{ $t("a11y.mapLocations") }}
      </summary>
      <p role="status" class="tw:my-2 tw:text-sm">
        {{
          $t("a11y.locationRange", {
            start: locationPage * 20 + 1,
            end: Math.min((locationPage + 1) * 20, markers.length),
            total: markers.length,
          })
        }}
      </p>
      <ul class="tw:space-y-1">
        <li
          v-for="(marker, index) in markers.slice(
            locationPage * 20,
            (locationPage + 1) * 20,
          )"
          :key="locationPage * 20 + index"
        >
          <button
            type="button"
            class="tw:min-h-11 tw:w-full tw:rounded tw:px-3 tw:py-2 tw:text-left tw:text-primary tw:underline"
            @click="activateLocation(marker, $event)"
          >
            {{ $t("a11y.openLocation", { name: marker.options.title }) }}
          </button>
        </li>
      </ul>
      <div v-if="markers.length > 20" class="tw:mt-3 tw:flex tw:gap-3">
        <UButton
          :label="$t('a11y.previousLocations')"
          :disabled="locationPage === 0"
          @click="locationPage--"
        />
        <UButton
          :label="$t('a11y.nextLocations')"
          :disabled="(locationPage + 1) * 20 >= markers.length"
          @click="locationPage++"
        />
      </div>
    </details>
  </div>
</template>

<script>
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useSearchStore } from "@/stores/search";
import { markRaw } from "vue";
import SearchService from "@/services/SearchService";

export default {
  name: "MapWrapper",
  props: {
    mapId: {
      type: String,
      default: "map",
    },
    height: {
      type: String,
      default: "500px",
    },
    open: {
      type: Boolean,
      default: false,
      required: false,
    },
    responseResults: {
      type: Array,
      required: true,
    },
    responseResultsCount: {
      type: Number,
      required: false,
      default: 1,
    },
    mapLevel: {
      type: String,
      default: "points",
    },
    selectableLocations: Boolean,
    loadLocationRecords: Function,
    activateSearch: Boolean,
    isDetailView: Boolean,
  },
  data: () => {
    return {
      allGeomanLayers: null,
      activeGeomanLayer: null,
      map: null,
      resizeObserver: null,
      markers: [],
      locationPage: 0,
      popupTrigger: null,
      markerLayer: null,
      locationCountMarkers: [],
      markerIcon: markRaw(
        new L.divIcon({
          html: "<i class='v-icon notranslate fas fa-circle theme--light text-primary searchMap-marker-icon' style='font-size: 0.75rem; opacity: 0.5;'/>",
          className: "map-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      ),
      baseMaps: markRaw([
        {
          name: "ArcGIS Light Gray",
          leafletObject: L.tileLayer(
            "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            {
              attribution:
                'Tiles &copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, (c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, and the GIS user community',
            },
          ),
          minZoom: 1,
          maxZoom: 18,
        },
        {
          name: "OpenStreetMap",
          leafletObject: L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            },
          ),
          minZoom: 1,
          maxZoom: 18,
        },
        {
          name: "OpenTopoMap",
          leafletObject: L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
              attribution:
                'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            },
          ),
          minZoom: 1,
          maxZoom: 18,
        },
        {
          name: "Estonian satellite",
          leafletObject: L.tileLayer(
            "https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
            {
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              worldCopyJump: true,
              detectRetina: true,
              zIndex: 1,
              updateWhenIdle: true,
              continuousWorld: true,
            },
          ),
          minZoom: 6,
          maxZoom: 18,
        },
        {
          name: "Estonian map",
          leafletObject: L.tileLayer(
            "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
            {
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              worldCopyJump: true,
              detectRetina: true,
              zIndex: 1,
              updateWhenIdle: true,
              continuousWorld: true,
            },
          ),
          minZoom: 6,
          maxZoom: 18,
        },
      ]),
      overlayMaps: markRaw([
        {
          name: "Estonian hybrid",
          leafletObject: L.tileLayer(
            "https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
            {
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              worldCopyJump: true,
              detectRetina: true,
              zIndex: 2,
              updateWhenIdle: true,
              continuousWorld: true,
            },
          ),
          minZoom: 6,
          maxZoom: 18,
        },
      ]),
    };
  },

  computed: {
    geoJSON: {
      get() {
        return useSearchStore().search.map.value;
      },
      set(value) {
        useSearchStore().updateSearchField({ id: "map", value });
      },
    },

    localities() {
      if (this.responseResultsCount > 0) {
        return this.responseResults.filter((locality) => !!locality.has_map);
      } else return [];
    },

    responseResultsHasEstonia() {
      return this.localities.some((item) => item.country === "Estonia");
    },

    filteredBaseMaps() {
      return this.baseMaps.filter((item) => {
        if (item.name.includes("Estonia")) {
          return this.responseResultsHasEstonia;
        } else return item;
      });
    },

    filteredOverlayMaps() {
      return this.overlayMaps.filter((item) => {
        if (item.name.includes("Estonia")) {
          return this.responseResultsHasEstonia;
        } else return item;
      });
    },
  },

  watch: {
    localities: {
      handler(newVal) {
        this.setMarkers(newVal);
        if (this.map) {
          this.$nextTick(() => {
            this.map.invalidateSize();
          });
        }
      },
      deep: true,
    },

    open: {
      handler(newVal) {
        if (newVal) this.updateMapSize();
      },
      flush: "post",
    },

    activeGeomanLayer(newVal) {
      if (newVal) {
        const json = newVal.toGeoJSON();

        if (newVal instanceof L.Circle) {
          json.properties.radius = newVal.getRadius();
        }

        if (json) this.geoJSON = json;
      } else this.geoJSON = null;

      this.$emit("update");
    },

    geoJSON(newVal) {
      if (!newVal) this.removeAllGeomanLayers();
    },
  },

  mounted() {
    this.initMap();
    if (this.activateSearch) this.initLeafletGeoman();
    this.setMarkers(this.localities);
    this.resizeObserver = markRaw(new ResizeObserver(this.updateMapSize));
    this.resizeObserver.observe(this.$el);
  },

  beforeUnmount() {
    this.resizeObserver?.disconnect();
    if (this.map) {
      this.map.off("baselayerchange", this.handleLayerChange);
      this.map.off("zoomend", this.updateLocationMarkerIcons);
      if (this.activateSearch) {
        this.map.off("moveend", this.handleMapViewportChange);
        this.terminateLeafletGeoman();
      }
      this.map.remove();
    }
  },

  methods: {
    activateLocation(marker, event) {
      this.popupTrigger = event.currentTarget;
      this.map.panTo(marker.getLatLng());
      marker.fire("click");
    },
    prepareMarker(marker) {
      marker.on("add", () => {
        const element = marker.getElement();
        element.setAttribute(
          "aria-label",
          this.$t("a11y.openLocation", { name: marker.options.title }),
        );
        element.addEventListener("keydown", (event) => {
          if (event.key === " ") {
            event.preventDefault();
            marker.fire("click");
          }
        });
      });
      marker.on("popupopen", ({ popup }) => {
        const element = popup.getElement();
        element.onkeydown = (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            marker.closePopup();
          }
        };
        element.setAttribute("tabindex", "-1");
        element.setAttribute("role", "region");
        element.setAttribute("aria-label", marker.options.title);
        element
          .querySelector(".leaflet-popup-close-button")
          ?.setAttribute("aria-label", this.$t("a11y.closePopup"));
        element.focus();
      });
      marker.on("popupclose", () => {
        const target = this.popupTrigger?.isConnected
          ? this.popupTrigger
          : marker.getElement();
        target?.focus();
        this.popupTrigger = null;
      });
    },
    updateMapSize() {
      if (this.map && this.$el.clientWidth > 0 && this.$el.clientHeight > 0) {
        this.map.invalidateSize({ animate: false });
      }
    },

    initMap() {
      if (this.map === null) {
        this.map = markRaw(
          L.map(this.mapId, {
            layers: [this.baseMaps[0].leafletObject],
            scrollWheelZoom: true,
            zoomControl: false,
            minZoom: this.isDetailView ? 3 : undefined,
            maxBounds: this.isDetailView
              ? L.latLngBounds([-85, -180], [85, 180])
              : undefined,
            maxBoundsViscosity: this.isDetailView ? 1 : 0,
          }).setView(
            this.activateSearch ? L.latLng(45, 15) : L.latLng(58.5, 25.5),
            this.activateSearch ? 2.5 : 6,
          ),
        );

        let baseMaps = {};
        this.filteredBaseMaps.forEach(
          (provider) => (baseMaps[provider.name] = provider.leafletObject),
        );
        let overlayMaps = {};
        this.filteredOverlayMaps.forEach(
          (provider) => (overlayMaps[provider.name] = provider.leafletObject),
        );
        L.control.layers(baseMaps, overlayMaps).addTo(this.map);

        L.control
          .zoom({
            zoomInTitle: this.$t("a11y.zoomIn"),
            zoomOutTitle: this.$t("a11y.zoomOut"),
          })
          .addTo(this.map);
        const layersToggle = this.map
          .getContainer()
          .querySelector(".leaflet-control-layers-toggle");
        layersToggle?.setAttribute("aria-label", this.$t("a11y.mapLayers"));
        L.control.scale({ imperial: false }).addTo(this.map);

        this.map.on("baselayerchange", this.handleLayerChange);
        this.map.on("zoomend", this.updateLocationMarkerIcons);
        if (this.activateSearch) {
          this.map.on("moveend", this.handleMapViewportChange);
        }
      }
    },

    handleLayerChange(event) {
      if (this.isDetailView) {
        const provider = this.filteredBaseMaps.find(
          (baseMap) => baseMap.name === event.name,
        );
        this.map.setMinZoom(Math.max(3, provider?.minZoom ?? 3));
      }
      if (event.name && event.name === "Estonian satellite") {
        this.map.addLayer(this.overlayMaps[0].leafletObject);
      } else {
        this.map.removeLayer(this.overlayMaps[0].leafletObject);
      }
    },

    locationMarkerIcon(count) {
      if (!this.map || this.map.getZoom() < 7) return this.markerIcon;
      return L.divIcon({
        html: `<span>${Number(count).toLocaleString()}</span>`,
        className: "map-count-icon map-country-count",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
    },

    updateLocationMarkerIcons() {
      for (const { marker, count } of this.locationCountMarkers) {
        marker.setIcon(this.locationMarkerIcon(count));
      }
    },

    handleMapViewportChange() {
      if (!this.map || !this.activateSearch) return;
      const bounds = this.map.getBounds();
      this.$emit("viewport-changed", {
        zoom: this.map.getZoom(),
        bounds: {
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth(),
        },
      });
    },

    isGeomanInteractionActive() {
      return (
        this.activateSearch &&
        (this.map.pm.globalDrawModeEnabled() ||
          this.map.pm.globalRemovalModeEnabled())
      );
    },

    handleGroupedMarkerClick(item) {
      if (this.isGeomanInteractionActive()) return;
      if (this.mapLevel === "country") {
        this.$emit("select-country", item.country);
        this.map.setView([item.latitude, item.longitude], 5);
      } else if (this.mapLevel === "locality") {
        this.$emit("select-locality", item.locality);
        this.map.setView([item.latitude, item.longitude], 9);
      }
    },

    bindLocationPopup(marker, item) {
      const container = document.createElement("div");
      container.style.cssText = "min-width:240px;max-width:320px";
      const heading = document.createElement("strong");
      heading.textContent = `${item.locality || `${item.latitude}, ${item.longitude}`} (${item.mapCount})`;
      container.append(heading);
      const list = document.createElement("div");
      list.style.cssText = "max-height:240px;overflow:auto;margin-top:8px";
      list.setAttribute("aria-live", "polite");
      container.append(list);
      const next = document.createElement("button");
      next.type = "button";
      next.textContent = this.$t("detail.showMore");
      next.style.cssText =
        "margin-top:8px;text-decoration:underline;cursor:pointer";
      container.append(next);
      // Dataset popups use their loaded records and do not need search state.
      const store = this.loadLocationRecords ? null : useSearchStore();
      const params = store ? {
        page: 1,
        paginateBy: 20,
        sortBy: [...store.sortBy],
        sortDesc: [...store.sortDesc],
        searchIds: [...store.searchIds],
        search: JSON.parse(JSON.stringify(store.search)),
      } : null;
      let page = 1;
      let loading = false;
      let loaded = false;
      const load = async () => {
        if (loading) return;
        loading = true;
        next.disabled = true;
        try {
          const response = this.loadLocationRecords
            ? await this.loadLocationRecords(item.latitude, item.longitude, page)
            : await SearchService.searchMapLocation(
                params,
                item.latitude,
                item.longitude,
                page,
              );
          for (const record of response.docs) {
            const link = document.createElement("a");
            link.textContent = [
              record.fullscientificname,
              record.unitid,
              record.geocase_id,
            ]
              .filter(Boolean)
              .join(" · ");
            link.href = this.$router.resolve({
              name: "Detail",
              params: {
                id: record.geocase_id,
                ...(this.$route.params.locale
                  ? { locale: this.$route.params.locale }
                  : {}),
              },
            }).href;
            link.style.cssText =
              "display:block;padding:8px 0;border-bottom:1px solid #ddd";
            list.append(link);
          }
          loaded = true;
          next.hidden = page * 20 >= response.numFound;
          page += 1;
        } catch {
          next.textContent = this.$t("search.layout.mapRetry");
        } finally {
          loading = false;
          next.disabled = false;
        }
      };
      next.addEventListener("click", load);
      marker.bindPopup(container, { maxWidth: 360 });
      marker.on("click", () => {
        if (this.isGeomanInteractionActive()) {
          marker.closePopup();
          return;
        }
        if (!loaded) load();
      });
    },

    formatMapCount(value) {
      if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
      return String(value);
    },

    setMarkers(localities) {
      if (this.markerLayer !== null) this.map.removeLayer(this.markerLayer);
      this.markers = [];
      this.locationPage = 0;
      this.locationCountMarkers = [];

      if (localities && localities.length > 0) {
        localities.forEach((item) => {
          if (
            Number.isFinite(Number(item.latitude)) &&
            Number.isFinite(Number(item.longitude))
          ) {
            if (this.mapLevel !== "points" && item.mapCount) {
              const radius = Math.min(38, 20 + Math.log10(item.mapCount) * 2);
              const label =
                this.mapLevel === "country"
                  ? item.country
                  : item.locality || item.country;
              const marker = L.marker(
                [Number(item.latitude), Number(item.longitude)],
                {
                  icon: L.divIcon({
                    html: `<span class="tw:leading-none tw:whitespace-nowrap">${this.formatMapCount(item.mapCount)}</span>`,
                    className: "map-count-icon map-country-count",
                    iconSize: [radius * 2, radius * 2],
                    iconAnchor: [radius, radius],
                  }),
                  pmIgnore: true,
                  title: `${label}: ${item.mapCount}`,
                },
              );
              marker.bindTooltip(
                `${item.country || ""}${item.locality ? `, ${item.locality}` : ""}: ${item.mapCount.toLocaleString()}`,
                { direction: "top" },
              );
              marker.on("click", () => this.handleGroupedMarkerClick(item));
              this.markers.push(markRaw(marker));
              return;
            }

            let marker = L.marker(
              {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
              },
              {
                icon:
                  !this.isDetailView && item.mapCount > 1
                    ? this.locationMarkerIcon(item.mapCount)
                    : this.markerIcon,
                pmIgnore: true,
                title:
                  [item.locality, item.fullscientificname || item.unitid || `${item.latitude}, ${item.longitude}`].filter(Boolean).join(" · ") + (item.mapCount > 1 ? ` (${item.mapCount})` : ""),
              },
            );

            if (!this.isDetailView && item.mapCount > 1) {
              this.locationCountMarkers.push({
                marker: markRaw(marker),
                count: item.mapCount,
              });
              this.bindLocationPopup(marker, item);
            } else if (this.selectableLocations) {
              marker.on("click", () => this.$emit("select-location", item));
            } else if (this.isDetailView ? item.recordURI : item.geocase_id) {
              marker.on("click", () => {
                if (this.isGeomanInteractionActive()) return;
                if (this.isDetailView) {
                  window.open(item.recordURI, "RecordUriWindow");
                } else {
                  this.$router.push({
                    name: "Detail",
                    params: {
                      id: item.geocase_id,
                      ...(this.$route.params.locale
                        ? { locale: this.$route.params.locale }
                        : {}),
                    },
                  });
                }
              });
            }
            if (item.locality) {
              marker.bindTooltip(item.locality, {
                permanent: false,
                direction: "right",
              });
            }

            this.markers.push(markRaw(marker));
          }
        });
        this.markers.forEach((marker) => this.prepareMarker(marker));
        this.markerLayer = markRaw(L.layerGroup(this.markers));
        this.map.addLayer(this.markerLayer);

        if (this.markers.length > 0 && !this.activateSearch) {
          let bounds = new L.featureGroup(this.markers).getBounds();
          this.map.fitBounds(bounds, {
            maxZoom: this.mapId === "tab-map" ? 4 : 6,
            padding: this.mapId === "tab-map" ? [0] : [15, 15],
          });
        }
      }
    },

    initLeafletGeoman() {
      if (this.map) {
        this.map.pm.addControls({
          position: "topleft",
          drawMarker: false,
          drawCircleMarker: false,
          drawPolyline: false,
          editMode: false,
          dragMode: false,
          cutPolygon: false,
          rotateMode: false,
        });

        this.map.pm.setGlobalOptions({
          allowSelfIntersection: false,
          finishOn: "dblclick",
          snappable: false,
        });

        this.allGeomanLayers = markRaw(L.layerGroup());
        this.allGeomanLayers.addTo(this.map);

        this.map.on("pm:create", this.handlePmCreate);
        this.map.on("pm:remove", this.handlePmRemove);
      }
    },

    terminateLeafletGeoman() {
      this.map.off("pm:create", this.handlePmCreate);
      this.map.off("pm:remove", this.handlePmRemove);
    },

    handlePmCreate({ layer }) {
      this.removeAllGeomanLayers();
      layer.addTo(this.allGeomanLayers);
      this.activeGeomanLayer = markRaw(layer);
    },

    handlePmRemove() {
      this.removeAllGeomanLayers();
      this.activeGeomanLayer = null;
      this.geoJSON = null;
      this.$emit("update");
    },

    removeAllGeomanLayers() {
      if (this.allGeomanLayers)
        this.allGeomanLayers.eachLayer((layer) => layer.remove());
    },
  },
};
</script>
