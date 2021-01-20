<template>
  <MglPopup
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
          :hide-default-footer="mapResults[activePopupData.id].numFound <= 10"
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
      </v-card>

      <v-card-actions
        class="justify-end"
        v-if="
          !mapResults[activePopupData.id] ||
            mapResults[activePopupData.id].numFound === 0
        "
      >
        <v-btn small text color="primary" @click="$emit('clicked:searchButton')"
          ><v-icon x-small class="mr-1">fas fa-search</v-icon
          >{{ $t("frontPage.map.search") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </MglPopup>
</template>

<script>
import { MglPopup } from "v-mapbox";
export default {
  name: "MglPopupWrapper",
  components: { MglPopup },
  props: {
    popup: {
      type: Object,
      required: true
    },
    activePopupData: {
      type: Object,
      required: true
    },
    mapResults: {
      type: Object,
      required: true
    }
  },
  methods: {
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

<style scoped></style>
