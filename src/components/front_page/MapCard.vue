<template>
  <v-card height="100%">
    <MglMap
      :mapStyle.sync="mapStyle"
      container="map"
      :zoom.sync="zoom"
      :minZoom.sync="minZoom"
      :maxZoom.sync="maxZoom"
      :center.sync="center"
      :attribution-control="false"
      :scroll-zoom="true"
      @load="onMapLoaded"
    >
      <MglAttributionControl position="bottom-right" />
      <MglNavigationControl position="top-right" />
      <MglGeolocateControl position="top-right" />
      <MglFullscreenControl position="top-right" />
      <MglScaleControl position="bottom-left" />

      <MglPopupWrapper
        ref="popup"
        :popup="popup"
        :active-popup-data="activePopupData"
        :map-results="mapResults"
        :popup-max-width="popupMaxWidth"
        @clicked:searchButton="handleSearchBtnClick"
      />
    </MglMap>
  </v-card>
</template>

<script>
import "mapbox-gl/dist/mapbox-gl.css";
import Mapbox from "mapbox-gl";
import {
  MglMap,
  MglAttributionControl,
  MglNavigationControl,
  MglGeolocateControl,
  MglFullscreenControl,
  MglScaleControl
} from "v-mapbox";
import { mapActions, mapState } from "vuex";
import MglPopupWrapper from "@/components/front_page/MglPopupWrapper";

export default {
  name: "MapCard",

  components: {
    MglPopupWrapper,
    MglMap,
    MglAttributionControl,
    MglNavigationControl,
    MglGeolocateControl,
    MglFullscreenControl,
    MglScaleControl
  },

  data() {
    return {
      mapStyle: "https://map.geocase.eu/styles/geocase-heatmap/style.json",
      center: [15, 45],
      // center: [24.753, 59.437], // test
      zoom: 1.5,
      // zoom: 10.5, // test
      minZoom: 1,
      maxZoom: 19,
      popup: {
        closeOnClick: false,
        coordinates: [15, 45],
        anchor: "left",
        offset: [7, 0],
        maxWidth: "400px"
      },
      activePopupData: {
        id: null,
        lat: null,
        lng: null,
        locality: null
      }
    };
  },
  computed: {
    ...mapState("frontpage", ["mapResults"]),

    popupMaxWidth() {
      return this.$vuetify.breakpoint.smAndDown ? "250px" : "400px";
    }
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;

    // Storing map objects as non-reactive properties. (Docs suggested)
    this.map = null;
  },
  methods: {
    ...mapActions("frontpage", ["getLocalitySpecimens"]),

    onMapLoaded(event) {
      this.map = event.map;
      // resize() & addControl solve bug: rerender over full width
      this.$nextTick(() => this.map.resize());

      this.map.on("mouseenter", "geocase-distinct", this.setActivePopupData);
      this.map.on("mouseleave", "geocase-distinct", this.handleMouseLeave);
      this.map.on("click", "geocase-distinct", this.setActivePopupData);
    },

    handleMouseLeave() {
      this.map.getCanvas().style.cursor = "";
    },

    setActivePopupData(e) {
      console.log(e);
      console.log(this.$refs);
      if (e.type === "mouseenter")
        this.map.getCanvas().style.cursor = "pointer";

      const pointProperties = e?.features?.[0]?.properties;
      let coordinates = e?.features?.[0]?.geometry?.coordinates;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      this.popup.coordinates = coordinates;
      this.activePopupData = {
        id: pointProperties?.id,
        lat: pointProperties?.latitude,
        lng: pointProperties?.longitude,
        locality: pointProperties?.locality
      };

      this.$refs.popup.$children[0].open = true;
    },

    async handleSearchBtnClick() {
      if (
        this.activePopupData.id &&
        (!this.mapResults?.[this.activePopupData.id] ||
          !this.mapResults?.[this.activePopupData.id]?.numFound ||
          this.mapResults?.[this.activePopupData.id]?.numFound === 0)
      ) {
        await this.getLocalitySpecimens(this.activePopupData);
      }
    }
  }
};
</script>

<style>
.mgl-map-wrapper {
  height: 100%;
  position: relative;
  width: 100%;
}

.mgl-map-wrapper .mapboxgl-map {
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}

.mapboxgl-ctrl-scale {
  border: 2px solid #777;
  border-top: none;
  min-width: 55px;
}

.mapboxgl-popup-content {
  padding: 0;
}

.mapboxgl-popup-close-button {
  width: 25px;
  height: 20px;
}
</style>
