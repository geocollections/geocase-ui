<template>
  <div
    class="d-flex flex-nowrap image-overflow"
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
          title="Open gallery"
        >
          <image-wrapper width="150" :image-src="entity.extractedImage" />
        </v-card>
      </template>

      <v-card dark>
        <v-toolbar dark color="primary" height="64">
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

        <v-row
          no-gutters
          style="max-height: calc(100vh - 64px); height: calc(100vh - 64px)"
        >
          <!-- IMAGE COL -->
          <v-col
            :cols="showGallery ? 8 : 12"
            :sm="showGallery ? 9 : 12"
            :xl="showGallery ? 10 : 12"
          >
            <v-row no-gutters class="mt-4">
              <!-- IMAGE -->
              <v-col cols="12">
                <!-- IMAGE CONTROL -->
                <div
                  class="d-flex flex-row justify-space-between align-center image-overflow--control"
                  :style="`height: ${$vuetify.breakpoint.smAndUp ? 50 : 30}vh`"
                  :class="{
                    'image-control-66':
                      showGallery && $vuetify.breakpoint.xsOnly,
                    'image-control-75':
                      showGallery && $vuetify.breakpoint.smAndUp,
                    'image-control-83':
                      showGallery && $vuetify.breakpoint.xlOnly
                  }"
                >
                  <v-btn
                    class="ma-3"
                    color="primary"
                    x-large
                    icon
                    @click="showPrev"
                  >
                    <v-icon x-large>fas fa-angle-left</v-icon>
                  </v-btn>
                  <v-btn
                    class="ma-3"
                    color="primary"
                    x-large
                    icon
                    @click="showNext"
                  >
                    <v-icon x-large>fas fa-angle-right</v-icon>
                  </v-btn>
                </div>

                <!-- IMAGE -->
                <image-wrapper
                  :style="`height: ${$vuetify.breakpoint.smAndUp ? 50 : 30}vh`"
                  max-height="50vh"
                  :image-src="images[currentIndex].extractedImage"
                />
              </v-col>

              <!-- IMAGE INFO -->
              <v-col cols="12">
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
                      <v-icon color="primary" x-small
                        >fas fa-external-link-alt</v-icon
                      >
                    </a>
                  </div>
                </v-card-text>
              </v-col>
            </v-row>
          </v-col>

          <!-- IMAGE GALLERY COL -->
          <v-col
            class="image-overflow--gallery white black--text pa-1"
            v-if="showGallery"
            cols="4"
            sm="3"
            xl="2"
            style="max-height: calc(100vh - 64px); overflow-y: auto"
          >
            <v-row no-gutters>
              <v-col
                cols="12"
                md="6"
                v-for="(entity, index) in images"
                :key="index"
                class="pa-1"
              >
                <v-card
                  class="image-hover"
                  light
                  flat
                  tile
                  @click="currentIndex = index"
                  :style="
                    `outline-color: ${$vuetify.theme.themes.light.primary}`
                  "
                  :class="{ 'active-outline': currentIndex === index }"
                >
                  <image-wrapper
                    :contain="false"
                    max-height="100"
                    :image-src="entity.extractedImage"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
  }),
  methods: {
    showPrev() {
      if (this.currentIndex > 0) this.currentIndex -= 1;
      else this.currentIndex = this.images.length - 1;
    },

    showNext() {
      if (this.currentIndex < this.images.length - 1) this.currentIndex += 1;
      else this.currentIndex = 0;
    }
  }
};
</script>

<style scoped>
.image-hover:hover {
  opacity: 0.8;
  transition: opacity 150ms ease-in;
}
.image-hover {
  transition: opacity 150ms ease-out;
}

.image-overflow--control {
  position: absolute;
  z-index: 1;
  width: 100%;
}

.image-control-66 {
  width: 66.6666666667%;
}

.image-control-75 {
  width: 75%;
}

.image-control-83 {
  width: 83.3333333333%;
}

.image-overflow--gallery {
  box-shadow: -3px 0 1px -2px rgba(255, 255, 255, 0.2),
    -2px 0 2px 0 rgba(255, 255, 255, 0.14),
    -1px 0 5px 0 rgba(255, 255, 255, 0.12);
}

.active-outline {
  outline: 4px solid;
}
</style>
