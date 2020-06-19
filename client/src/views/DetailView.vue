<template>
  <v-container>
    <v-row class="mx-0" justify="center" v-if="!itemExists">
      <v-col cols="12" style="max-width: 500px;">
        <v-alert
          class="mb-0"
          text
          border="left"
          icon="fas fa-search"
          color="error"
        >
          <span v-if="showError" v-html="error" />
          <span v-else
            >Couldn't find any results with an <b>ID</b> of
            <b>{{ $route.params.id }}</b></span
          >
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" :sm="imageExists || localityExists ? 6 : 12">
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
            <template v-slot:item.mindat_url="{ item }">
              <a
                style="text-decoration: unset;"
                title="Link to Mindat.org"
                @click="openMindatInNewWindow(item.mindat_url)"
                >{{ item.mindat_url }}
                <v-icon color="primary">far fa-gem</v-icon>
              </a>
            </template>

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
      </v-col>

      <v-col cols="12" sm="6">
        <v-row no-gutters>
          <v-col cols="12">
            <!-- IMAGES -->
            <v-card class="mb-6" v-if="imageExists">
              <v-card-title>Image</v-card-title>

              <v-img
                class="mx-auto my-0"
                :src="item.url"
                :lazy-src="item.url"
                :max-width="imageWidth"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>

          <v-col cols="12">
            <!-- MAP -->
            <v-card v-if="localityExists">
              <v-card-title>Map</v-card-title>

              <Map
                style="margin-top: -12px"
                :response="response"
                :is-detail-view="true"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Map from "@/components/tabs/Map";
import { mapActions, mapGetters, mapState } from "vuex";

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

  computed: {
    ...mapState("detail", [
      "response",
      "error",
      "showError",
      "itemHeaders",
      "imageWidth"
    ]),

    ...mapGetters("detail", [
      "itemExists",
      "imageExists",
      "localityExists",
      "item",
      "filteredItemHeaders"
    ])
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
          this.updateResponseFromSearch(this.dataFromSearch);
        }
      },
      immediate: true
    },
    item(newVal) {
      if (newVal && newVal.url) this.getImageWidth(newVal.url);
    }
  },

  methods: {
    ...mapActions("detail", [
      "getDetailView",
      "updateImageWidth",
      "updateResponseFromSearch"
    ]),

    async getDetailViewData(id) {
      this.getDetailView(id);
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
      if (img.width) this.updateImageWidth(img.width);
    },

    openMindatInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
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
