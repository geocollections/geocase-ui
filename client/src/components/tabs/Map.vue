<template>
  <v-card flat v-if="response !== null">
    <v-card-title class="py-2">
      <v-icon left color="primary" large>mdi-map-legend</v-icon>
      <span class="mr-1">{{ response.numFound }}</span>
      <span class="mr-1">{{
        `location${response.numFound === 1 ? "" : "s"}`
      }}</span>
    </v-card-title>

    <div class="map">
      <div id="map" style="height: 65vh"></div>
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
    }
  },

  data: () => ({
    map: null,
    markerIcon: new L.divIcon({
      html: "<i class='v-icon notranslate mdi mdi-circle theme--light primary--text map-marker-icon' style='font-size: 12px; opacity: 0.5;'/>",
      className: "map-marker"
    }),
    baseMaps: [
      {
        name: "OpenStreetMap",
        leafletObject: L.tileLayer(
          "https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia3V1dG9iaW5lIiwiYSI6ImNpZWlxdXAzcjAwM2Nzd204enJvN2NieXYifQ.tp6-mmPsr95hfIWu3ASz2w",
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
        name: "Maaameti fotokaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "Eesti kaardid: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
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
        name: "Maaameti kaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "Eesti kaardid: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
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
        name: "Maaameti hübriidkaart",
        leafletObject: L.tileLayer(
          "https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
          {
            attribution:
              "Eesti kaardid: <a  href='http://www.maaamet.ee/'>Maa-amet</a>",
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
    this.setMarkers(this.response);
  },

  beforeDestroy() {
    this.map.off("baselayerchange", this.handleLayerChange);
  },

  watch: {
    response: {
      handler(newVal) {
        this.setMarkers(newVal);
      },
      deep: true
    }
  },

  methods: {
    initMap() {
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
    },

    handleLayerChange(event) {
      if (event.name && event.name === "Maaameti fotokaart") {
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

    setMarkers(data) {
      if (data && data.numFound > 0) {
        let markers = [];

        data.docs.forEach(item => {
          if (item.latitude && item.longitude) {
            let marker = L.marker(
              {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude)
              },
              { icon: this.markerIcon }
            ).addTo(this.map);

            if (item.recordURI) {
              marker.on("click", () =>
                window.open(item.recordURI, "ItemWindow")
              );
            }
            marker.bindTooltip(item.locality, {
              permanent: false,
              direction: "right"
            });
            markers.push(marker);
            let bounds = new L.featureGroup(markers).getBounds();
            this.map.fitBounds(bounds);
          }
        });
      }
    }
  }
};
</script>

<style scoped></style>
