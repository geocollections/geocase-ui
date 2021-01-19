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

      <!-- Todo: Create a wrapper component -->
      <MglPopup
        ref="popup"
        :close-on-click="popup.closeOnClick"
        :anchor="popup.anchor"
        :offset="popup.offset"
        :coordinates="popup.coordinates"
        :max-width="popup.maxWidth"
      >
        <v-card>
          <v-card-title>{{ activePopupData.locality }}</v-card-title>
          <v-card-text class="pb-0">
            <div>Lat: {{ activePopupData.lat }}</div>
            <div>Long: {{ activePopupData.lng }}</div>
          </v-card-text>

          <v-card
            flat
            v-if="
              mapResults[activePopupData.id] &&
                mapResults[activePopupData.id].numFound > 0
            "
          >
            <v-card-title class="text-subtitle-1 pb-2">
              {{ $t("frontPage.map.numFound") }}
              <b class="ml-1">{{ mapResults[activePopupData.id].numFound }}</b>
            </v-card-title>

            <v-data-table
              disable-filtering
              disable-sort
              fixed-header
              height="200"
              dense
              :headers="[
                { text: '', value: 'icon' },
                { text: $t('search.table.unitid'), value: 'unitid' },
                {
                  text: $t('search.table.fullscientificname'),
                  value: 'fullscientificname'
                }
              ]"
              :items="mapResults[activePopupData.id].docs"
              :footer-props="{
                itemsPerPageOptions: [10, 25, 50, -1],
                itemsPerPageText: $t('frontPage.map.itemsPerPageText'),
                showFirstLastPage: true
              }"
            >
              <template v-slot:item.icon="{ item }">
                <router-link
                  class="icon-link"
                  style="text-decoration: unset;"
                  :to="{ path: `specimen/${item.id}` }"
                  :title="$t('search.goToDetailView')"
                >
                  <v-icon
                    small
                    color="primary"
                    v-if="getItemType(item) === 'fossil'"
                    >fas fa-fish</v-icon
                  >
                  <v-icon
                    small
                    color="primary"
                    v-else-if="getItemType(item) === 'mineral'"
                    >far fa-gem</v-icon
                  >
                  <v-icon
                    small
                    color="primary"
                    v-else-if="getItemType(item) === 'rock'"
                    >fas fa-mountain</v-icon
                  >
                  <v-icon
                    small
                    color="primary"
                    v-else-if="getItemType(item) === 'meteorite'"
                    >fas fa-meteor</v-icon
                  >
                </router-link>
              </template>

              <template v-slot:item.unitid="{ item }">
                <router-link
                  style="text-decoration: unset;"
                  :to="{ path: `specimen/${item.id}` }"
                  :title="$t('search.goToDetailView')"
                >
                  {{ item.unitid }}
                </router-link>
              </template>

              <template v-slot:item.fullscientificname="{ item }">
                <div v-if="item.mindat_id">
                  <a
                    style="text-decoration: unset; white-space: nowrap;"
                    target="MindatWindow"
                    :title="$t('search.mindatLink')"
                    @click="openMindatInNewWindow(item.mindat_url)"
                    >{{ item.fullscientificname }}
                    <v-icon small color="primary"
                      >fas fa-external-link-square-alt</v-icon
                    >
                  </a>
                </div>
                <div v-else>{{ item.fullscientificname }}</div>
              </template>
            </v-data-table>

            <!--            <v-simple-table-->
            <!--              v-if="-->
            <!--                mapResults[activePopupData.id].docs &&-->
            <!--                  mapResults[activePopupData.id].docs.length > 0-->
            <!--              "-->
            <!--              fixed-header-->
            <!--              height="200px"-->
            <!--              dense-->
            <!--            >-->
            <!--              <template v-slot:default>-->
            <!--                <thead>-->
            <!--                  <tr>-->
            <!--                    <th></th>-->
            <!--                    <th class="text-left">{{ $t("search.table.unitid") }}</th>-->
            <!--                    <th class="text-left">-->
            <!--                      {{ $t("search.table.fullscientificname") }}-->
            <!--                    </th>-->
            <!--                  </tr>-->
            <!--                </thead>-->
            <!--                <tbody>-->
            <!--                  <tr-->
            <!--                    v-for="(item, index) in mapResults[activePopupData.id].docs"-->
            <!--                    :key="index"-->
            <!--                  >-->
            <!--                    <td>-->
            <!--                      <router-link-->
            <!--                        class="icon-link"-->
            <!--                        style="text-decoration: unset;"-->
            <!--                        :to="{ path: `specimen/${item.id}` }"-->
            <!--                        :title="$t('search.goToDetailView')"-->
            <!--                      >-->
            <!--                        <v-icon-->
            <!--                          small-->
            <!--                          color="primary"-->
            <!--                          v-if="getItemType(item) === 'fossil'"-->
            <!--                          >fas fa-fish</v-icon-->
            <!--                        >-->
            <!--                        <v-icon-->
            <!--                          small-->
            <!--                          color="primary"-->
            <!--                          v-else-if="getItemType(item) === 'mineral'"-->
            <!--                          >far fa-gem</v-icon-->
            <!--                        >-->
            <!--                        <v-icon-->
            <!--                          small-->
            <!--                          color="primary"-->
            <!--                          v-else-if="getItemType(item) === 'rock'"-->
            <!--                          >fas fa-mountain</v-icon-->
            <!--                        >-->
            <!--                        <v-icon-->
            <!--                          small-->
            <!--                          color="primary"-->
            <!--                          v-else-if="getItemType(item) === 'meteorite'"-->
            <!--                          >fas fa-meteor</v-icon-->
            <!--                        >-->
            <!--                      </router-link>-->
            <!--                    </td>-->
            <!--                    <td>-->
            <!--                      <router-link-->
            <!--                        style="text-decoration: unset;"-->
            <!--                        :to="{ path: `specimen/${item.id}` }"-->
            <!--                        :title="$t('search.goToDetailView')"-->
            <!--                      >-->
            <!--                        {{ item.unitid }}-->
            <!--                      </router-link>-->
            <!--                    </td>-->
            <!--                    <td>-->
            <!--                      <div v-if="item.mindat_id">-->
            <!--                        <a-->
            <!--                          style="text-decoration: unset; white-space: nowrap;"-->
            <!--                          target="MindatWindow"-->
            <!--                          :title="$t('search.mindatLink')"-->
            <!--                          @click="openMindatInNewWindow(item.mindat_url)"-->
            <!--                          >{{ item.fullscientificname }}-->
            <!--                          <v-icon small color="primary"-->
            <!--                            >fas fa-external-link-square-alt</v-icon-->
            <!--                          >-->
            <!--                        </a>-->
            <!--                      </div>-->
            <!--                      <div v-else>{{ item.fullscientificname }}</div>-->
            <!--                    </td>-->
            <!--                  </tr>-->
            <!--                </tbody>-->
            <!--              </template>-->
            <!--            </v-simple-table>-->
          </v-card>

          <v-card-actions
            class="justify-end"
            v-if="
              !mapResults[activePopupData.id] ||
                mapResults[activePopupData.id].numFound === 0
            "
          >
            <v-btn small text color="primary" @click="handleSearchBtnClick"
              ><v-icon x-small class="mr-1">fas fa-search</v-icon
              >{{ $t("frontPage.map.search") }}</v-btn
            >
          </v-card-actions>
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

    onMapLoaded(event) {
      this.map = event.map;
      // resize() & addControl solve bug: rerender over full width
      this.$nextTick(() => this.map.resize());

      this.map.on("mouseenter", "geocase-distinct", this.handleMouseEnter);
      this.map.on("mouseleave", "geocase-distinct", this.handleMouseLeave);
      this.map.on("click", "geocase-distinct", this.handleMouseClick);
    },

    handleMouseEnter(e) {
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

      this.$refs.popup.open = true;
    },

    handleMouseLeave() {
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

    async handleSearchBtnClick() {
      if (
        this.activePopupData.id &&
        (!this.mapResults?.[this.activePopupData.id] ||
          !this.mapResults?.[this.activePopupData.id]?.numFound ||
          this.mapResults?.[this.activePopupData.id]?.numFound === 0)
      ) {
        await this.getLocalitySpecimens(this.activePopupData);
      }
      console.log(this.mapResults);
    },

    // Taken from TabTable.vue
    openMindatInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
    },

    // Taken from TabTable.vue
    /* Currently unused types aka unspecified
     * OtherSpecimen
     * Unspecified
     * specimen
     */
    getItemType(item) {
      let type = item.recordbasis;
      if (
        type === "FossileSpecimen" ||
        type === "FossilSpecimen" ||
        type === "RecentPreservedSpecimen" ||
        type === "fossil"
      ) {
        return "fossil";
      } else if (type === "MineralSpecimen") {
        return "mineral";
      } else if (
        type === "RockSpecimen" ||
        type === "SedimentSample" ||
        type === "TechnologicalSample"
      ) {
        return "rock";
      } else if (type === "MeteoriteSpecimen") {
        return "meteorite";
      } else "none";
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
