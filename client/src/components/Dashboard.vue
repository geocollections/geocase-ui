<template>
  <v-container fluid>
    <v-snackbar v-model="snackbar" color="error" style="z-index: 2500;">
      <div v-html="error"></div>
      <v-btn color="black" icon @click="snackbar = false">
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </v-snackbar>

    <ScrollToTop />

    <!-- DETAIL VIEW DIALOG -->
    <v-dialog
      fullscreen
      hide-overlay
      v-model="detailViewDialog"
      style="position: fixed; z-index: 10000;"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn
            icon
            dark
            @click="detailViewDialog = false"
            title="Close dialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Detail view (dialog)</v-toolbar-title>
          <v-spacer />
          <v-btn
            text
            dark
            @click="detailViewDialog = false"
            title="Close dialog"
          >
            Close
          </v-btn>
        </v-toolbar>

        <DetailView
          v-if="response !== null && response.numFound === 1"
          :id="response.docs[0].id"
          :data-from-search="response"
          is-dialog
        />
      </v-card>
    </v-dialog>

    <DetailSearch class="mb-3" v-if="false" />

    <v-card>
      <FastSearch />

      <!-- PAGINATION -->
      <v-row no-gutters class="pa-1" justify="center">
        <v-col cols="9" sm="4" md="3" lg="2" class="pa-1" align-self="center">
          <SelectWrapper
            :value="searchParameters.paginateBy"
            :items="paginateByItems"
            @change="paginateByChanged"
          />
        </v-col>

        <v-col cols="11" sm="8" md="9" lg="10" class="pa-1">
          <v-pagination
            v-if="response.numFound > 10"
            :value="searchParameters.page"
            :class="{ 'justify-end': $vuetify.breakpoint.smAndUp }"
            circle
            :length="Math.ceil(response.numFound / searchParameters.paginateBy)"
            :total-visible="$vuetify.breakpoint.smAndDown ? 5 : 7"
            @input="pageChanged"
          />
        </v-col>
      </v-row>

      <!-- NUM OF ITEMS -->
      <v-card-title class="py-1">
        <v-icon left color="primary" large v-if="tab === 0"
          >mdi-table-large</v-icon
        >
        <v-icon left color="primary" large v-else-if="tab === 1"
          >mdi-file-image-outline</v-icon
        >
        <v-icon left color="primary" large v-else>mdi-map-legend</v-icon>

        <span class="mr-1">{{ response.numFound }}</span>
        <span class="mr-1">{{
          `item${response.numFound === 1 ? "" : "s"}`
        }}</span>
        <span class="hidden-sm-and-up">{{
          `(page: ${searchParameters.page})`
        }}</span>
      </v-card-title>

      <v-tabs v-model="tab" grow show-arrows>
        <v-tab v-for="item in tabItems" :key="item">
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
  </v-container>
</template>

<script>
import DetailSearch from "./search/DetailSearch";
import debounce from "lodash/debounce";
import Table from "./tabs/Table";
import Images from "./tabs/Images";
import Map from "./tabs/Map";
import FastSearch from "./search/FastSearch";
import ScrollToTop from "./partial/ScrollToTop";
import SelectWrapper from "./input_wrappers/SelectWrapper";
import DetailView from "./DetailView";
import { mapActions, mapState } from "vuex";

export default {
  name: "Dashboard",

  components: {
    DetailView,
    SelectWrapper,
    ScrollToTop,
    FastSearch,
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
      "error",
      "snackbar",
      "response"
    ])
  },

  watch: {
    fastSearch(newVal) {
      this.updateSearchParameters({ ...this.searchParameters, page: 1 });
      if (
        this.searchParameters.sortBy.length === 1 &&
        this.searchParameters.sortBy[0] === "fullscientificname"
      ) {
        this.updateSearchParameters({ ...this.searchParameters, sortBy: [] });
      }
      if (
        this.searchParameters.sortDesc.length === 1 &&
        this.searchParameters.sortDesc[0] === false
      ) {
        this.updateSearchParameters({ ...this.searchParameters, sortDesc: [] });
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
          this.searchParameters.sortBy[0] === "fullscientificname"
        ) {
          this.updateSearchParameters({ ...this.searchParameters, sortBy: [] });
        }
        if (
          this.searchParameters.sortDesc.length === 1 &&
          this.searchParameters.sortDesc[0] === false
        ) {
          this.updateSearchParameters({
            ...this.searchParameters,
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
      this.detailViewDialog = newVal.numFound === 1;
    }
  },

  async created() {
    if (this.fastSearch === "" || this.response.numFound === 0) {
      await this.doFastSearch({
        fastSearch: "*",
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

<style scoped />
