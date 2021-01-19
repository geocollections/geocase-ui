<template>
  <v-card height="100%">
    <MglMap
      container="map"
      :mapStyle.sync="mapStyle"
      :zoom.sync="zoom"
      :minZoom.sync="minZoom"
      :maxZoom.sync="maxZoom"
      :center.sync="center"
      :scroll-zoom="false"
      @load="onMapLoaded"
    >
    </MglMap>
  </v-card>
</template>

<script>
import Mapbox from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MglMap } from "vue-mapbox";
import { mapActions, mapState } from "vuex";

export default {
  name: "MapCard",
  components: {
    MglMap
  },
  data() {
    return {
      mapStyle: "https://map.geocase.eu/styles/geocase-heatmap/style.json",
      center: [15, 45],
      // zoom: 1.5,
      zoom: 10.5,
      minZoom: 1,
      maxZoom: 19,
      popupDom: null
    };
  },
  computed: {
    ...mapState("frontpage", ["mapResults"])
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;

    // Storing map objects as non-reactive properties. (Docs suggested)
    this.map = null;
    this.mapboxPopup = this.mapboxPopup = new Mapbox.Popup({
      closeOnClick: false,
      closeOnMove: true,
      focusAfterOpen: false,
      anchor: "bottom-left",
      offset: [5, -10],
      maxWidth: "400px"
    });
  },
  methods: {
    ...mapActions("frontpage", ["getLocalitySpecimens"]),

    onMapLoaded(event) {
      this.map = event.map;
      // resize() & addControl solve bug: rerender over full width
      this.map.resize();
      this.map.addControl(new Mapbox.NavigationControl(), "top-right");
      this.map.addControl(new Mapbox.FullscreenControl(), "top-right");
      this.map.addControl(new Mapbox.ScaleControl(), "bottom-left");

      this.map.on("mouseenter", "geocase-distinct", this.handleMouseEnter);
      this.map.on("mouseleave", "geocase-distinct", this.handleMouseLeave);
      this.map.on("click", "geocase-distinct", this.handleMouseClick);
    },

    handleMouseEnter(e) {
      console.log("mouse enter");

      this.map.getCanvas().style.cursor = "pointer";
      const pointProperties = e?.features?.[0]?.properties;
      let coordinates = e?.features?.[0]?.geometry?.coordinates;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      if (pointProperties?.latitude && pointProperties?.longitude) {
        const popupData = {
          id: pointProperties?.id,
          lat: pointProperties?.latitude,
          lng: pointProperties?.longitude,
          locality: pointProperties?.locality
        };

        this.popupDom = this.buildDefaultPopupDOM(popupData);

        this.mapboxPopup
          .setLngLat(coordinates)
          .setDOMContent(this.popupDom)
          .addTo(this.map);
      }
    },

    handleMouseLeave() {
      console.log("mouse leave");
      this.map.getCanvas().style.cursor = "";
    },

    handleMouseClick(e) {
      console.log("mouse click");

      const pointProperties = e?.features?.[0]?.properties;
      if (pointProperties?.latitude && pointProperties?.longitude) {
        const [id, lat, lng, locality] = [
          pointProperties?.id,
          pointProperties?.latitude,
          pointProperties?.longitude,
          pointProperties?.locality
        ];
        console.log(id);
        console.log(lat);
        console.log(lng);
        console.log(locality);
      }
    },

    buildDefaultPopupDOM(data) {
      const popupElement = document.createElement("div");

      let html = "";
      if (data?.locality)
        html += `<div class='v-card__title'>${data.locality}</div>`;
      if (data?.lat && data?.lng)
        html += `<div class="v-card__text"><div>Lat: ${data.lat}</div><div>Long: ${data.lng}</div></div>`;

      if (data) {
        // html += `<div class="v-card__actions justify-end"></div>`;

        const searchButton = document.createElement("div");
        searchButton.className = "v-card__actions justify-end";

        searchButton.innerHTML = `<button type="button" class="v-btn v-btn--text theme--light v-size--small primary--text"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate mr-1 fas fa-search theme--light" style="font-size: 12px;"></i> ${this.$t(
          "frontPage.map.search"
        )} </span></button>`;
        popupElement.innerHTML = html;
        popupElement.appendChild(searchButton);

        searchButton.addEventListener("click", () =>
          this.handlePopupSearchBtn(data)
        );
      }

      return popupElement;
    },

    // Todo: Fetch data
    async handlePopupSearchBtn(markerData) {
      console.log("search button click");
      console.log(markerData);
      await this.getLocalitySpecimens(markerData);
      console.log("test");
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

.mapboxgl-popup-content {
  padding: 0;
}

.mapboxgl-popup-close-button {
  width: 15px;
}
</style>
