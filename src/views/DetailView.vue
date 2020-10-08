<template>
  <v-container class="detail-view" v-if="!isLoading">
    <GoBackButton />

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

    <v-row v-if="itemExists">
      <v-col cols="12" :sm="imageExists || localityExists ? 6 : 12">
        <!-- TITLE -->
        <v-card>
          <v-card-title class="primary--text" style="word-break: break-word;">
            <div class="d-flex flex-column flex-nowrap">
              <div class="mb-1">
                <span
                  v-if="
                    isItemFossil ||
                      isItemMineral ||
                      isItemRock ||
                      isItemMeteorite
                  "
                >
                  <span class="mr-2">
                    <v-icon small color="primary" v-if="isItemFossil"
                      >fas fa-fish</v-icon
                    >
                    <v-icon small color="primary" v-else-if="isItemMineral"
                      >far fa-gem</v-icon
                    >
                    <v-icon small color="primary" v-else-if="isItemRock"
                      >fas fa-mountain</v-icon
                    >
                    <v-icon small color="primary" v-else-if="isItemMeteorite"
                      >fas fa-meteor</v-icon
                    >
                  </span>

                  <span>{{ getSpecimenType }}</span>
                </span>

                <span
                  v-if="
                    (isItemFossil ||
                      isItemMineral ||
                      isItemRock ||
                      isItemMeteorite) &&
                      (item.collectioncode || item.unitid)
                  "
                >
                  -
                </span>

                <span
                  class="font-weight-bold"
                  v-if="item.collectioncode || item.unitid"
                >
                  <span v-if="item.collectioncode"
                    >{{ item.collectioncode }}
                  </span>
                  <span v-if="item.unitid">{{ item.unitid }}</span>
                </span>
              </div>

              <h1
                :class="{ 'font-italic': isItemFossil }"
                class="font-weight-bold mb-1"
                style="font-size: 2rem;"
                v-if="item.fullscientificname"
              >
                {{ item.fullscientificname }}
              </h1>

              <h2 style="font-size: 1.25rem;" v-if="filteredNames.length > 0">
                <span class="font-weight-regular"
                  >Identification<span v-if="filteredNames.length > 1">s</span>:
                </span>
                <span
                  :class="{ 'font-italic': isItemFossil }"
                  v-for="(entity, index) in filteredNames"
                  :key="index"
                >
                  <span class="font-weight-bold">{{ entity }}</span>
                  <span class="mx-1" v-if="index < filteredNames.length - 1"
                    >|</span
                  >
                </span>
              </h2>

              <div v-if="!item.fullscientificname && !filteredNames">
                GeoCASe ID: {{ item.id }}
              </div>
            </div>
          </v-card-title>
        </v-card>

        <!-- TABLE -->
        <v-card v-if="itemExists" class="mt-6 item-card">
          <v-data-table
            class="detail-view-table"
            :mobile-breakpoint="9000"
            disable-sort
            disable-filtering
            disable-pagination
            hide-default-footer
            :headers="filteredItemHeaders"
            :items="[item]"
          >
            <template v-slot:item.stratigraphy>
              <div v-if="itemStratigraphy && itemStratigraphy.length > 0">
                <ul>
                  <li v-for="(item, index) in itemStratigraphy" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
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

            <template v-slot:item.taxon_id_pbdb="{ item }">
              <a
                style="text-decoration: unset;"
                title="Link to taxon record in PBDB"
                @click="openPaleobiodbInNewWindow(item.taxon_id_pbdb)"
                >Link to taxon record in PBDB<v-icon right small color="primary"
                  >fas fa-external-link-square-alt</v-icon
                >
              </a>
            </template>

            <template v-slot:item.taxon_id_eol="{ item }">
              <a
                style="text-decoration: unset;"
                title="Link to taxon record in Encyclopedia of Life"
                @click="openEolInNewWindow(item.taxon_id_eol)"
                >Link to taxon record in Encyclopedia of Life<v-icon
                  right
                  small
                  color="primary"
                  >fas fa-external-link-square-alt</v-icon
                >
              </a>
            </template>

            <template v-slot:item.taxon_id_tol="{ item }">
              <a
                style="text-decoration: unset;"
                title="Link to taxon record in Tree of life"
                @click="openTolwebInNewWindow(item.taxon_id_tol)"
                >Link to taxon record in Tree of life<v-icon
                  right
                  small
                  color="primary"
                  >fas fa-external-link-square-alt</v-icon
                >
              </a>
            </template>

            <template v-slot:item.taxon_id="{ item }">
              <a
                style="text-decoration: unset;"
                title="Link to taxon record in fossiilid.info"
                @click="openFossiilidInNewWindow(item.taxon_id)"
                >Link to taxon record in fossiilid.info<v-icon
                  right
                  small
                  color="primary"
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

        <!-- TABLE SECONDARY -->
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
            hide-default-footer
            :headers="filteredItemHeadersSecondary"
            :items="[item]"
          >
            <template v-slot:item.contentContactName>
              <div>
                {{ contentContactName }}
              </div>
            </template>

            <template v-slot:item.contentContactEmail>
              <div v-if="contentContactEmail">
                <a
                  :href="`mailto:${contentContactEmail}`"
                  class="text-decoration-none"
                  ><v-icon x-small class="mr-1" color="primary"
                    >far fa-envelope</v-icon
                  >{{ contentContactEmail }}</a
                >
              </div>
            </template>

            <template v-slot:item.contentContactPhone>
              <div v-if="contentContactPhone">
                <a
                  :href="`tel:${contentContactPhone}`"
                  class="text-decoration-none"
                  ><v-icon x-small class="mr-1" color="primary"
                    >fas fa-phone</v-icon
                  >{{ contentContactPhone }}</a
                >
              </div>
            </template>

            <template v-slot:item.contentContactAddress>
              <div v-if="contentContactAddress">
                <a
                  :href="
                    `https://www.google.com/maps/place/${contentContactAddress}`
                  "
                  target="GoogleMapsWindow"
                  class="text-decoration-none"
                  ><v-icon x-small class="mr-1" color="primary"
                    >fas fa-map-marker-alt</v-icon
                  >{{ contentContactAddress }}</a
                >
              </div>
            </template>

            <template v-slot:item.institutionHomepage>
              <div
                v-if="representationTitle && representationURI"
                class="d-flex justify-start"
              >
                <div class="align-self-center mr-3">
                  <a
                    v-if="representationURI"
                    class="text-decoration-none"
                    :href="representationURI"
                    :title="representationURI"
                    target="InstitutionHomepage"
                    >{{ representationTitle }}</a
                  >
                  <div v-else>{{ representationTitle }}</div>
                </div>

                <div v-if="logoURI">
                  <v-img
                    :src="logoURI"
                    height="100"
                    width="100"
                    contain
                  ></v-img>
                </div>
              </div>
            </template>

            <template v-slot:item.providerurl="{ item }">
              <a
                class=""
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
            <v-card v-if="localityExists" class="mt-3">
              <tab-map
                style="margin-top: -12px"
                :response-results="response"
                :is-detail-view="true"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- DATA FROM SOURCE -->
      <v-col cols="12" v-if="responseFromSource">
        <v-card>
          <v-card-title class="justify-center"
            >Data directly from source</v-card-title
          >

          <v-card-text>
            <pre style="font-size: 0.625rem; overflow: auto;">
              {{ JSON.stringify(responseFromSource, null, 2) }}
            </pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="detail-view" v-else>
    <GoBackButton />

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
import GoBackButton from "@/components/partial/GoBackButton";

