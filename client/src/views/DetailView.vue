<template>
  <v-container class="detail-view" v-if="!isLoading">
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
      <v-col cols="12">
        <v-card>
          <v-card-title class="primary--text display-1">
            <div class="d-flex flex-column flex-nowrap">
              <div
                class="mb-1"
                v-if="
                  isItemFossil ||
                    isItemMineral ||
                    isItemRock ||
                    isItemMeteorite ||
                    item.recordbasis
                "
              >
                <span class="mr-2">
                  <v-icon large color="primary" v-if="isItemFossil"
                    >fas fa-fish</v-icon
                  >
                  <v-icon large color="primary" v-else-if="isItemMineral"
                    >far fa-gem</v-icon
                  >
                  <v-icon large color="primary" v-else-if="isItemRock"
                    >fas fa-mountain</v-icon
                  >
                  <v-icon large color="primary" v-else-if="isItemMeteorite"
                    >fas fa-meteor</v-icon
                  >
                </span>

                <span v-if="item.recordbasis">{{ item.recordbasis }}</span>
              </div>

              <div class="text-h5" v-if="item.collectioncode || item.unitid">
                <span v-if="item.collectioncode">{{
                  item.collectioncode
                }}</span>
                <span
                  class="mx-2 font-weight-bold"
                  v-if="item.collectioncode && item.unitid"
                  >|</span
                >
                <span v-if="item.unitid">{{ item.unitid }}</span>
              </div>

              <div
                class="font-italic text-h6"
                v-if="isItemFossil && (item.fullscientificname || item.names)"
              >
                <div v-if="item.fullscientificname">
                  <span>Name: </span>
                  <span class="font-weight-black">{{
                    item.fullscientificname
                  }}</span>
                </div>

                <div v-if="item.names">
                  <span
                    >Identification<span v-if="item.names.length > 1">s</span>:
                  </span>
                  <span
                    class="font-italic"
                    v-for="(entity, index) in item.names"
                    :key="index"
                  >
                    <span class="font-weight-black">{{ entity }}</span>
                    <span class="mx-1" v-if="index < item.names.length - 1"
                      >|</span
                    >
                  </span>
                </div>

                <div v-else-if="!item.fullscientificname && !item.names">
                  Detail view (ID): {{ item.id }}
                </div>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-col>

      <v-col cols="12" :sm="imageExists || localityExists ? 6 : 12">
        <!-- TABLE -->
        <v-card v-if="itemExists" class="item-card">
          <v-data-table
            class="detail-view-table"
            :mobile-breakpoint="9000"
            disable-sort
            disable-filtering
            disable-pagination
            hide-default-header
            hide-default-footer
            :headers="filteredItemHeaders"
            :items="[item]"
          >
            <template v-slot:item.typestatus="{ item }">
              <div class="font-weight-bold">{{ item.typestatus }}</div>
            </template>

            <template v-slot:item.mindat_url="{ item }">
              <a
                style="text-decoration: unset;"
                title="Link to Mindat.org"
                @click="openMindatInNewWindow(item.mindat_url)"
                >{{ item.mindat_url }}
                <v-icon small color="primary"
                  >fas fa-external-link-square-alt</v-icon
                >
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

        <v-card
          class="mt-6 item-card item-card--secondary"
          v-if="
            filteredItemHeadersSecondary &&
              filteredItemHeadersSecondary.length > 0
          "
        >
          <v-data-table
            dense
            class="detail-view-table-secondary secondary--text"
            :mobile-breakpoint="9000"
            disable-sort
            disable-filtering
            disable-pagination
            hide-default-header
            hide-default-footer
            :headers="filteredItemHeadersSecondary"
            :items="[item]"
          >
            <template v-slot:item.providerurl="{ item }">
              <a
                :href="item.providerurl"
                target="ProviderWindow"
                style="text-decoration: unset;"
                >{{ item.providerurl }}</a
              >
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-row no-gutters>
          <!-- IMAGES -->
          <v-col cols="12" v-if="imageExists && detailViewImages.length > 0">
            <image-carousel :images="detailViewImages" />
          </v-col>

          <!-- MAP -->
          <v-col cols="12">
            <v-card v-if="localityExists">
              <tab-map
                style="margin-top: -12px"
                :response-results="response"
                :is-detail-view="true"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="detail-view" v-else>
    <v-row>
      <v-col cols="12" sm="6">
        <v-skeleton-loader elevation="2" type="card"></v-skeleton-loader>
      </v-col>
      <v-col cols="12" sm="6">
        <v-skeleton-loader elevation="2" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-skeleton-loader elevation="2" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import ImageCarousel from "@/components/partial/image/ImageCarousel";
import TabMap from "@/components/partial/tabs/TabMap";
import helperMixin from "@/mixins/helperMixin";

export default {
  name: "DetailView",

  components: { ImageCarousel, TabMap },

  mixins: [helperMixin],

  props: {
    id: {
      type: String,
      required: false
    }
  },

  computed: {
    ...mapState("detail", [
      "response",
      "error",
      "showError",
      "itemHeaders",
      "imageWidth",
      "imageHeight",
      "isLoading"
    ]),

    ...mapGetters("detail", [
      "itemExists",
      "imageExists",
      "localityExists",
      "item",
      "filteredItemHeaders",
      "filteredItemHeadersSecondary",
      "isItemFossil",
      "isItemMineral",
      "isItemRock",
      "isItemMeteorite"
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
    item(newVal) {
      this.handleColorChange(newVal);
      if (newVal && newVal.url) this.getImageWidth(newVal.url);
    }
  },

  beforeRouteLeave(to, from, next) {
    this.$vuetify.theme.themes.light.primary = "#FFA000";
    next();
  },

  methods: {
    ...mapActions("detail", ["getDetailView", "updateImageWidth"]),

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
    },

    handleColorChange(item) {
      if (item) {
        if (this.isItemFossil) {
          this.$vuetify.theme.themes.light.primary = this.$vuetify.theme.themes.light.fossil;
        } else if (this.isItemMineral) {
          this.$vuetify.theme.themes.light.primary = this.$vuetify.theme.themes.light.mineral;
        } else if (this.isItemRock) {
          this.$vuetify.theme.themes.light.primary = this.$vuetify.theme.themes.light.rock;
        } else if (this.isItemMeteorite) {
          this.$vuetify.theme.themes.light.primary = this.$vuetify.theme.themes.light.meteorite;
        } else
          this.$vuetify.theme.themes.light.primary = this.$vuetify.theme.themes.light.main;
      } else
        this.$vuetify.theme.themes.light.primary = this.$vuetify.theme.themes.light.main;
    }
  }
};
</script>

<style scoped>
.detail-view-table >>> .v-data-table__mobile-row {
  font-size: 1rem;
}
.item-card >>> tr:hover {
  background-color: unset !important;
}

.item-card >>> .v-data-table__mobile-row:hover {
  /*background: #eee;*/
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

.item-card--secondary >>> .v-data-table td {
  height: unset;
  min-height: 36px;
}
</style>
