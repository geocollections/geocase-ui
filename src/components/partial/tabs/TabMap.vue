<template>
  <v-card flat>
    <v-row class="mx-0" justify="center" v-if="localities.length === 0">
      <v-col cols="12" style="max-width: 500px;">
        <v-alert
          class="mb-0"
          text
          border="left"
          icon="fas fa-search"
          color="secondary"
        >
          <div>
            {{ $t("search.mapNoResults") }}
          </div>

          <!--<div v-if="!search.has_map.value">
            Add filter so it would only show results which have georeferenced
            data.
            <v-btn
              x-small
              color="secondary"
              @click="$emit('add:filter', { id: 'has_map', value: 'true' })"
              >Add filter</v-btn
            >
          </div>-->
        </v-alert>
      </v-col>
    </v-row>

    <div class="map" v-show="localities.length > 0">
      <v-overlay :value="isLoading" z-index="2000">
        <v-progress-circular
          class="map-progress-circular"
          :style="`margin-left: ${searchDrawer ? '350px' : 0}`"
          indeterminate
          size="128"
        ></v-progress-circular>
      </v-overlay>
      <div id="map" :style="{ height: isDetailView ? '50vh' : '70vh' }"></div>
    </div>
  </v-card>
</template>

<script>
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster";

import { mapActions, mapState } from "vuex";

