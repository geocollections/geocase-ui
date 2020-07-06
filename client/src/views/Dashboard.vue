<template>
  <v-container fluid>
    <ScrollToTop />

    <div class="d-flex flex-column flex-md-row justify-space-between">
      <div :class="{ 'main-search pr-3': $vuetify.breakpoint.mdAndUp }">
        <DetailSearch class="mb-3" />
      </div>

      <div :class="{ 'main-table': $vuetify.breakpoint.mdAndUp }">
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

            <span class="mr-1">{{ response.numFound }}</span>
            <span class="mr-1">{{
              `record${response.numFound === 1 ? "" : "s"} found`
            }}</span>
            <span class="hidden-sm-and-up">{{
              `(page: ${searchParameters.page})`
            }}</span>
          </v-card-title>

          <!-- PAGINATION -->
          <Pagination
            v-if="response && response.numFound"
            :paginate-by="searchParameters.paginateBy"
            :paginate-by-items="paginateByItems"
            @update:paginateBy="paginateByChanged"
            :results="response.docs"
            :page="searchParameters.page"
            :number-of-results="response.numFound"
            @update:page="pageChanged"
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
                <Table
                  v-if="item === 'table'"
                  :response="response"
                  :search-parameters="searchParameters"
                  v-on:sortBy:changed="sortByChanged"
                  v-on:sortDesc:changed="sortDescChanged"
                />

                <Images v-if="item === 'images'" :response="response" />

                <Map v-if="item === 'map'" :response="response" />
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import DetailSearch from "@/components/search/DetailSearch";
import debounce from "lodash/debounce";
import Table from "@/components/tabs/Table";
import Images from "@/components/tabs/Images";
import Map from "@/components/tabs/Map";
import ScrollToTop from "@/components/partial/ScrollToTop";
import { mapActions, mapState } from "vuex";
import Pagination from "../components/search/Pagination";

export default {
  name: "Dashboard",

  components: {
    Pagination,
    ScrollToTop,
    Map,
    Images,
    Table,
    DetailSearch
  },

  data: () => ({
    tab: null,
    tabItems: ["table", "images", "map"],
    detailViewDialog: false
  }),

  computed: {
    ...mapState("search", [
      "detailSearch",
      "fastSearch",
      "searchParameters",
      "paginateByItems",
      "response"
    ])
  },

  watch: {
    fastSearch(newVal) {
      this.updateSearchParameters({ ...this.searchParameters, page: 1 });
      if (
        this.searchParameters.sortBy.length === 1 &&
        this.searchParameters.sortBy[0] === "fullscientificname" &&
        this.searchParameters.sortDesc[0] === false
      ) {
        this.updateSearchParameters({
          ...this.searchParameters,
          sortBy: [],
          sortDesc: []
        });
      }

      this.doFastSearch({
        fastSearch: newVal,
        page: this.searchParameters.page,
        paginateBy: this.searchParameters.paginateBy,
        sortBy: this.searchParameters.sortBy,
        sortDesc: this.searchParameters.sortDesc
      });
    },

    detailSearch: {
      handler(newVal) {
        this.updateSearchParameters({ ...this.searchParameters, page: 1 });
        if (
          this.searchParameters.sortBy.length === 1 &&
          this.searchParameters.sortBy[0] === "fullscientificname" &&
          this.searchParameters.sortDesc[0] === false
        ) {
          this.updateSearchParameters({
            ...this.searchParameters,
            sortBy: [],
            sortDesc: []
          });
        }

        this.doDetailSearch({
          detailSearch: newVal,
          page: this.searchParameters.page,
          paginateBy: this.searchParameters.paginateBy,
          sortBy: this.searchParameters.sortBy,
          sortDesc: this.searchParameters.sortDesc
        });
      },
      deep: true
    },

    response(newVal) {
      if (newVal && newVal.numFound) {
        this.detailViewDialog = newVal.numFound === 1;
      }
    }
  },

  async created() {
    if (
      this.fastSearch === "" &&
      this.response &&
      this.response.numFound &&
      this.response.numFound === 0
    ) {
      await this.doFastSearch({
        fastSearch: "*",
        page: this.searchParameters.page,
        paginateBy: this.searchParameters.paginateBy,
        sortBy: this.searchParameters.sortBy,
        sortDesc: this.searchParameters.sortDesc
      });
    } else {
      await this.doFastSearch({
        fastSearch: this.fastSearch,
        page: this.searchParameters.page,
        paginateBy: this.searchParameters.paginateBy,
        sortBy: this.searchParameters.sortBy,
        sortDesc: this.searchParameters.sortDesc
      });
    }
  },

  methods: {
    ...mapActions("search", ["updateSearchParameters", "updateSearch"]),

    doDetailSearch: debounce(async function(searchParams) {
      this.updateSearch({ params: searchParams, type: "detail" });
    }, 0),

    doFastSearch: debounce(async function(searchParams) {
      this.updateSearch({ params: searchParams, type: "fast" });
    }, 0),

    updateSearchQuery: debounce(async function(searchParams) {
      searchParams.fastSearch = this.fastSearch;
      searchParams.detailSearch = this.detailSearch;
      this.updateSearch({ params: searchParams, type: "update" });
    }, 10),

    pageChanged(newPage) {
      this.updateSearchParameters({ ...this.searchParameters, page: newPage });
      this.updateSearchQuery(this.searchParameters);
    },

    paginateByChanged(newPaginateBy) {
      this.updateSearchParameters({
        ...this.searchParameters,
        page: 1,
        paginateBy: newPaginateBy
      });
      this.updateSearchQuery(this.searchParameters);
    },

    sortByChanged(newSortBy) {
      this.updateSearchParameters({
        ...this.searchParameters,
        sortBy: newSortBy
      });
      this.updateSearchQuery(this.searchParameters);
    },

    sortDescChanged(newSortDesc) {
      this.updateSearchParameters({
        ...this.searchParameters,
        sortDesc: newSortDesc
      });
      this.updateSearchQuery(this.searchParameters);
    }
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
