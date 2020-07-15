<template>
  <v-card flat>
    <v-data-table
      class="table mt-3"
      mobile-breakpoint="0"
      dense
      hide-default-footer
      :headers="headers"
      :items="responseResults"
      :items-per-page="paginateBy"
      multi-sort
      :page="page"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @update:sort-by="$emit('sortBy:changed', $event)"
      @update:sort-desc="$emit('sortDesc:changed', $event)"
      :server-items-length="responseResultsCount"
    >
      <template v-slot:no-data>
        <v-row class="mx-0" justify="center">
          <v-col cols="12" style="max-width: 500px;">
            <v-alert
              class="mb-0"
              text
              border="left"
              icon="fas fa-search"
              color="secondary"
            >
              Couldn't find any records with these search parameters.
            </v-alert>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item.icon="{ item }">
        <router-link
          class="icon-link"
          style="text-decoration: unset;"
          :to="{ path: `detail/${item.id}` }"
          title="Go to detail view"
        >
          <v-icon small color="primary" v-if="getItemType(item) === 'fossil'"
            >fas fa-fish</v-icon
          >
          <v-icon
            small
            color="primary"
            v-else-if="getItemType(item) === 'mineral'"
            >far fa-gem</v-icon
          >
          <v-icon small color="primary" v-else-if="getItemType(item) === 'rock'"
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
          :to="{ path: `detail/${item.id}` }"
          title="Go to detail view"
        >
          {{ item.unitid }}
        </router-link>
      </template>

      <template v-slot:item.fullscientificname="{ item }">
        <div v-if="item.mindat_id">
          <a
            style="text-decoration: unset; white-space: nowrap;"
            target="MindatWindow"
            title="Link to Mindat.org"
            @click="openMindatInNewWindow(item.mindat_url)"
            >{{ item.fullscientificname }}
            <v-icon small color="primary"
              >fas fa-external-link-square-alt</v-icon
            >
          </a>
        </div>
        <div v-else>{{ item.fullscientificname }}</div>
      </template>

      <template v-slot:item.recordURI="{ item }">
        <v-btn
          v-if="item.recordURI"
          icon
          :title="item.recordURI"
          :href="item.recordURI"
          target="RecordWindow"
          color="primary"
        >
          <v-icon>fas fa-external-link-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.url="{ item }">
        <v-card
          v-if="item.url"
          flat
          class="my-3 image-hover"
          hover
          :to="{ path: `detail/${item.id}` }"
          title="Go to detail view"
        >
          <v-img
            max-height="200"
            max-width="200"
            contain
            :src="item.url"
            :lazy-src="item.url"
            class="transparent"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "TabTable",
  props: {
    responseResults: {
      type: Array,
      required: true
    },
    responseResultsCount: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    paginateBy: {
      type: Number,
      required: true
    },
    sortBy: {
      type: Array,
      required: true
    },
    sortDesc: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    headers: [
      // { text: "ID", value: "id" },
      // { text: "Multimedia", value: "url" },
      { text: "", value: "icon", sortable: false },
      { text: "Collection", value: "collectioncode" },
      { text: "Object ID", value: "unitid" },
      // { text: "Gathering Date", value: "" },
      // { text: "Collector Number", value: "" },
      // { text: "Domain", value: "" },
      { text: "Group", value: "highertaxon" },
      { text: "Name", value: "fullscientificname" },
      // { text: "Genus or Monomial", value: "" },
      // { text: "Taxon Rank", value: "" },
      // { text: "Infrageneric Epithet", value: "" },
      // { text: "Infraspecific Epithet", value: "" },
      // { text: "Gathering Country (ISO Code)", value: "country" },
      { text: "Country", value: "country" },
      // { text: "Kind of Unit", value: "" },
      { text: "Locality", value: "locality" },
      // { text: "Preparation Type", value: "" },
      { text: "Stratigraphy", value: "stratigraphy" },
      // { text: "Stratigraphy Type", value: "" },
      // { text: "Term", value: "" },
      { text: "Record URI", value: "recordURI" },
      { text: "Image", value: "url" }
    ]
  }),

  methods: {
    openUrl(url) {
      window.open(url, "UrlWindow");
    },

    openMindatInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
    },

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

<style scoped>
.image-link {
  border-radius: 4px;
}
.image-link:hover {
  cursor: pointer;
  opacity: 0.8;
}

.icon-link:hover {
  opacity: 0.7;
}

.table >>> tbody tr:nth-child(even) {
  background-color: #eceff1;
}

.table >>> th.sortable {
  white-space: nowrap;
}
.table >>> th.sortable > span:after {
  content: "\00a0";
}

.table >>> tbody > tr > td:first-child {
  padding: 4px;
}

.table >>> tbody > tr > td:first-child,
.table >>> thead > tr > th:first-child {
  padding: 0 8px;
}
</style>
