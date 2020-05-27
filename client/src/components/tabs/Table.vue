<template>
  <v-card flat v-if="response !== null">
    <v-data-table
      class="table mt-3"
      dense
      hide-default-footer
      :headers="headers"
      :items="response.docs"
      :items-per-page="searchParameters.paginateBy"
      multi-sort
      :page="searchParameters.page"
      :sort-by="searchParameters.sortBy"
      :sort-desc="searchParameters.sortDesc"
      @update:sort-by="$emit('sortBy:changed', $event)"
      @update:sort-desc="$emit('sortDesc:changed', $event)"
      :server-items-length="response.numFound"
    >
      <template v-slot:no-data>
        <v-row class="mx-0" justify="center">
          <v-col cols="12" style="max-width: 500px;">
            <v-alert
              class="mb-0"
              text
              border="left"
              icon="mdi-table-search"
              color="secondary"
            >
              Couldn't find any records with these search parameters.
            </v-alert>
          </v-col>
        </v-row>
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
            <v-icon color="primary">mdi-diamond-stone</v-icon>
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
          sortBy: ["fullscientificname"],
          sortDesc: [false]
        };
      }
    }
  },

  data: () => ({
    headers: [
      // { text: "ID", value: "id" },
      // { text: "Multimedia", value: "url" },
      { text: "Collection", value: "collectioncode" },
      { text: "Object ID", value: "unitid" },
      // { text: "Gathering Date", value: "" },
      // { text: "Collector Number", value: "" },
      // { text: "Domain", value: "" },
      { text: "Higher Taxon", value: "highertaxon" },
      { text: "Full Scientific Name", value: "fullscientificname" },
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
      { text: "Record URI", value: "recordURI" }
    ]
  }),

  methods: {
    openUrl(url) {
      window.open(url, "UrlWindow");
    },

    openMindatInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
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

.table >>> tbody tr:nth-child(even) {
  background-color: #eceff1;
}
</style>
