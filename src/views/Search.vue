<template>
  <v-container fluid class="px-4">
    <ScrollToTop />

    <v-card flat>
      <!-- NUM OF ITEMS -->
      <v-card-title
        class="py-2 font-weight-bold records-found"
        style="font-size: 1.5rem"
      >
        <span class="mr-1" v-if="responseResultsCount">{{
          responseResultsCount.toLocaleString()
        }}</span>
        <span class="mr-1">{{
          `record${responseResultsCount === 1 ? "" : "s"} found`
        }}</span>
        <span class="hidden-sm-and-up">{{ `(page: ${page})` }}</span>
      </v-card-title>

      <v-tabs
        v-model="tab"
        grow
        show-arrows
        slider-size="3"
        color="black"
        active-class="amber lighten-3"
        background-color="amber lighten-5"
      >
        <v-tab
          class="font-weight-bold"
          style="color: #000; font-size: 1rem;"
          v-for="item in tabItems"
          :key="item"
        >
          {{ item }}
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
            />

            <tab-images
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
import queryMixin from "@/mixins/queryMixin";
import Pagination from "@/components/search/Pagination";
import TabImages from "@/components/partial/tabs/TabImages";
import TabMap from "@/components/partial/tabs/TabMap";
import TabTable from "@/components/partial/tabs/TabTable";

export default {
  name: "Search",

  components: {
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
      "paginateByItems",
      "isLoading"
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
    },
    tab(newVal) {
      if (newVal === 2 && this.$refs?.map?.map) {
        setTimeout(() => {
          this.$refs.map[0].map.invalidateSize();
        }, 100);
      }
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