export default {
  name: "DetailView",

  components: { GoBackButton, ImageCarousel, TabMap },

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
      "responseFromSource",
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
      "isItemMeteorite",
      "itemStratigraphy",
      "contentContactName",
      "contentContactEmail",
      "contentContactPhone",
      "contentContactAddress",
      "logoURI",
      "representationTitle",
      "representationURI"
    ]),

    getSpecimenType() {
      let type = "Fossil";
      if (this.isItemMineral) type = "Mineral";
      else if (this.isItemRock) type = "Rock";
      else if (this.isItemMeteorite) type = "Meteorite";
      return type;
    },

    filteredNames() {
      if (this.item.names) {
        return this.item.names.filter(
          name => name !== this.item.fullscientificname
        );
      } else return [];
    }
  },

  watch: {
    "$route.params.id": {
      handler: async function(id) {
        if (typeof this.id === "undefined" || this.id === null) {
          this.resetResponseFromSource();
          await this.getDetailViewData(id);
          this.getDetailViewDataDirectly();
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
    this.resetResponseFromSource();
    next();
  },

  methods: {
    ...mapActions("detail", [
      "getDetailView",
      "updateImageWidth",
      "getDetailViewDataFromSource",
      "resetResponseFromSource"
    ]),

    async getDetailViewData(id) {
      await this.getDetailView(id);
    },

    getDetailViewDataDirectly() {
      if (this.item?.datasourceurl && this.item?.unitid) {
        let querytoolUrl =
          this.item.datasourceurl.replace("pywrapper", "querytool/raw") +
          `&filter=(cat=${this.item.unitid})`;
        this.getDetailViewDataFromSource(querytoolUrl);
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
      if (img.width) this.updateImageWidth(img.width);
    },

    openMindatInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
    },

    openPaleobiodbInNewWindow(id) {
      window.open(
        `https://paleobiodb.org/classic/basicTaxonInfo?taxon_no=${id}`,
        "PaleobiodbWindow",
        "width=800,height=750"
      );
    },

    openEolInNewWindow(id) {
      window.open(
        `https://eol.org/pages/${id}`,
        "EolWindow",
        "width=800,height=750"
      );
    },

    openTolwebInNewWindow(id) {
      window.open(
        `http://tolweb.org/${id}`,
        "TolwebWindow",
        "width=800,height=750"
      );
    },

    openFossiilidInNewWindow(id) {
      window.open(
        `https://fossiilid.info/${id}`,
        "FossiilidWindow",
        "width=800,height=750"
      );
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
  min-width: 135px;
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

.detail-view-table >>> thead,
.detail-view-table-secondary >>> thead {
  display: none;
}
</style>