<template>
  <v-container fluid>
    <ScrollToTop />

    <OpenFilters />

    <v-card flat>
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
    </v-card>
  </v-container>
</template>

<script>
import ScrollToTop from "@/components/partial/ScrollToTop";
import { mapActions, mapState } from "vuex";
import OpenFilters from "@/components/partial/OpenFilters";
import queryMixin from "@/mixins/queryMixin";
import Pagination from "@/components/search/Pagination";
import TabImages from "@/components/partial/tabs/TabImages";
import TabMap from "@/components/partial/tabs/TabMap";
import TabTable from "@/components/partial/tabs/TabTable";

export default {
  name: "Search",

  components: {
    OpenFilters,
    TabTable,
    TabMap,
    TabImages,
    Pagination,
    ScrollToTop
  },

  mixins: [queryMixin],

  data: () => ({
    tab: null,
    tabItems: ["table", "images", "map"]
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

<style scoped></style>