export default {
  name: "TabMap",

  props: {
    responseResults: {
      type: Array,
      required: true
    },
    responseResultsCount: {
      type: Number,
      required: false,
      default: 1
    },
    isDetailView: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    map: null,
    markers: [],
    markerLayer: null,
    markerIcon: new L.divIcon({
      html:
        "<i class='v-icon notranslate fas fa-circle theme--light primary--text searchMap-marker-icon' style='font-size: 0.75rem; opacity: 0.5;'/>",
      className: "map-marker"
    }),
    baseMaps: [
      {
        name: "CartoDB",
        leafletObject: L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          }
        ),
        minZoom: 1,
        maxZoom: 18
      },
      {
        name: "OpenStreetMap",
        leafletObject: L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }
        ),
        minZoom: 1,
        maxZoom: 18
      },
      {
        name: "OpenTopoMap",
        leafletObject: L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
          }
        ),
        minZoom: 1,
        maxZoom: 18
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
            continuousWorld: true
          }
        ),
        minZoom: 6,
        maxZoom: 18
      },
      {
        name: "Estonian searchMap",
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
            continuousWorld: true
          }
        ),
        minZoom: 6,
        maxZoom: 18
      }
    ],
    overlayMaps: [
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
            continuousWorld: true
          }
        ),
        minZoom: 6,
        maxZoom: 18
      }
    ],
    isLoading: false
  }),

  mounted() {
    this.initMap();
    this.setMarkers(this.localities);
  },

  beforeDestroy() {
    if (this.map) this.map.off("baselayerchange", this.handleLayerChange);
  },

  computed: {
    ...mapState("search", ["search"]),
    ...mapState("settings", ["searchDrawer"]),

    localities() {
      if (this.responseResultsCount > 0) {
        return this.isDetailView
          ? this.responseResults.filter(locality => !!locality.has_map)
          : this.responseResults;
      } else return [];
    },

    responseResultsHasEstonia() {
      return this.isDetailView
        ? this.localities.some(item => item.country === "Estonia")
        : true;
    },

    filteredBaseMaps() {
      return this.baseMaps.filter(item => {
        if (item.name.includes("Estonia")) {
          return this.responseResultsHasEstonia;
        } else return item;
      });
    },

    filteredOverlayMaps() {
      return this.overlayMaps.filter(item => {
        if (item.name.includes("Estonia")) {
          return this.responseResultsHasEstonia;
        } else return item;
      });
    }
  },

  watch: {
    localities: {
      handler(newVal) {
        if (this.isDetailView) {
          this.setMarkers(newVal);
          // Todo: Fix Zoom after invalidatingSize
          if (this.map) {
            this.$nextTick(() => {
              this.map.invalidateSize();
            });
          }
        }
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("search", ["updateSearchField", "updatePage"]),

    initMap() {
      if (this.map === null) {
        this.map = L.map("map", {
          layers: [this.baseMaps[0].leafletObject],
          scrollWheelZoom: true
        }).setView(L.latLng(58.5, 25.5), 6);

        let baseMaps = {};
        this.filteredBaseMaps.forEach(
          provider => (baseMaps[provider.name] = provider.leafletObject)
        );
        let overlayMaps = {};
        this.filteredOverlayMaps.forEach(
          provider => (overlayMaps[provider.name] = provider.leafletObject)
        );
        L.control.layers(baseMaps, overlayMaps).addTo(this.map);

        L.control.scale({ imperial: false }).addTo(this.map);

        //LAYERS CHANGED
        this.map.on("baselayerchange", this.handleLayerChange);
      }
    },

    handleLayerChange(event) {
      if (event.name && event.name === "Estonian satellite") {
        this.map.addLayer(this.overlayMaps[0].leafletObject);
        document.querySelector(
          "#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > label > div > input"
        ).checked = true;
      } else {
        this.map.removeLayer(this.overlayMaps[0].leafletObject);
        document.querySelector(
          "#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div > section > div.leaflet-control-layers-overlays > label > div > input"
        ).checked = false;
      }
    },

    setMarkers(localities) {
      if (this.isDetailView) {
        if (localities && localities.length > 0) {
          // Resetting markers before adding new ones
          if (this.markerLayer !== null) this.map.removeLayer(this.markerLayer);
          this.markers = [];

          localities.forEach(item => {
            if (item.latitude && item.longitude) {
              let marker = L.marker(
                {
                  lat: parseFloat(item.latitude),
                  lng: parseFloat(item.longitude)
                },
                { icon: this.markerIcon }
              );

              if (item.recordURI) {
                marker.on("click", () => {
                  if (this.isDetailView) {
                    window.open(item.recordURI, "RecordUriWindow");
                  } else this.$router.push({ path: `specimen/${item.id}` });
                });
              }
              if (item.locality) {
                marker.bindTooltip(item.locality, {
                  permanent: false,
                  direction: "right"
                });
              }

              this.markers.push(marker);
            }
          });
          // Adding marker layer to searchMap
          this.markerLayer = L.layerGroup(this.markers);
          this.map.addLayer(this.markerLayer);

          if (this.markers.length > 0) {
            let bounds = new L.featureGroup(this.markers).getBounds();
            this.map.fitBounds(bounds, { maxZoom: 4 });
          }
        } else {
          // If response is empty then remove markers
          if (this.markerLayer !== null) this.map.removeLayer(this.markerLayer);
          this.markers = [];
        }
      } else {
        // Todo: Loading icon etc.
        this.isLoading = true;
        setTimeout(() => {
          let geoJsonLayer = L.geoJSON(localities, {
            pointToLayer: (feature, latlng) => {
              let marker = L.marker(latlng, { icon: this.markerIcon });
              marker.bindTooltip(
                `${this.$t("search.mapMarkerTooltip")} <br/> Lat: ${
                  latlng.lat
                } <br/> Lon: ${latlng.lng}`,
                {
                  permanent: false,
                  direction: "right"
                }
              );

              marker.on("click", () => {
                this.updateSearchField({
                  id: "coordinates",
                  value: `${latlng.lat},${latlng.lng}`
                });
                if (this.search.page !== 1) this.updatePage(1);
                this.$emit("open:table");
              });
              return marker;
            }
          });

          let markersCluster = L.markerClusterGroup();
          markersCluster.addLayer(geoJsonLayer);
          this.map.addLayer(markersCluster);

          this.map.fitBounds(geoJsonLayer.getBounds());
          this.isLoading = false;
        }, 500);
      }
    }
  }
};
</script>

<style scoped>
.map-progress-circular {
  transition: margin-left 200ms ease-in-out;
}
</style>
