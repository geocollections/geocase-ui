<template>
  <v-container fluid class="px-4">
    <ScrollToTop />

    <v-card flat>
      <!-- NUM OF ITEMS -->
      <v-card-title
        class="py-2 font-weight-bold records-found"
        style="font-size: 1.5rem"
      >
        <span class="mr-1">{{
          responseResultsCount ? responseResultsCount.toLocaleString() : 0
        }}</span>
        <span class="mr-1">{{
          $tc("search.recordsFound", responseResultsCount)
        }}</span>
        <span class="hidden-sm-and-up">{{ `(page: ${page})` }}</span>
      </v-card-title>

      <v-tabs
        v-model="tab"
        class="search-tabs"
        grow
        show-arrows
        slider-size="3"
        color="black"
        active-class="amber lighten-3 border-bottom"
        background-color="amber lighten-5"
        hide-slider
      >
        <v-tab
          class="font-weight-bold"
          style="color: #000; font-size: 1rem"
          v-for="item in tabItems"
          :key="item"
        >
          {{ $t(`search.tab.${item}`) }}
          <v-icon color="black" right small v-if="item === 'table'"
            >fas fa-table</v-icon
          >
          <v-icon color="black" right small v-else-if="item === 'images'"
            >far fa-image</v-icon
          >
          <v-icon color="black" right small v-else>far fa-map</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" touchless>
        <v-tab-item v-for="item in tabItems" :key="item">
          <v-card flat>
            <tab-table
              v-if="item === 'table'"
              :response-results="responseResults"
              :response-results-count="responseResultsCount"
              :page="page"
              :paginate-by="paginateBy"
              :sort-by="sortBy"
              :sort-desc="sortDesc"
              :is-loading="isLoading"
              :tabIndex="tab"
              v-on:sortBy:changed="updateSortBy($event)"
              v-on:sortDesc:changed="updateSortDesc($event)"
              @update:page="updatePage($event)"
              @update:paginateBy="updatePaginateBy($event)"
              @open:gallery="openGallery"
            />

            <tab-images
              ref="imageTab"
              v-if="item === 'images'"
              :response-results="responseResults"
              :response-results-count="responseResultsCount"
            />

            <tab-map
              ref="map"
              v-if="item === 'map'"
              :response-results="responseResults"
              :response-results-count="responseResultsCount"
            />
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <!-- PAGINATION -->
      <pagination
        v-if="tab === 1 && responseResultsCount > 10"
        :paginate-by="paginateBy"
        :paginate-by-items="paginateByItemsTranslated"
        @update:paginateBy="updatePaginateBy($event)"
        :results="responseResults"
        :page="page"
        :number-of-results="responseResultsCount"
        @update:page="updatePage($event)"
      />
    </v-card>
  </v-container>
</template>

<script>
import ScrollToTop from "@/components/ScrollToTop";
import { mapActions, mapGetters, mapState } from "vuex";
import queryMixin from "@/mixins/queryMixin";
import Pagination from "@/components/search/Pagination";
import TabImages from "@/components/tabs/TabImages";
import TabMap from "@/components/tabs/TabMap";
import TabTable from "@/components/tabs/TabTable";
import { debounce } from "lodash";

export default {
  name: "Search",

  components: {
    TabTable,
    TabMap,
    TabImages,
    Pagination,
    ScrollToTop,
  },

  mixins: [queryMixin],

  metaInfo: {
    title: "Search",
  },

  data: () => ({
    tab: null,
    tabItems: ["table", "images", "map"],
  }),

  computed: {
    ...mapState("search", [
      "responseResults",
      "responseResultsCount",
      "page",
      "paginateBy",
      "sortBy",
      "sortDesc",
      "isLoading",
    ]),
    // ...mapState("searchMap", ["mapResults", "mapResultsCount"]),
    ...mapGetters("search", ["paginateByItemsTranslated"]),
  },

  created() {
    if (this.$route.query) {
      this.deconstructQueryParams(this.$route.query);
      this.search();
      // if (this.mapResultsCount === 0) this.searchMapCoordinates();
    }
  },

  watch: {
    "$route.query"(newVal, oldVal) {
      if (newVal[0] || JSON.stringify(newVal) !== JSON.stringify(oldVal))
        this.search();
    },
    page: debounce(function (newVal) {
      this.constructQueryParams(null, { page: newVal.toString() });
    }, 300),
    paginateBy: debounce(function (newVal) {
      this.constructQueryParams(null, { paginate_by: newVal.toString() });
    }, 300),
    sortDesc: debounce(function (newVal) {
      this.constructQueryParams(null, {
        sort_desc: newVal,
        sort_by: this.sortBy,
      });
    }, 300),
    tab(newVal) {
      if (newVal === 2 && !!this.$refs?.map?.[0]?.map) {
        setTimeout(() => {
          this.$refs.map[0].map.invalidateSize();
        }, 100);
      }
    },
  },

  methods: {
    ...mapActions("search", [
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "search",
    ]),

    // ...mapActions("searchMap", ["searchMapCoordinates"]),

    async openGallery(image) {
      this.tab = 1;
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.$refs.imageTab[0].openDialogUsingImage(image);
    },

    updateSearchParamDebounced: debounce(function (action, value) {
      action(value);
    }, 300),
  },
};
</script>

<style scoped>
.v-tab.border-bottom.v-tab--active {
  border: none !important;
  border-bottom: solid 3px black !important;
}
</style>
