<template>
  <v-card :max-width="popupMaxWidth">
    <v-card-title>{{ activePopupData.locality }}</v-card-title>
    <v-card-text class="pb-0">
      <div>Lat: {{ activePopupData.lat }}</div>
      <div>Long: {{ activePopupData.lng }}</div>
    </v-card-text>

    <v-card :max-width="popupMaxWidth" flat v-if="activeNumFound">
      <v-card-title class="text-subtitle-1 pb-2 text-no-wrap">
        {{ $t("frontPage.map.numFound") }}
        <b class="ml-1">{{ activeNumFound }}</b>
      </v-card-title>

      <v-data-table
        disable-filtering
        :hide-default-footer="activeNumFound <= 10"
        disable-sort
        fixed-header
        height="200"
        density="compact"
        mobile-breakpoint="100"
        :headers="[
          { title: '', key: 'icon' },
          { title: $t('search.table.unitid'), key: 'unitid' },
          {
            title: $t('search.table.fullscientificname'),
            key: 'fullscientificname',
          },
        ]"
        :items="activeDocs"
        :footer-props="{
          itemsPerPageOptions: [10, 25, 50, -1],
          itemsPerPageText: $t('frontPage.map.itemsPerPageText'),
          showFirstLastPage: true,
        }"
      >
        <template v-slot:item.icon="{ item }">
          <NuxtLink
            class="icon-link"
            style="text-decoration: unset"
            :to="{ path: `specimen/${encodeURIComponent(item.geocase_id)}` }"
            :title="$t('search.goToDetailView')"
          >
            <v-icon
              size="small"
              color="primary"
              v-if="getItemType(item) === 'fossil'"
              >fa:fas fa-fish</v-icon
            >
            <v-icon
              size="small"
              color="primary"
              v-else-if="getItemType(item) === 'mineral'"
              >fa:far fa-gem</v-icon
            >
            <v-icon
              size="small"
              color="primary"
              v-else-if="getItemType(item) === 'rock'"
              >fa:fas fa-mountain</v-icon
            >
            <v-icon
              size="small"
              color="primary"
              v-else-if="getItemType(item) === 'meteorite'"
              >fa:fas fa-meteor</v-icon
            >
          </NuxtLink>
        </template>

        <template v-slot:item.unitid="{ item }">
          <NuxtLink
            style="text-decoration: unset"
            :to="{ path: `specimen/${encodeURIComponent(item.geocase_id)}` }"
            :title="$t('search.goToDetailView')"
          >
            {{ item.unitid }}
          </NuxtLink>
        </template>

        <template v-slot:item.fullscientificname="{ item }">
          <div v-if="item.mindat_id">
            <a
              style="text-decoration: unset; white-space: nowrap"
              target="MindatWindow"
              :title="$t('search.mindatLink')"
              @click="openMindatInNewWindow(item.mindat_url)"
              >{{ item.fullscientificname }}
              <v-icon size="small" color="primary"
                >fa:fas fa-external-link-square-alt</v-icon
              >
            </a>
          </div>
          <div v-else>{{ item.fullscientificname }}</div>
        </template>
      </v-data-table>
    </v-card>

    <v-card-actions class="justify-end" v-if="activeNumFound === 0">
      <v-btn
        size="small"
        variant="text"
        color="primary"
        @click="$emit('clicked:searchButton')"
        ><v-icon size="x-small" class="mr-1">fa:fas fa-search</v-icon
        >{{ $t("frontPage.map.search") }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: "MglPopupWrapper",
  props: {
    popup: {
      type: Object,
      required: true,
    },
    activePopupData: {
      type: Object,
      required: true,
    },
    mapResults: {
      type: Object,
      required: true,
    },
    popupMaxWidth: {
      type: String,
      required: false,
      default: "400px",
    },
  },
  computed: {
    activeNumFound() {
      return this.mapResults?.[this.activePopupData?.id]?.numFound || 0;
    },

    activeDocs() {
      return this.mapResults?.[this.activePopupData?.id]?.docs || [];
    },
  },
  methods: {
    openMindatInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
    },

    getItemType(item) {
      let type = item.recordbasis;
      if (type === "Fossil") {
        return "fossil";
      } else if (type === "Mineral") {
        return "mineral";
      } else if (type === "Rock") {
        return "rock";
      } else if (type === "Meteorite") {
        return "meteorite";
      } else return "none";
    },
  },
};
</script>
<style scoped></style>
