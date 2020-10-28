<template>
  <v-card flat>
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
                v-if="image.extractedImage"
                :image-src="image.extractedImage"
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
              <b>Collection:</b> {{ image.collectioncode }}
              <br />
            </span>
            <span v-if="image.unitid">
              <b>Object ID:</b>
              {{ image.unitid }}
              <br />
            </span>
            <span v-if="image.fullscientificname">
              <b>Full Scientific Name:</b>
              {{ image.fullscientificname }}
              <br />
            </span>
            <span v-if="image.country">
              <b>Country:</b>
              {{ image.country }}
              <br />
            </span>
            <span v-if="image.locality">
              <b>Locality:</b>
              {{ image.locality }}
              <br />
            </span>
            <span v-if="image.stratigraphy">
              <b>Stratigraphy:</b>
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

    <v-row class="mx-0" justify="center" v-else>
      <v-col cols="12" style="max-width: 500px;">
        <v-alert
          class="mb-0"
          text
          border="left"
          icon="fas fa-search"
          color="secondary"
        >
          <div>
            Couldn't find any images with these search parameters.
          </div>

          <div v-if="!search.has_image.value">
            Add filter so it would only show results which have images.
            <v-btn
              x-small
              color="secondary"
              @click="updateSearchField({ id: 'has_image', value: 'true' })"
              >Add filter</v-btn
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
import ImageOverflow from "../image/ImageOverflow";
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
    ...mapState("search", ["search"])
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
        item => item.extractedImage === image
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
</style>
