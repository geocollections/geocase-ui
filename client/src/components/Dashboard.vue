<template>
  <v-container fluid>
    <v-snackbar v-model="snackbar" :timeout="2000" color="error">
      {{ error }}
      <v-btn color="blue" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>

    <ScrollToTop />

    <DetailSearch v-on:detailSearch:changed="detailSearch" />

    <v-card class="mt-3">
      <FastSearch v-on:fastSearch:changed="fastSearch" />

      <v-tabs v-model="tab" grow show-arrows>
        <v-tab v-for="item in tabItems" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in tabItems" :key="item">
          <v-card flat>
            <v-row no-gutters class="pa-1" justify="center">
              <v-col cols="9" sm="4" md="3" lg="2" class="pa-1">
                <SelectWrapper
                  v-model="searchParameters.paginateBy"
                  :items="paginateByItems"
                  @change="searchParameters.page = 1"
                />
              </v-col>

              <v-col cols="11" sm="8" md="9" lg="10" class="pa-1">
                <v-pagination
                  v-if="response.numFound > 10"
                  v-model="searchParameters.page"
                  :class="{ 'justify-end': $vuetify.breakpoint.smAndUp }"
                  circle
                  :length="
                    Math.ceil(response.numFound / searchParameters.paginateBy)
                  "
                  :total-visible="$vuetify.breakpoint.smAndDown ? 5 : 7"
                />
              </v-col>
            </v-row>

            <Table
              v-show="item === 'table'"
              :response="response"
              :search-parameters="searchParameters"
            />

            <Images
              v-if="item === 'images'"
              :response="response"
              :search-parameters="searchParameters"
            />

            <Map v-show="item === 'map'" :response="response" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import DetailSearch from "./search/DetailSearch";
import debounce from "lodash/debounce";
import SearchService from "../middleware/SearchService";
import Table from "./tabs/Table";
import Images from "./tabs/Images";
import Map from "./tabs/Map";
import FastSearch from "./search/FastSearch";
import ScrollToTop from "./partial/ScrollToTop";
import SelectWrapper from "./input_wrappers/SelectWrapper";

export default {
  name: "Dashboard",

  components: {
    SelectWrapper,
    ScrollToTop,
    FastSearch,
    Map,
    Images,
    Table,
    DetailSearch
  },

  data: () => ({
    response: {
      numFound: 0,
      docs: []
    },
    error: "",
    snackbar: false,
    tab: null,
    tabItems: ["table", "images", "map"],
    searchParameters: {
      page: 1,
      paginateBy: 50,
      sortBy: ["fullscientificname"],
      sortDesc: [false]
    },
    paginateByItems: [
      { text: "Paginate by 10", value: 10 },
      { text: "Paginate by 25", value: 25 },
      { text: "Paginate by 50", value: 50 },
      { text: "Paginate by 100", value: 100 },
      { text: "Paginate by 250", value: 250 },
      { text: "Paginate by 500", value: 500 },
      { text: "Paginate by 1000", value: 1000 }
    ]
  }),

  watch: {
    searchParameters: {
      handler(newVal) {
        this.updateSearchQuery(newVal);
      },
      deep: true
    },

    tab(newVal) {
      if (newVal === 1) this.fastSearch({ fastSearch: "url:*", appendSearch: true });
      else this.fastSearch({ fastSearch: "*" });
    }
  },

  // async created() {
  //   if (this.tab === 1) await this.fastSearch({ fastSearch: "url:*" });
  //   else await this.fastSearch({ fastSearch: "*" });
  // },

  methods: {
    detailSearch: debounce(async function(searchParams) {
      searchParams.page = this.searchParameters.page;
      searchParams.paginateBy = this.searchParameters.paginateBy;
      searchParams.sortyBy = this.searchParameters.sortyBy;
      searchParams.sortDesc = this.searchParameters.sortDesc;

      try {
        const response = await SearchService.getDetailSearch(searchParams);
        if (response) this.response = response.response;
      } catch (err) {
        this.error = err.message;
      }
    }, 500),

    fastSearch: debounce(async function(searchParams) {
      searchParams.page = this.searchParameters.page;
      searchParams.paginateBy = this.searchParameters.paginateBy;
      searchParams.sortyBy = this.searchParameters.sortyBy;
      searchParams.sortDesc = this.searchParameters.sortDesc;

      if (this.tab === 1) searchParams.fastSearch += "AND url:*";

      try {
        const response = await SearchService.getFastSearch(searchParams);
        if (response) this.response = response.response;
      } catch (err) {
        this.error = err.message;
      }
    }, 500),

    updateSearchQuery: debounce(async function(searchParams) {
      try {
        const response = await SearchService.updateSearchQuery(searchParams);
        if (response) this.response = response.response;
      } catch (err) {
        this.error = err.message;
      }
    }, 500)
  }
};
</script>

<style scoped></style>
