<template>
    <v-container class="detail-view" v-if="!isLoading">
        <GoBackButton />

        <v-row class="mx-0" justify="center" v-if="!itemExists">
            <v-col cols="12" style="max-width: 500px">
                <v-alert
                        class="mb-0"
                        text
                        border="left"
                        icon="fas fa-search"
                        color="error"
                >
                    <span v-if="showError" v-html="error" />
                    <span
                            v-else
                            v-html="
              $t('detail.noResults', {
                id: encodeURIComponent($route.params.id),
              })
            "
                    />
                </v-alert>
            </v-col>
        </v-row>

        <v-card class="px-6 py-4 mb-5" shaped v-if="items.length > 1">
            <v-card-title class="red--text" style="word-break: break-word">
                More than one entry was found, please select one.
            </v-card-title>

            <v-row>
                <template v-for="item in items">
                    <v-col cols="6" :key="item.id">
                        <v-card>
                            <v-card-title class="primary--text" style="word-break: break-word">
                                <detail-view-headline-box style="width: 100%;" :item="item" />
                            </v-card-title>

                            <v-card-text>
                                <router-link :to="{ name: 'Detail', params: { id: item.id } }">
                                    <v-btn class="font-weight-bold" color="primary" elevation="6">
                                        Select
                                    </v-btn>
                                </router-link>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </template>
            </v-row>
        </v-card>

        <v-card class="px-6 py-4" shaped v-if="items.length === 1">
            <v-row>
                <!-- TITLE, TABLE and TABLE SECONDARY -->
                <v-col cols="12" :sm="imageExists || localityExists ? 6 : 12">
                    <!-- TITLE -->
                    <v-card v-if="items.length === 1">
                        <v-card-title class="primary--text" style="word-break: break-word">
                            <detail-view-headline-box style="width: 100%;" :item="item" :logoURI="logoURI" />
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
                            <template v-slot:item.type_status="{ value }">
                                <div>
                  <span
                          v-if="
                      value === 'holotype' ||
                      value === 'neotype' ||
                      value === 'Holotypus' ||
                      value === 'Neotypus'
                    "
                          class="font-weight-bold"
                  >
                    {{ value }}
                  </span>
                                    <span v-else>
                    {{ value }}
                  </span>
                                    <span v-if="originalStatus">({{ originalStatus }})</span>
                                </div>
                            </template>

                            <template v-slot:item.stratigraphy>
                                <!-- Currently uncommented stratigraphy directly from source as all the cases haven't been handled yet  -->
                                <!-- For example currently only handling Chronostratigraphic terms but there's also Lithostratigraphic terms -->
                                <!-- That means itemStratigraphy getter needs to be updated -->
                                <!--                <div v-if="itemStratigraphy && itemStratigraphy.length > 0">-->
                                <!--                  <ul class="circle-list">-->
                                <!--                    <li v-for="(item, index) in itemStratigraphy" :key="index">-->
                                <!--                      <span v-if="item.division">{{ item.division }}: </span>-->
                                <!--                      <span v-if="item.name">{{ item.name }}</span>-->
                                <!--                    </li>-->
                                <!--                  </ul>-->
                                <!--                </div>-->
                                <div v-if="item.stratigraphies">
                                    <ul style="list-style-type: circle">
                                        <li
                                                v-for="(item, index) in item.stratigraphies"
                                                :key="index"
                                        >
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-else-if="item.stratigraphytexts">
                                    <ul style="list-style-type: circle">
                                        <li
                                                v-for="(item, index) in item.stratigraphytexts"
                                                :key="index"
                                        >
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>
                            </template>

                            <template v-slot:item.area>
                                <div v-if="itemArea && itemArea.length > 0">
                                    <ul class="circle-list">
                                        <li v-for="(item, index) in itemArea" :key="index">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>
                            </template>

                            <template v-slot:item.areaDetail>
                                <div v-if="areaDetail">
                                    {{ areaDetail }}
                                </div>
                            </template>

                            <template v-slot:item.nearNamedPlace>
                                <div v-if="nearNamedPlace">
                                    {{ nearNamedPlace }}
                                </div>
                            </template>

                            <template v-slot:item.highertaxon="{ item }">
                                <div v-if="itemHighertaxon && itemHighertaxon.length > 0">
                                    <ul class="circle-list">
                                        <li v-for="(item, index) in itemHighertaxon" :key="index">
                                            {{ item }}
                                        </li>
                                    </ul>
                                </div>
                                <div v-else>{{ item.highertaxon }}</div>
                            </template>

                            <template v-slot:item.itemMineralGroup="{ item }">
                                <!--                <div v-if="itemMineralGroup && itemMineralGroup.length > 0">-->
                                <!--                  <ul class="circle-list">-->
                                <!--                    <li v-for="(item, index) in itemMineralGroup" :key="index">-->
                                <!--                      {{ item }}-->
                                <!--                    </li>-->
                                <!--                  </ul>-->
                                <!--                </div>-->
                                <div v-if="itemMineralGroup">
                                    {{ itemMineralGroup }}
                                </div>
                            </template>

                            <template v-slot:item.mineralNameDetail="{ item }">
                                <div v-if="mineralNameDetail">
                                    {{ mineralNameDetail }}
                                </div>
                            </template>

                            <template v-slot:item.reference="{ item }">
                                <div v-if="itemReference && itemReference.length > 0">
                                    <ul class="circle-list">
                                        <li v-for="(item, index) in itemReference" :key="index">
                                            <span v-html="item" />
                                        </li>
                                    </ul>
                                </div>
                            </template>

                            <template v-slot:item.unitWeight="{ item }">
                                <div v-if="unitWeight">
                                    {{ unitWeight }}
                                </div>
                            </template>

                            <template v-slot:item.acquisitionDate="{ item }">
                                <div v-if="acquisitionDate">
                                    {{ acquisitionDate }}
                                </div>
                            </template>

                            <template v-slot:item.gatheringAgent="{ item }">
                                <div v-if="gatheringAgent">
                                    {{ gatheringAgent }}
                                </div>
                            </template>

                            <template v-slot:item.unitDateText="{ item }">
                                <div v-if="unitDateText">
                                    {{ unitDateText }}
                                </div>
                            </template>

                            <template v-slot:item.kindOfUnit="{ item }">
                                <div v-if="kindOfUnit">
                                    {{ kindOfUnit }}
                                </div>
                            </template>

                            <template v-slot:item.mindat_url="{ item }">
                                <a
                                        style="text-decoration: unset"
                                        title="Link to Mindat.org"
                                        @click="openMindatInNewWindow(item.mindat_url)"
                                >{{ item.mindat_url }}
                                    <v-icon small color="primary"
                                    >fas fa-external-link-square-alt
                                    </v-icon
                                    >
                                </a>
                            </template>

                            <template v-slot:item.taxon_id_pbdb="{ item }">
                                <a
                                        style="text-decoration: unset"
                                        title="Link to taxon record in PBDB"
                                        @click="openPaleobiodbInNewWindow(item.taxon_id_pbdb)"
                                >Link to taxon record in PBDB
                                    <v-icon
                                            right
                                            small
                                            color="primary"
                                    >fas fa-external-link-square-alt
                                    </v-icon
                                    >
                                </a>
                            </template>

                            <template v-slot:item.taxon_id_eol="{ item }">
                                <a
                                        style="text-decoration: unset"
                                        title="Link to taxon record in Encyclopedia of Life"
                                        @click="openEolInNewWindow(item.taxon_id_eol)"
                                >Link to taxon record in Encyclopedia of Life
                                    <v-icon
                                            right
                                            small
                                            color="primary"
                                    >fas fa-external-link-square-alt
                                    </v-icon
                                    >
                                </a>
                            </template>

                            <template v-slot:item.taxon_id_tol="{ item }">
                                <a
                                        style="text-decoration: unset"
                                        title="Link to taxon record in Tree of life"
                                        @click="openTolwebInNewWindow(item.taxon_id_tol)"
                                >Link to taxon record in Tree of life
                                    <v-icon
                                            right
                                            small
                                            color="primary"
                                    >fas fa-external-link-square-alt
                                    </v-icon
                                    >
                                </a>
                            </template>

                            <template v-slot:item.taxon_id="{ item }">
                                <a
                                        style="text-decoration: unset"
                                        title="Link to taxon record in fossiilid.info"
                                        @click="openFossiilidInNewWindow(item.taxon_id)"
                                >Link to taxon record in fossiilid.info
                                    <v-icon
                                            right
                                            small
                                            color="primary"
                                    >fas fa-external-link-square-alt
                                    </v-icon
                                    >
                                </a>
                            </template>

                            <template v-slot:item.recordURI="{ item }">
                                <a
                                        :href="item.recordURI"
                                        target="RecordUriWindow"
                                        style="text-decoration: unset"
                                >{{ item.recordURI }}</a
                                >
                            </template>

                            <template v-slot:item.relatedResource="{ item }">
                                <a
                                        :href="item.relatedResource"
                                        target="RelatedResourceWindow"
                                        style="text-decoration: unset"
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
                            <template v-slot:item.institutionHomepage>
                                <div
                                        v-if="representationTitle || representationURI"
                                        class="d-flex justify-start"
                                >
                                    <div
                                            class="align-self-center mr-3"
                                            v-if="representationTitle"
                                    >
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
                                </div>
                            </template>

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
                                    >
                                        <v-icon x-small class="mr-1" color="primary"
                                        >far fa-envelope
                                        </v-icon
                                        >
                                        {{ contentContactEmail }}</a
                                    >
                                </div>
                            </template>

                            <template v-slot:item.contentContactPhone>
                                <div v-if="contentContactPhone">
                                    <a
                                            :href="`tel:${contentContactPhone}`"
                                            class="text-decoration-none"
                                    >
                                        <v-icon x-small class="mr-1" color="primary"
                                        >fas fa-phone
                                        </v-icon
                                        >
                                        {{ contentContactPhone }}</a
                                    >
                                </div>
                            </template>

                            <template v-slot:item.contentContactAddress>
                                <div v-if="contentContactAddress">
                                    <a
                                            :href="`https://www.google.com/maps/search/?api=1&query=${contentContactAddress}`"
                                            target="GoogleMapsWindow"
                                            class="text-decoration-none"
                                    >
                                        <v-icon x-small class="mr-1" color="primary"
                                        >fas fa-map-marker-alt
                                        </v-icon
                                        >
                                        {{ contentContactAddress }}</a
                                    >
                                </div>
                            </template>

                            <template v-slot:item.copyrights>
                                <div class="max-text-width">{{ copyrights }}</div>
                            </template>

                            <template v-slot:item.termsofusestatements>
                                <div class="max-text-width">{{ termsofusestatements }}</div>
                            </template>

                            <template v-slot:item.disclaimers>
                                <div class="max-text-width">{{ disclaimers }}</div>
                            </template>

                            <template v-slot:item.acknowledgements>
                                <div class="max-text-width">{{ acknowledgements }}</div>
                            </template>

                            <template v-slot:item.dateLastEdited>
                                <div>{{ dateLastEdited }}</div>
                            </template>

                            <template v-slot:item.last_harvested_processing>
                                <div>{{ computedLastHarvestedProcessing }}</div>
                            </template>

                            <template v-slot:item.providerurl="{ item }">
                                <a
                                        class=""
                                        :href="item.providerurl"
                                        target="ProviderWindow"
                                        style="text-decoration: unset"
                                >{{ item.providerurl }}</a
                                >
                            </template>

                            <template v-slot:item.specimenVerifier>
                                <div>{{ specimenVerifier }}</div>
                            </template>

                            <template v-slot:item.unitGuid>
                                <div>{{ unitGuid }}</div>
                            </template>

                            <template v-slot:item.cetaf_identifier>
                                <a
                                        :href="
                    getCetafIdentifierUrl(
                      item.datasourcecountry,
                      item.cetaf_identifier
                    )
                  "
                                        target="CetafIdentifierWindow"
                                        style="text-decoration: unset"
                                >{{
                                        getCetafIdentifierUrl(
                                                item.datasourcecountry,
                                                item.cetaf_identifier
                                        )
                                    }}</a
                                >
                            </template>
                        </v-data-table>
                    </v-card>
                </v-col>

                <!-- IMAGES and MAP -->
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
                <v-col cols="12" v-show="responseFromSource">
                    <v-card>
                        <v-card-title
                                class="justify-center card-title--clickable"
                                @click="showResponseFromSource = !showResponseFromSource"
                        >{{ $t("detail.dataFromProvider") }}
                            <v-spacer />
                            <v-btn icon
                            >
                                <v-icon v-if="showResponseFromSource">fas fa-angle-up
                                </v-icon
                                >
                                <v-icon v-else>fas fa-angle-down</v-icon>
                            </v-btn
                            >
                        </v-card-title>

                        <v-expand-transition v-show="showResponseFromSource">
                            <v-card-text>
                                <v-treeview
                                        shaped
                                        dense
                                        open-all
                                        hoverable
                                        open-on-click
                                        :items="computedResponseFromSource"
                                />
                            </v-card-text>
                        </v-expand-transition>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
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
  import DetailViewHeadlineBox from "@/components/detail_view/HeadlineBox"
  import { mapActions, mapGetters, mapState } from "vuex"
  import ImageCarousel from "@/components/image/ImageCarousel"
  import TabMap from "@/components/tabs/TabMap"
  import helperMixin from "@/mixins/helperMixin"
  import GoBackButton from "@/components/GoBackButton"

  export default {
    name: "DetailView",

    components: { GoBackButton, ImageCarousel, TabMap, DetailViewHeadlineBox },

    mixins: [helperMixin],

    metaInfo () {
      // TITLE
      const type =
        this.getSpecimenType.charAt(0).toUpperCase() +
        this.getSpecimenType.substring(1)
      const collectioncode = this.item.collectioncode
      const unitid = this.item.unitid
      const fullscientificname = this.item.fullscientificname

      let title = `${type} Specimen`

      if (fullscientificname) {
        title = fullscientificname
      } else {
        if (collectioncode || unitid) {
          title += ` - ${collectioncode} ${unitid}`
        }
      }

      // DESCRIPTION
      let description = ""
      const fields = [
        "recordbasis",
        "fullscientificname",
        "locality",
        "datasetowner"
      ]
      if (this.item) {
        fields.forEach((item, index) => {
          if (this.item[item]) {
            description += ` ${this.$t(`search.table.${item}`)}: ${
              this.item[item]
            }${index < fields.length - 1 ? "," : ""}`
          }
        })
      }

      const ogImage =
        this.detailViewImages?.[0]?.thumbnailImage ??
        "https://files.geocollections.info/img/geocase/front_page/geocase_landing.jpg"
      const ogImageAlt = this.detailViewImages?.[0]?.altText ?? description
      const ogUrl = document.location.href

      return {
        title: title,
        meta: [
          {
            vmid: "description",
            name: "description",
            content: description
          },
          {
            vmid: "og:title",
            property: "og:title",
            content: title
          },
          {
            vmid: "og:description",
            property: "og:description",
            content: description
          },
          {
            vmid: "og:image",
            property: "og:image",
            content: ogImage
          },
          {
            vmid: "og:url",
            property: "og:url",
            content: ogUrl
          },
          {
            vmid: "og:image:alt",
            name: "og:image:alt",
            content: ogImageAlt
          },
          {
            vmid: "twitter:image:alt",
            name: "twitter:image:alt",
            content: ogImageAlt
          }
        ]
      }
    },

    props: {
      id: {
        type: String,
        required: false
      }
    },

    data: () => ({
      showResponseFromSource: false
    }),

    computed: {
      ...mapState("detail", [
        "response",
        "responseFromSource",
        "error",
        "showError",
        "itemHeaders",
        "isLoading"
      ]),

      ...mapGetters("detail", [
        "itemExists",
        "imageExists",
        "localityExists",
        "items",
        "filteredItemHeaders",
        "filteredItemHeadersSecondary",
        "isItemFossil",
        "isItemMineral",
        "isItemRock",
        "isItemMeteorite",
        "itemStratigraphy",
        "itemReference",
        "itemArea",
        "areaDetail",
        "nearNamedPlace",
        "originalStatus",
        "unitWeight",
        "acquisitionDate",
        "gatheringAgent",
        "unitDateText",
        "kindOfUnit",
        "itemHighertaxon",
        "itemMineralGroup",
        "mineralNameDetail",
        "contentContactName",
        "contentContactEmail",
        "contentContactPhone",
        "contentContactAddress",
        "logoURI",
        "representationTitle",
        "representationURI",
        "copyrights",
        "termsofusestatements",
        "dateLastEdited",
        "disclaimers",
        "acknowledgements",
        "specimenVerifier",
        "unitGuid",
        "translatedItemHeaders",
        "translatedItemHeadersSecondary"
      ]),

      item () {
        if (this.items.length === 1) {
          return this.items[0]
        }
        return {}
      },

      getSpecimenType () {
        let type = "fossil"
        if (this.isItemMineral) {
          type = "mineral"
        } else {
          if (this.isItemRock) {
            type = "rock"
          } else {
            if (this.isItemMeteorite) {
              type = "meteorite"
            }
          }
        }
        return type
      },

      filteredNames () {
        if (this.item.names) {
          return this.item.names.filter(
            (name) => name !== this.item.fullscientificname
          )
        } else {
          return []
        }
      },

      computedResponseFromSource () {
        let treeview = this.buildTreeview(
          this.responseFromSource?.["abcd:DataSets"],
          0
        )
        return treeview
      },

      computedLastHarvestedProcessing () {
        if (this.item?.last_harvested_processing) {
          if (this.item.last_harvested_processing.includes("T")) {
            return this.item.last_harvested_processing.split("T")[0]
          } else {
            return this.item.last_harvested_processing
          }
        }
        return null
      }
    },

    watch: {
      "$route.params.id": {
        handler: async function (id) {
          if (typeof this.id === "undefined" || this.id === null) {
            this.resetResponseFromSource()
            await this.getDetailViewData(id)
            this.getDetailViewDataDirectly()
          }
        },
        immediate: true
      },
      item (newVal) {
        this.handleColorChange(newVal)
      }
    },

    beforeRouteLeave (to, from, next) {
      this.$vuetify.theme.themes.light.primary = "#ffa000"
      this.resetResponseFromSource()
      next()
    },

    methods: {
      ...mapActions("detail", [
        "getDetailView",
        "getDetailViewDataFromSource",
        "resetResponseFromSource"
      ]),

      async getDetailViewData (id) {
        await this.getDetailView(id)

        if (this.items.length === 1 && !/^\d+$/.test(id)) {
          // only found 1 item and id param is old.
          this.$router.push({ name: 'Detail', params: { id: this.items[0].id } })
        }
      },

      getDetailViewDataDirectly () {
        if (
          this.item?.datasourceurl &&
          this.item?.unitid &&
          this.item?.datasourceurl.includes("pywrapper")
        ) {
          let querytoolUrl =
            this.item.datasourceurl.replace("pywrapper", "querytool/raw") +
            `&filter=(cat=${this.item.unitid})`
          if (
            this.item.datasourceurl.includes("geocollections.info") &&
            this.item?.datasetownerabbrev
          ) {
            querytoolUrl += `AND(col=${this.item.datasetownerabbrev})`
          }
          querytoolUrl += "&schema=http://www.tdwg.org/schemas/abcd/2.06"
          this.getDetailViewDataFromSource(querytoolUrl)
        }
      },

      openMindatInNewWindow (url) {
        window.open(url, "MindatWindow", "width=800,height=750")
      },

      openPaleobiodbInNewWindow (id) {
        window.open(
          `https://paleobiodb.org/classic/basicTaxonInfo?taxon_no=${id}`,
          "PaleobiodbWindow",
          "width=800,height=750"
        )
      },

      openEolInNewWindow (id) {
        window.open(
          `https://eol.org/pages/${id}`,
          "EolWindow",
          "width=800,height=750"
        )
      },

      openTolwebInNewWindow (id) {
        window.open(
          `http://tolweb.org/${id}`,
          "TolwebWindow",
          "width=800,height=750"
        )
      },

      openFossiilidInNewWindow (id) {
        window.open(
          `https://fossiilid.info/${id}`,
          "FossiilidWindow",
          "width=800,height=750"
        )
      },

      handleColorChange (item) {
        if (item) {
          if (this.isItemFossil) {
            this.$vuetify.theme.themes.light.primary =
              this.$vuetify.theme.themes.light.fossil
          } else {
            if (this.isItemMineral) {
              this.$vuetify.theme.themes.light.primary =
                this.$vuetify.theme.themes.light.mineral
            } else {
              if (this.isItemRock) {
                this.$vuetify.theme.themes.light.primary =
                  this.$vuetify.theme.themes.light.rock
              } else {
                if (this.isItemMeteorite) {
                  this.$vuetify.theme.themes.light.primary =
                    this.$vuetify.theme.themes.light.meteorite
                } else {
                  this.$vuetify.theme.themes.light.primary =
                    this.$vuetify.theme.themes.light.main
                }
              }
            }
          }
        } else {
          this.$vuetify.theme.themes.light.primary =
            this.$vuetify.theme.themes.light.main
        }
      },

      buildTreeview (data, depth) {
        if (typeof data === "object") {
          return Object.entries(data).map((item, index) => {
            depth++

            return {
              id: Math.floor(Math.random() * Math.floor(index + 314159 * depth)),
              name:
                typeof item[1] === "string" ? `${item[0]}: ${item[1]}` : item[0],
              children: this.buildTreeview(item[1], depth)
            }
          })
        } else {
          return []
        }
      },

      getCetafIdentifierUrl (country, identifier) {
        if (country && identifier) {
          if (country === "UK") {
            country = "united-kingdom"
          }
          if (country === "The Netherlands") {
            country = "netherlands-the"
          }

          country = country.toLowerCase()
          return `https://collections.naturalsciences.be/cpb/nh-collections/countries/${country}/${identifier}`
        }
      }
    }
  }
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
        min-width: 140px;
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

    .card-title--clickable:hover {
        opacity: 0.7;
        cursor: pointer;
    }

    .max-text-width {
        max-width: 700px;
    }

    .circle-list {
        list-style-type: circle;
    }

    .title-logo {
        text-align: right;
        text-align: -webkit-right;
        text-align: -moz-right;
    }
</style>
