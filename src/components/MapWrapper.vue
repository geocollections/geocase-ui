<template>
  <div
    :id="mapId"
    :style="{
      height: `${height}`
    }"
  ></div>
</template>

<script>
import * as L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { mapFields } from "vuex-map-fields";
import { debounce } from "lodash";

export default {
  name: "MapWrapper",
  props: {
    mapId: {
      type: String,
      default: "map"
    },
    height: {
      type: String,
      default: "500px"
    },
    open: {
      type: Boolean,
      default: false,
      required: false
    },
    responseResults: {
      type: Array,
      required: true
    },
    responseResultsCount: {
      type: Number,
      required: false,
      default: 1
    },
    activateSearch: Boolean,
    isDetailView: Boolean
  },
  data: () => {
    return {
      allGeomanLayers: null,
      activeGeomanLayer: null,
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
      ]
    };
  },

  computed: {
    ...mapFields("search", {
      geoJSON: "search.map.value"
    }),

    localities() {
      if (this.responseResultsCount > 0) {
        return this.responseResults.filter(locality => !!locality.has_map);
      } else return [];
    },

    responseResultsHasEstonia() {
      return this.localities.some(item => item.country === "Estonia");
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
        this.setMarkers(newVal);
        // Todo: Fix Zoom after invalidatingSize
        if (this.map) {
          this.$nextTick(() => {
            this.map.invalidateSize();
          });
        }
      },
      deep: true
    },

    open(newVal) {
      if (newVal && this.map) this.map.invalidateSize();
    },

    activeGeomanLayer(newVal) {
      if (newVal) {
        const json = newVal.toGeoJSON();

        // Adding radius if Circle
        if (newVal instanceof L.Circle) {
          json.properties.radius = newVal.getRadius();
        }

        if (json) this.geoJSON = json;
      } else this.geoJSON = null;

      // Updating activeG"updaeomanLayer triggers search update
      this.$emit("update");
    },

    geoJSON(newVal) {
      if (!newVal) this.removeAllGeomanLayers();
    }
  },

  mounted() {
    this.initMap();
    if (this.activateSearch) this.initLeafletGeoman();
    this.setMarkers(this.localities);
  },

  beforeDestroy() {
    if (this.map) {
      this.map.off("baselayerchange", this.handleLayerChange);
      if (this.activateSearch) this.terminateLeafletGeoman();
    }
  },

  methods: {
    initMap() {
      if (this.map === null) {
        this.map = L.map(this.mapId, {
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
              if (this.mapId !== "search-map")
                marker.on("click", () => {
                  if (this.isDetailView)
                    window.open(item.recordURI, "RecordUriWindow");
                  else this.$router.push({ path: `specimen/${item.id}` });
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
          this.map.fitBounds(bounds, {
            maxZoom: this.mapId === "tab-map" ? 4 : 6,
            padding: this.mapId === "tab-map" ? [0] : [15, 15]
          });
        }
      } else {
        // If response is empty then remove markers
        if (this.markerLayer !== null) this.map.removeLayer(this.markerLayer);
        this.markers = [];
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
          rotateMode: false
        });

        this.map.pm.setGlobalOptions({
          allowSelfIntersection: false,
          finishOn: "dblclick",
          snappable: false
        });

        this.allGeomanLayers = L.layerGroup();
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
      this.activeGeomanLayer = layer;
    },

    handlePmRemove() {
      this.removeAllGeomanLayers();
      this.activeGeomanLayer = null;
      this.geoJSON = null;
      this.$emit("update");
    },

    removeAllGeomanLayers() {
      if (this.allGeomanLayers)
        this.allGeomanLayers.eachLayer(layer => layer.remove());
    }
  }
};
</script>

<style scoped></style>
