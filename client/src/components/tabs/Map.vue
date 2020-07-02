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
          Couldn't find any localities with these search parameters.
        </v-alert>
      </v-col>
    </v-row>

    <div class="map mt-3">
      <div id="map" :style="{ height: isDetailView ? '50vh' : '65vh' }"></div>
    </div>
  </v-card>
</template>

<script>
import * as L from "leaflet";

export default {
  name: "Map",

  props: {
    response: {
      type: Object,
      required: true
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
        "<i class='v-icon notranslate fas fa-circle theme--light primary--text map-marker-icon' style='font-size: 12px; opacity: 0.5;'/>",
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
  }),

  mounted() {
    this.initMap();
    this.setMarkers(this.localities);
  },

  beforeDestroy() {
    this.map.off("baselayerchange", this.handleLayerChange);
  },

  computed: {
    localities() {
      if (this.response !== null && this.response.numFound > 0) {
        return this.response.docs.filter(
          locality =>
            !!locality.locality && !!locality.latitude && !!locality.longitude
        );
      } else return [];
    }
  },

  watch: {
    localities: {
      handler(newVal) {
        this.setMarkers(newVal);
      },
      deep: true
    }
  },

  methods: {
    initMap() {
      if (this.map === null) {
        this.map = L.map("map", {
          layers: [this.baseMaps[0].leafletObject],
          scrollWheelZoom: true
        }).setView(L.latLng(58.5, 25.5), 6);

        let baseMaps = {};
        this.baseMaps.forEach(
          provider => (baseMaps[provider.name] = provider.leafletObject)
        );
        let overlayMaps = {};
        this.overlayMaps.forEach(
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
              marker.on("click", () => {
                if (window.location.pathname.includes("detail")) {
                  window.open(item.recordURI, "RecordUriWindow");
                } else this.$router.push({ path: `detail/${item.id}` });
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
        // Adding marker layer to map
        this.markerLayer = L.layerGroup(this.markers);
        this.map.addLayer(this.markerLayer);

        if (this.markers.length > 1) {
          let bounds = new L.featureGroup(this.markers).getBounds();
          this.map.fitBounds(bounds);
        } else if (this.markers.length === 1)
          this.map.setView(this.markers[0].getLatLng(), 6);
      } else {
        // If response is empty then remove markers
        if (this.markerLayer !== null) this.map.removeLayer(this.markerLayer);
        this.markers = [];
      }
    }
  }
};
</script>

<style scoped />
