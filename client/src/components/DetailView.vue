<template>
  <v-container>
    <v-row class="mx-0" justify="center" v-if="!itemExists && showError">
      <v-col cols="12" style="max-width: 500px;">
        <v-alert
          class="mb-0"
          text
          border="left"
          icon="mdi-file-document-box-search-outline"
          color="error"
        >
          <span v-html="error" />
        </v-alert>
      </v-col>
    </v-row>

    <!-- TABLE -->
    <v-card v-if="itemExists" class="item-card">
      <v-card-title class="primary--text display-1">
        <span v-if="item.fullscientificname">
          {{ item.fullscientificname }}
        </span>
        <span v-else>Detail view (ID): {{ item.id }}</span>
      </v-card-title>

      <v-divider />

      <v-data-table
        :mobile-breakpoint="9000"
        disable-sort
        disable-filtering
        disable-pagination
        hide-default-header
        hide-default-footer
        :headers="filteredItemHeaders"
        :items="[item]"
      >
        <template v-slot:item.recordURI="{ item }">
          <a
            :href="item.recordURI"
            target="RecordUriWindow"
            style="text-decoration: unset;"
            >{{ item.recordURI }}</a
          >
        </template>

        <template v-slot:item.url="{ item }">
          <a
            :href="item.url"
            target="UrlWindow"
            style="text-decoration: unset;"
            >{{ item.url }}</a
          >
        </template>

        <template v-slot:item.relatedResource="{ item }">
          <a
            :href="item.relatedResource"
            target="RelatedResourceWindow"
            style="text-decoration: unset;"
            >{{ item.relatedResource }}</a
          >
        </template>
      </v-data-table>
    </v-card>

    {{ imageWidth }}

    <!-- IMAGES -->
    <v-card class="mt-3" v-if="imageExists">
      <v-card-title>Image</v-card-title>

      <v-img
        class="mx-auto my-0"
        :src="item.url"
        :lazy-src="item.url"
        :max-width="imageWidth"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-row>
        </template>
      </v-img>
    </v-card>

    <!-- MAP -->
    <v-card class="mt-3" v-if="localityExists">
      <v-card-title>Map</v-card-title>

      <Map style="margin-top: -12px" :response="response" />
    </v-card>
  </v-container>
</template>

<script>
import SearchService from "../middleware/SearchService";
import Map from "./tabs/Map";

export default {
  name: "DetailView",

  components: { Map },

  props: {
    id: {
      type: String,
      required: false
    },
    dataFromSearch: {
      type: Object,
      required: false
    },
    isDialog: Boolean
  },

  data: () => ({
    response: null,
    error: "",
    showError: false,
    itemHeaders: [
      { text: "ID", value: "id" },
      { text: "Collection", value: "collectioncode" },
      { text: "Object ID", value: "unitid" },
      { text: "Country", value: "country" },
      { text: "Locality", value: "locality" },
      { text: "Latitude", value: "latitude" },
      { text: "Longitude", value: "longitude" },
      { text: "Stratigraphy", value: "stratigraphy" },
      { text: "Record URI", value: "recordURI" },
      { text: "Url", value: "url" },
      { text: "Related resource", value: "relatedResource" }
    ],
    imageWidth: 400
  }),

  computed: {
    itemExists() {
      return this.response !== null && this.response.numFound > 0;
    },

    imageExists() {
      return (
        this.itemExists &&
        typeof this.item.url !== "undefined" &&
        this.item.url !== null
      );
    },

    localityExists() {
      return (
        this.itemExists &&
        typeof this.item.locality !== "undefined" &&
        this.item.locality !== null &&
        this.item.latitude !== null &&
        this.item.longitude !== null
      );
    },

    item() {
      return this.itemExists ? this.response.docs[0] : [];
    },

    filteredItemHeaders() {
      return this.itemHeaders.filter(header => {
        if (this.item[header.value]) {
          return header;
        }
      });
    }
  },

  watch: {
    "$route.params.id": {
      handler: async function(id) {
        if (typeof this.id === "undefined" || this.id === null) {
          await this.getDetailViewData(id);
        }
      },
      immediate: true
    },
    // ID is used when showing detail view in a dialog.
    id: {
      handler() {
        if (
          this.isDialog &&
          typeof this.id !== "undefined" &&
          this.id !== null &&
          typeof this.dataFromSearch !== "undefined" &&
          this.dataFromSearch !== null
        ) {
          this.response = this.dataFromSearch;
        }
      },
      immediate: true
    },
    item(newVal) {
      if (newVal && newVal.url) this.getImageWidth(newVal.url);
    }
  },

  methods: {
    async getDetailViewData(id) {
      try {
        const response = await SearchService.getDetailView(id);
        if (response) this.response = response.response;

        if (this.response !== null && this.response.numFound === 0) {
          this.error = `Item with an ID: <b>${id}</b> was not found!`;
          this.showError = true;
        }
      } catch (err) {
        this.error = `<b>Status:</b> ${err.request.status}<br /><b>Status text:</b> ${err.request.statusText}`;
        this.showError = true;
      }
    },

    getMeta(url) {
      return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    },

    async getImageWidth(url) {
      let img = await this.getMeta(url);
      if (img.width) this.imageWidth = img.width;
    }
  }
};
</script>

<style scoped>
.item-card >>> tr:hover {
  background-color: unset !important;
}

.item-card >>> .v-data-table__mobile-row:hover {
  background: #fff8e1;
}

.item-card >>> .v-data-table__mobile-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.item-card >>> .v-data-table__mobile-row:last-child {
  border-bottom: unset;
}

.item-card >>> .v-data-table__mobile-row__header {
  min-width: 100px;
}

.item-card >>> .v-data-table td {
  height: unset;
  min-height: 48px;
}

.item-card >>> .v-data-table__mobile-row__cell {
  text-align: left;
  width: 100%;
  padding-left: 10px;
}
</style>
