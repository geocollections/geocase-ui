<template>
  <v-container fluid>
    <scroll-to-top />

    <div class="d-flex flex-column flex-lg-row justify-space-between">
      <div :class="{ 'main-search pr-3': $vuetify.breakpoint.lgAndUp }">
        <advanced-search-old class="mb-3" />
      </div>

      <div :class="{ 'main-table': $vuetify.breakpoint.lgAndUp }">
        <v-card>
          <!-- NUM OF ITEMS -->
          <v-card-title class="py-2 font-weight-bold" style="font-size: 1.5rem">
            <v-icon left color="primary" large v-if="tab === 0"
              >fas fa-table fa-2x</v-icon
            >
            <v-icon left color="primary" large v-else-if="tab === 1"
              >far fa-image</v-icon
            >
            <v-icon left color="primary" large v-else>far fa-map</v-icon>

            <span class="mr-1">{{ responseResultsCount }}</span>
            <span class="mr-1">{{
              `record${responseResultsCount === 1 ? "" : "s"} found`
            }}</span>
            <span class="hidden-sm-and-up">{{ `(page: ${page})` }}</span>
          </v-card-title>

          <!-- PAGINATION -->
          <pagination
            v-if="responseResultsCount > 10"
            :paginate-by="paginateBy"
            :paginate-by-items="paginateByItems"
            @update:paginateBy="updatePaginateBy($event)"
            :results="responseResults"
            :page="page"
            :number-of-results="responseResultsCount"
            @update:page="updatePage($event)"
          />

          <v-tabs
            v-model="tab"
            grow
            show-arrows
            slider-size="4"
            color="primary"
            active-class="amber lighten-5"
            background-color="grey lighten-5"
          >
            <v-tab
              class="font-weight-bold"
              style="color: #FFA000;"
              v-for="item in tabItems"
              :key="item"
            >
              {{ item }}
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
                  v-on:sortBy:changed="updateSortBy($event)"
                  v-on:sortDesc:changed="updateSortDesc($event)"
                />

                <tab-images
                  v-if="item === 'images'"
                  :response-results="responseResults"
                  :response-results-count="responseResultsCount"
                />

                <tab-map
                  v-if="item === 'map'"
                  :response-results="responseResults"
                  :response-results-count="responseResultsCount"
                />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import ScrollToTop from "@/components/partial/ScrollToTop";
import { mapActions, mapState } from "vuex";
import Pagination from "../components/search/Pagination";
import AdvancedSearchOld from "../components/search/AdvancedSearchOld";
import TabImages from "../components/tabs/TabImages";
import TabMap from "../components/tabs/TabMap";
import TabTable from "../components/tabs/TabTable";
import queryMixin from "../mixins/queryMixin";

export default {
  name: "Dashboard",

  components: {
    TabTable,
    TabMap,
    TabImages,
    AdvancedSearchOld,
    Pagination,
    ScrollToTop
  },

  mixins: [queryMixin],

  data: () => ({
    tab: null,
    tabItems: ["table", "images", "map"],
    searchDrawer: true
  }),

  computed: {
    ...mapState("search", [
      "responseResults",
      "responseResultsCount",
      "page",
      "paginateBy",
      "sortBy",
      "sortDesc",
      "paginateByItems"
    ])
  },

  created() {
    if (this.$route.query) {
      this.deconstructQueryParams(this.$route.query);
      this.search();
    }
  },

  watch: {
    "$route.query"() {
      this.search();
    },
    page(newVal) {
      this.constructQueryParams(null, { page: newVal.toString() });
    },
    paginateBy(newVal) {
      if (this.page !== 1) {
        this.constructQueryParams(null, {
          paginate_by: newVal,
          page: 1
        });
      } else
        this.constructQueryParams(null, { paginate_by: newVal.toString() });
    },
    sortDesc(newVal) {
      this.constructQueryParams(null, {
        sort_desc: newVal,
        sort_by: this.sortBy
      });
    }
  },

  methods: {
    ...mapActions("search", [
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "search"
    ])
  }
};
</script>

<style scoped>
.main-search {
  min-width: 300px;
}

.main-table {
  /* search width 300px + 3 x padding (12px) = 336px */
  min-width: calc(100vw - 336px);
}
</style>
