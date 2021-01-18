<template>
  <v-card height="100%">
    <MglMap
      container="map"
      :mapStyle.sync="mapStyle"
      :zoom.sync="zoom"
      :minZoom.sync="minZoom"
      :maxZoom.sync="maxZoom"
      :center.sync="center"
      :attributionControl="true"
      @load="onMapLoaded"
    >
    </MglMap>
  </v-card>
</template>
<!-- :accessToken="accessToken" :mapboxGl="mapbox-gl" -->

<script>
import Mapbox from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MglMap } from "vue-mapbox";

export default {
  name: "MapCard",
  components: {
    MglMap
  },
  data() {
    return {
      mapStyle: "https://map.geocase.eu/styles/geocase-heatmap/style.json",
      center: [15, 45],
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 19
    };
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  },
  methods: {
    onMapLoaded(event) {
      this.map = event.map;
      const map = this.map;
      // resize() & addControl solve bug: rerender over full width
      map.resize();
      map.addControl(new Mapbox.NavigationControl(), "top-right");
      map.addControl(new Mapbox.FullscreenControl(), "top-right");
      map.addControl(new Mapbox.ScaleControl(), "bottom-left");
      map.on("click", "geocase-distinct", function(e) {
        const pointProperties = e?.features?.[0]?.properties;
        if (pointProperties?.latitude && pointProperties?.longitude) {
          const [lat, lng, locality] = [
            pointProperties?.latitude,
            pointProperties?.longitude,
            pointProperties?.locality
          ];
          console.log(lat);
          console.log(lng);
          console.log(locality);
          //
        }
        /*
        new Mapbox.Popup()
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.id)
          .addTo(map); 
        */
      });
    }
  }
};
</script>

<style>
.mapboxgl-ctrl-scale {
  border: 2px solid #777;
  border-top: none;
  min-width: 55px;
}
.mapboxgl-popup {
}
</style>
