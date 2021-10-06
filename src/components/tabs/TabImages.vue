<template>
  <v-card flat>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-row class="mx-0" v-if="searchResultImages.length > 0">
      <v-col
        v-for="(image, index) in searchResultImages"
        :key="index"
        class="d-flex child-flex"
        cols="6"
        sm="4"
        md="3"
        lg="2"
      >
        <v-tooltip bottom color="secondary" z-index="51000" max-width="250">
          <template v-slot:activator="{ on }">
            <v-card
              flat
              class="d-flex image-hover"
              color="transparent"
              v-on="on"
              hover
              @click="openDialog(index)"
            >
              <image-wrapper
                v-if="image.thumbnailImage"
                :image-src="image.thumbnailImage"
                :alt-text="image.altText"
              />

              <v-row align="center" v-else>
                <v-col class="text-center">
                  <div class="py-3">
                    <v-icon style="font-size: 6rem" class="grey--text"
                      >far fa-image</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </template>

          <span>
            <b>ID:</b> {{ image.id }}<br />
            <span v-if="image.collectioncode">
              <b>{{ $t("search.table.collectioncode") }}:</b>
              {{ image.collectioncode }}
              <br />
            </span>
            <span v-if="image.unitid">
              <b>{{ $t("search.table.unitid") }}:</b>
              {{ image.unitid }}
              <br />
            </span>
            <span v-if="image.fullscientificname">
              <b>{{ $t("search.table.fullscientificname") }}:</b>
              {{ image.fullscientificname }}
              <br />
            </span>
            <span v-if="image.country">
              <b>{{ $t("search.table.country") }}:</b>
              {{ image.country }}
              <br />
            </span>
            <span v-if="image.locality">
              <b>{{ $t("search.table.locality") }}:</b>
              {{ image.locality }}
              <br />
            </span>
            <span v-if="image.stratigraphy">
              <b>{{ $t("search.table.stratigraphy") }}:</b>
              {{ image.stratigraphy }}
              <br />
            </span>
          </span>
        </v-tooltip>
      </v-col>

      <image-overflow
        :images="searchResultImages"
        :dialog="dialog"
        :current-index="currentIndex"
        @close:dialog="dialog = false"
        @update:index="currentIndex = $event"
      />
    </v-row>

    <v-row no-gutters class="my-4" justify="center" v-else>
      <v-col cols="12" style="max-width: 500px;">
        <v-alert
          class="mb-0"
          text
          border="left"
          icon="fas fa-search"
          color="secondary"
        >
          <div>
            {{ $t("search.imageNoResults") }}
          </div>

          <div v-if="!search.has_image.value">
            {{ $t("search.imageNoResultsFilterInfo") }}
            <v-btn
              x-small
              color="secondary"
              @click="updateSearchField({ id: 'has_image', value: 'true' })"
            >
              {{ $t("search.addFilter") }}</v-btn
            >
          </div>
        </v-alert>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import helperMixin from "@/mixins/helperMixin";
import ImageWrapper from "@/components/partial/image/ImageWrapper";
import ImageOverflow from "../partial/image/ImageOverflow";
import { mapActions, mapState } from "vuex";

export default {
  name: "TabImages",
  components: { ImageOverflow, ImageWrapper },
  mixins: [helperMixin],

  props: {
    responseResults: {
      type: Array,
      required: true
    },
    responseResultsCount: {
      type: Number,
      required: true
    }
  },

  data: () => ({
    dialog: false,
    currentIndex: 0
  }),

  computed: {
    ...mapState("search", ["search", "isLoading"]),
    ...mapState("settings", ["searchDrawer"])
  },

  methods: {
    ...mapActions("search", ["updateSearchField"]),

    openDialog(imageIndex) {
      this.dialog = true;
      this.currentIndex = imageIndex;
    },

    openDialogUsingImage(image) {
      this.dialog = true;
      let index = this.searchResultImages.findIndex(
        item => item.originalImage === image
      );
      this.currentIndex = index ? index : 0;
    }
  }
};
</script>

<style scoped>
.image-hover:hover {
  opacity: 0.6;
  transition: opacity 150ms ease-in;
}
.image-hover {
  transition: opacity 150ms ease-in;
}

.map-progress-circular {
  transition: margin-left 200ms ease-in-out;
}
</style>
