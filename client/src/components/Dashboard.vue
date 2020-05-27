<template>
  <v-container>
    <PrototypeAlert v-if="false" />

    <ScrollToTop />

    <DetailViewDialog
      v-if="false"
      v-model="detailViewDialog"
      v-on:update:dialogState="detailViewDialog = $event"
    />

    <DetailSearch class="mb-3" />

    <v-card>
      <FastSearch v-if="false" />

      <!-- PAGINATION -->
      <v-row
        no-gutters
        class="pa-1"
        justify="center"
        v-if="response.numFound > 10"
      >
        <v-col cols="9" sm="4" md="3" lg="2" class="pa-1" align-self="center">
          <SelectWrapper
            :value="searchParameters.paginateBy"
            :items="paginateByItems"
            @change="paginateByChanged"
          />
        </v-col>

        <v-col cols="11" sm="8" md="9" lg="10" class="pa-1">
          <v-pagination
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
import { mapActions, mapState } from "vuex";
import DetailViewDialog from "./partial/DetailViewDialog";
import PrototypeAlert from "./partial/PrototypeAlert";

export default {
  name: "Dashboard",

  components: {
    PrototypeAlert,
    DetailViewDialog,
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
      this.detailViewDialog = newVal.numFound === 1;
    }
  },

  async created() {
    if (this.fastSearch === "" && this.response.numFound === 0) {
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

<style scoped></style>
