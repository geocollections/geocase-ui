<template>
  <v-card class="mb-6">
    <v-carousel
      height="500"
      prev-icon="fa:fas fa-angle-left"
      next-icon="fa:fas fa-angle-right"
      delimiter-icon="fa:fas fa-minus"
      :cycle="cycleImages"
      interval="3000"
      @update:model-value="activeImage"
      :hide-delimiters="images.length < 2"
      :show-arrows="images.length > 1"
    >
      <v-carousel-item
        class="pa-2"
        v-for="(entity, index) in images"
        :key="index"
        :value="index"
      >
        <a
          :href="entity.originalImage"
          target="UrlWindow"
          :aria-label="entity.altText"
        >
          <image-wrapper
            class="mx-auto"
            :image-src="entity.thumbnailImage"
            :max-height="calculateImageMaxHeight(entity.imageHeight)"
            :value="carouselItem"
            :alt-text="entity.altText"
          />
        </a>
      </v-carousel-item>
    </v-carousel>

    <v-card flat>
      <v-list class="py-0" :three-line="!!(date || licence)">
        <v-list-item>
          <div>
            <v-list-item-subtitle v-if="date"
              >{{ $t("imageGallery.date") }}: {{ date }}</v-list-item-subtitle
            >
            <v-list-item-subtitle v-if="licence"
              >{{ $t("imageGallery.licence") }}:
              {{ licence }}</v-list-item-subtitle
            >
            <v-list-item-subtitle v-if="url"
              ><a
                :href="url"
                target="UrlWindow"
                class="link text-decoration-none"
                >{{ $t("imageGallery.linkToImage") }}
                <v-icon color="primary" size="x-small"
                  >fa:fas fa-external-link-alt</v-icon
                >
              </a></v-list-item-subtitle
            >
          </div>

          <v-list-item-action
            class="align-self-center"
            v-if="images.length > 1"
          >
            <v-switch
              hide-details
              v-model="cycleImages"
              :label="$t('imageGallery.cycleImages')"
              inset
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
import ImageWrapper from "@/components/image/ImageWrapper.vue";
export default {
  name: "ImageCarousel",
  components: { ImageWrapper },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    cycleImages: false,
    url: null,
    date: null,
    licence: null,
    carouselItem: 0,
    imageMaxHeight: "500",
  }),

  methods: {
    activeImage(index) {
      if (!this.images[index]) return;
      this.url = this.images[index].originalImage;
      this.licence = this.images[index].image_licence;
      this.date = this.images[index].image_date;
      this.licence = this.images[index].image_licence;
    },

    calculateImageMaxHeight(imageHeight) {
      if (imageHeight && imageHeight < this.imageMaxHeight)
        return imageHeight.toString();
      else return this.imageMaxHeight;
    },
  },
};
</script>

<style scoped>
.link:hover {
  opacity: 0.7;
}
</style>
