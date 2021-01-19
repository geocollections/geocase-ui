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
      :scroll-zoom="false"
      @load="onMapLoaded"
    >
      <MglAttributionControl position="bottom-right" />
      <MglNavigationControl position="top-right" />
      <MglGeolocateControl position="top-right" />
      <MglFullscreenControl position="top-right" />
      <MglScaleControl position="bottom-left" />

      <MglPopup
        ref="popup"
        :close-on-click="popup.closeOnClick"
        :anchor="popup.anchor"
        :offset="popup.offset"
        :coordinates="popup.coordinates"
        :max-width="popup.maxWidth"
        @open="openPopup"
        @close="closePopup"
      >
        <v-card>
          <v-card-title>Hello, I'm a popup!</v-card-title>
        </v-card>
      </MglPopup>
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
  MglScaleControl,
  MglPopup
} from "v-mapbox";
import { mapActions, mapState } from "vuex";

export default {
  name: "MapCard",

  components: {
    MglMap,
    MglAttributionControl,
    MglNavigationControl,
    MglGeolocateControl,
    MglFullscreenControl,
    MglScaleControl,
    MglPopup
  },

  data() {
    return {
      mapStyle: "https://map.geocase.eu/styles/geocase-heatmap/style.json",
      // center: [15, 45],
      center: [24.753, 59.437],
      // zoom: 1.5,
      zoom: 10.5,
      minZoom: 1,
      maxZoom: 19,
      popupDom: null,
      popup: {
        closeOnClick: false,
        coordinates: [15, 45],
        anchor: "bottom-left",
        offset: [5, -10],
        maxWidth: "400px"
      }
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
    this.mapboxPopup = new Mapbox.Popup({
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

    openPopup(e) {
      console.log(e);
    },

    closePopup(e) {
      console.log("closing popup");
    },

    onMapLoaded(event) {
      this.map = event.map;
      // resize() & addControl solve bug: rerender over full width
      this.$nextTick(() => this.map.resize());

      this.map.on("mouseenter", "geocase-distinct", this.handleMouseEnter);
      this.map.on("mouseleave", "geocase-distinct", this.handleMouseLeave);
      this.map.on("click", "geocase-distinct", this.handleMouseClick);
    },

    handleMouseEnter(e) {
      console.log("mouse enter");
      console.log(this.$refs.popup);
      this.$refs.popup.open = true;

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
        this.appendMapResults(popupData.id);

        // this.popupCoordinates = coordinates;

        // this.mapboxPopup
        //   .setLngLat(coordinates)
        //   .setDOMContent(this.popupDom)
        //   .addTo(this.map);
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
        if (
          !this.mapResults?.[data.id] ||
          !this.mapResults?.[data.id]?.numFound ||
          this.mapResults?.[data.id]?.numFound === 0
        ) {
          const searchButton = document.createElement("div");
          searchButton.id = "mapbox-gl-search-button";
          searchButton.className = "v-card__actions justify-end";
          searchButton.innerHTML = `<button type="button" class="v-btn v-btn--text theme--light v-size--small primary--text"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate mr-1 fas fa-search theme--light" style="font-size: 12px;"></i> ${this.$t(
            "frontPage.map.search"
          )} </span></button>`;

          popupElement.innerHTML = html;
          popupElement.appendChild(searchButton);

          searchButton.addEventListener("click", () =>
            this.handlePopupSearchBtn(data)
          );
        } else popupElement.innerHTML = html;
      }

      return popupElement;
    },

    async handlePopupSearchBtn(markerData) {
      console.log("search button click");
      console.log(markerData);
      await this.getLocalitySpecimens(markerData);
      this.appendMapResults(markerData.id);
    },

    appendMapResults(id) {
      if (this.mapResults?.[id]?.numFound) {
        const cardTextElement = document.createElement("div");
        cardTextElement.className = "v-card__text pt-0 px-0";
        cardTextElement.innerHTML = `<div class="px-4 pb-2 text-subtitle-1">${this.$t(
          "frontPage.map.numFound"
        )}: <b>${this.mapResults[id].numFound}</b></div>`;

        if (this.mapResults?.[id]?.docs) {
          const ulElement = document.createElement("ul");
          ulElement.style.cssText = "max-height:200px;overflow:auto;";
          this.mapResults?.[id]?.docs.forEach(item => {
            const liElement = document.createElement("li");
            liElement.innerHTML = `<a href="/specimen/${
              item.id
            }">${item.fullscientificname || item.id}</a>`;
            ulElement.appendChild(liElement);
          });
          cardTextElement.appendChild(ulElement);
          // num
        }

        this.popupDom.appendChild(cardTextElement);
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
  width: 15px;
}
</style>
