<template>
  <div
    class="d-flex flex-nowrap"
    :class="{
      'overflow-y-auto flex-row': overflowY,
      'overflow-x-auto flex-column': overflowX
    }"
  >
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      style="z-index: 3000;"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-card
          flat
          class="px-3 py-2 image-hover"
          v-for="(entity, index) in images"
          :key="index"
          v-on="on"
          v-bind="attrs"
          @click="currentIndex = index"
        >
          <image-wrapper width="150" :image-src="entity.extractedImage" />
        </v-card>
      </template>

      <v-card dark>
        <v-toolbar dark color="primary">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dark icon @click="dialog = false">
                <v-icon>fas fa-times</v-icon>
              </v-btn>
            </template>
            <span>Close gallery</span>
          </v-tooltip>

          <v-toolbar-title>Image gallery</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dark icon @click="showGallery = !showGallery">
                <v-icon small>fas fa-th</v-icon>
              </v-btn>
            </template>
            <span>{{ `${showGallery ? "Hide" : "Show"} thumbnails` }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" dark icon @click="dialog = false">
                <v-icon>fas fa-times</v-icon>
              </v-btn>
            </template>
            <span>Close gallery</span>
          </v-tooltip>
        </v-toolbar>

        <v-row no-gutters>
          <v-col cols="12" :sm="showGallery ? 9 : 12">
            <image-wrapper
              max-height="unset"
              :image-src="images[currentIndex].extractedImage"
            />
          </v-col>

          <v-col v-if="showGallery" cols="12" sm="3">
            images
          </v-col>
        </v-row>

        <v-card-text class="pt-5 pb-0">
          <div v-if="images[currentIndex].image_author">
            Author: {{ images[currentIndex].image_author }}
          </div>
          <div v-if="images[currentIndex].image_date">
            Date: {{ images[currentIndex].image_date }}
          </div>
          <div v-if="images[currentIndex].image_licence">
            Licence: {{ images[currentIndex].image_licence }}
          </div>
          <div v-if="images[currentIndex].extractedImage">
            <a
              :href="images[currentIndex].extractedImage"
              target="UrlWindow"
              class="link text-decoration-none"
              >Link to image
              <v-icon color="primary" x-small>fas fa-external-link-alt</v-icon>
            </a>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ImageWrapper from "./ImageWrapper";
export default {
  name: "ImageOverflow",
  components: { ImageWrapper },
  props: {
    images: {
      type: Array,
      required: true
    },
    overflowY: {
      type: Boolean,
      default: true
    },
    overflowX: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dialog: false,
    currentIndex: 0,
    showGallery: true
  })
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
