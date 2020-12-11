<template>
  <v-card height="100%">
    <MglMap
      container="map"
      class="mapboxgl-map"
      :mapStyle.sync="mapStyle"
      :zoom.sync="zoom"
      :minZoom.sync="minZoom"
      :maxZoom.sync="maxZoom"
      :center.sync="center"
      :attributionControl="false"
      @load="onMapLoaded"
    >
      <MglAttributionControl position="bottom-right" />
      <MglNavigationControl position="top-right" />
      <MglFullscreenControl position="top-right" />
      <MglScaleControl position="bottom-left" />
    </MglMap>
  </v-card>
</template>
<!-- :accessToken="accessToken" :mapboxGl="mapbox-gl" -->

<script>
import Mapbox from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MglMap,
  MglAttributionControl,
  MglNavigationControl,
  MglFullscreenControl,
  MglScaleControl
} from "vue-mapbox";

export default {
  name: "MapCard",
  components: {
    MglMap,
    MglAttributionControl,
    MglNavigationControl,
    MglFullscreenControl,
    MglScaleControl
  },
  data() {
    return {
      mapStyle: "http://localhost:8090/styles/geocase/style.json",
      center: [15, 35],
      zoom: 1.6,
      minZoom: 1,
      maxZoom: 20
    };
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  },
  methods: {
    onMapLoaded(event) {
      this.map = event.map;
      console.log(this.map);
      console.log(this.mapbox);
      /*       this.map.setLayoutProperty(
        "geocase-distinct-heatmap",
        "visibility",
        "none"
      );
      this.map.setLayoutProperty("geocase-all-heatmap", "visibility", "none");
      this.map.on("click", "geocase-count-tile", function(e) {
        console.log(e.features);
      }); */
      this.map.setLayoutProperty(
        "geocase-distinct-points",
        "visibility",
        "visible"
      );
    }
  }
};
</script>

<style>
.mgl-map-wrapper .mapboxgl-map {
  position: relative;
  min-height: 500px;
  max-height: 800px;
  height: 650px;
}
.mapboxgl-ctrl-scale {
  border: 2px solid #777;
  border-top: none;
}
</style>
