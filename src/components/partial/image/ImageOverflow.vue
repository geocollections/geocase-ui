<template>
  <v-dialog
    :value="dialog"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    style="z-index: 3000;"
    no-click-animation
  >
    <v-card tile>
      <v-toolbar dark color="primary" height="64">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" dark icon @click="$emit('close:dialog')">
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("imageGallery.closeGallery") }}</span>
        </v-tooltip>

        <v-toolbar-title>{{ $t("imageGallery.imageGallery") }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" dark icon @click="showGallery = !showGallery">
              <v-icon small>fas fa-th</v-icon>
            </v-btn>
          </template>
          <span>{{
            $t(`imageGallery.${showGallery ? "hide" : "show"}Thumbnails`)
          }}</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" dark icon @click="$emit('close:dialog')">
              <v-icon>fas fa-times</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("imageGallery.closeGallery") }}</span>
        </v-tooltip>
      </v-toolbar>

      <v-row no-gutters>
        <!-- IMAGE COL -->
        <v-col
          :cols="showGallery ? 8 : 12"
          :sm="showGallery ? 9 : 12"
          :xl="showGallery ? 10 : 12"
        >
          <v-row no-gutters>
            <!-- IMAGE -->
            <v-col cols="12">
              <!-- IMAGE CONTROL -->
              <div
                class="d-flex flex-row justify-space-between align-center image-overflow--control"
                style="height: calc(100vh - 64px)"
                :class="{
                  'image-control-66': showGallery && $vuetify.breakpoint.xsOnly,
                  'image-control-75':
                    showGallery && $vuetify.breakpoint.smAndUp,
                  'image-control-83': showGallery && $vuetify.breakpoint.xlOnly
                }"
              >
                <!-- Todo: Fix mobile view next and prev buttons -->

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
                max-height="calc(100vh - 64px)"
                :image-src="images[currentIndex].extractedImage"
                background-size-unset
              />
            </v-col>

            <!-- IMAGE INFO -->
            <v-col
              :cols="showGallery ? 8 : 12"
              :sm="showGallery ? 9 : 12"
              :xl="showGallery ? 10 : 12"
              class="image-info"
            >
              <v-card-text
                class="pa-6 font-weight-bold"
                style="font-size: 1.125rem; line-height: 1.5;"
              >
                <div v-if="images[currentIndex].image_date">
                  {{ $t("imageGallery.date") }}:
                  {{ images[currentIndex].image_date }}
                </div>
                <div v-if="images[currentIndex].image_licence">
                  {{ $t("imageGallery.licence") }}:
                  {{ images[currentIndex].image_licence }}
                </div>
                <div>
                  <router-link
                    class="text-decoration-none"
                    :to="{ path: `specimen/${images[currentIndex].id}` }"
                    >{{ $t("imageGallery.goToSpecimenView") }}</router-link
                  >
                </div>
                <div v-if="images[currentIndex].extractedImage">
                  <a
                    :href="images[currentIndex].extractedImage"
                    target="UrlWindow"
                    class="link text-decoration-none"
                    >{{ $t("imageGallery.linkToImage") }}
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
          style="height: calc(100vh - 64px); overflow-y: auto"
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
                @click="$emit('update:index', index)"
                :style="`outline-color: ${$vuetify.theme.themes.light.primary}`"
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
</template>

<script>
import ImageWrapper from "@/components/partial/image/ImageWrapper";

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
    },
    dialog: {
      type: Boolean,
      default: false
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    showGallery: true
  }),
  beforeDestroy() {
    window.removeEventListener("keyup", this.handleKeyup);
  },
  watch: {
    dialog(newVal) {
      if (newVal) window.addEventListener("keyup", this.handleKeyup);
      else window.removeEventListener("keyup", this.handleKeyup);
    }
  },
  methods: {
    showPrev() {
      if (this.currentIndex > 0)
        this.$emit("update:index", this.currentIndex - 1);
      else this.$emit("update:index", this.images.length - 1);
    },

    showNext() {
      if (this.currentIndex < this.images.length - 1)
        this.$emit("update:index", this.currentIndex + 1);
      else this.$emit("update:index", 0);
    },

    handleKeyup(event) {
      if (event?.keyCode === 39) this.showNext();
      if (event?.keyCode === 37) this.showPrev();
      if (event?.keyCode === 27) this.$emit("close:dialog");
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
  /*box-shadow: -3px 0 1px -2px rgba(255, 255, 255, 0.2),*/
  /*  -2px 0 2px 0 rgba(255, 255, 255, 0.14),*/
  /*  -1px 0 5px 0 rgba(255, 255, 255, 0.12);*/
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  /*box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);*/
}

.active-outline {
  outline: 4px solid;
}

.image-info {
  position: absolute;
  bottom: 0;
  z-index: 5000;
  opacity: 0.3;
  transition: all 200ms ease-out;
}

.image-info:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.8);
  transition: all 200ms ease-in;
}
</style>
