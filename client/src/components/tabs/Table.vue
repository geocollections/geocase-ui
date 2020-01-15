<template>
  <v-card flat v-if="response !== null">
    <v-card-title class="py-2">
      <v-icon left color="primary" large>mdi-table-large</v-icon>
      <span class="mr-1">{{ response.numFound }}</span>
      <span class="mr-1">{{
        `item${response.numFound === 1 ? "" : "s"}`
      }}</span>
      <span class="hidden-sm-and-up">{{
        `(page: ${searchParameters.page})`
      }}</span>
    </v-card-title>

    <v-data-table
      class="table"
      dense
      hide-default-footer
      :headers="headers"
      :items="response.docs"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :sort-by.sync="searchParameters.sortBy"
      :sort-desc.sync="searchParameters.sortDesc"
      :server-items-length="response.numFound"
    >
      <template v-slot:item.url="{ item }">
        <v-img
          v-if="item.url"
          class="image-link"
          :src="item.url"
          :lazy-src="item.url"
          :title="item.url"
          @click="openUrl(item.url)"
          aspect-ratio="1.7778"
          width="100"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="amber lighten-5" />
            </v-row>
          </template>
        </v-img>
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
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: "Table",
  props: {
    response: {
      type: Object,
      required: true
    },

    searchParameters: {
      type: Object,
      required: true,
      default: function() {
        return {
          page: 1,
          paginateBy: 25,
          sortBy: ["id"],
          sortDesc: [true]
        };
      }
    }
  },

  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Multimedia", value: "url" },
      { text: "Collection", value: "collectioncode" },
      { text: "Object ID", value: "unitid" },
      { text: "Gathering Date", value: "" },
      { text: "Collector Number", value: "" },
      { text: "Domain", value: "" },
      { text: "Full Scientific Name", value: "fullscientificname" },
      { text: "Genus or Monomial", value: "" },
      { text: "Taxon Rank", value: "" },
      { text: "Higher Taxon", value: "" },
      { text: "Infrageneric Epithet", value: "" },
      { text: "Infraspecific Epithet", value: "" },
      { text: "Gathering Country (ISO Code)", value: "country" },
      { text: "Kind of Unit", value: "" },
      { text: "Locality", value: "locality" },
      { text: "Preparation Type", value: "" },
      { text: "Stratigraphy", value: "stratigraphy" },
      { text: "Stratigraphy Type", value: "" },
      { text: "Term", value: "" },
      { text: "Record URI", value: "recordURI" }
    ]
  }),

  methods: {
    openUrl(url) {
      window.open(url, "UrlWindow");
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
</style>
