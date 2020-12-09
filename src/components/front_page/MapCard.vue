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
  MglScaleControl
} from "vue-mapbox";

export default {
  name: "MapCard",
  components: {
    MglMap,
    MglAttributionControl,
    MglNavigationControl,
    MglScaleControl
  },
  data() {
    return {
      //accessToken: ACCESS_TOKEN, // your access token. Needed if you using Mapbox maps
      mapStyle: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json", // your map style
      center: [13, 20],
      zoom: 1.6,
      minZoom: 1,
      maxZoom: 14
    };
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
    //console.log(Mapbox);
  },
  methods: {
    onMapLoaded(event) {
      // in component
      this.map = event.map;
      // or just to store if you want have access from other components
      this.$store.map = event.map;
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
