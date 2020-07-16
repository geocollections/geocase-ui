<template>
  <v-container class="detail-view">
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
            <div class="d-flex flex-row flex-nowrap">
              <div class="mr-2">
                <v-icon color="primary" v-if="isItemFossil">fas fa-fish</v-icon>
                <v-icon color="primary" v-else-if="isItemMineral"
                  >far fa-gem</v-icon
                >
                <v-icon color="primary" v-else-if="isItemRock"
                  >fas fa-mountain</v-icon
                >
                <v-icon color="primary" v-else-if="isItemMeteorite"
                  >fas fa-meteor</v-icon
                >
              </div>

              <div v-if="item.fullscientificname">
                {{ item.fullscientificname }}
              </div>
              <div v-else>Detail view (ID): {{ item.id }}</div>
            </div>
          </v-card-title>

          <v-divider />

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

        <v-card class="mt-6" v-if="detailViewImages.length > 1">
          <image-overflow :images="detailViewImages" />
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
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import TabMap from "../components/tabs/TabMap";
import helperMixin from "../mixins/helperMixin";
import ImageCarousel from "../components/partial/image/ImageCarousel";
import ImageOverflow from "../components/partial/image/ImageOverflow";

export default {
  name: "DetailView",

  components: {ImageOverflow, ImageCarousel, TabMap },

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
      "imageHeight"
    ]),

    ...mapGetters("detail", [
      "itemExists",
      "imageExists",
      "localityExists",
      "item",
      "filteredItemHeaders",
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
</style>
