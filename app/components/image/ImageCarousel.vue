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
          :aria-label="$t('imageGallery.inspectImage')"
          :title="$t('imageGallery.inspectImage')"
          @click.prevent="openGallery(index)"
        >
          <image-wrapper
            class="mx-auto"
            :image-src="entity.originalImage"
            :fallback-src="entity.thumbnailImage"
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
                class="tw:hover:opacity-70 text-decoration-none"
                >{{ $t("imageGallery.linkToImage") }}
                <v-icon color="primary" size="x-small"
                  >fa:fas fa-external-link-alt</v-icon
                >
              </a></v-list-item-subtitle
            >
          </div>

          <UButton
            icon="i-lucide-zoom-in"
            color="neutral"
            variant="outline"
            @click="openGallery(carouselItem)"
            >{{ $t("imageGallery.inspectImage") }}</UButton
          >
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
    <ImageOverflow
      :images="images"
      :dialog="galleryOpen"
      :current-index="galleryIndex"
      @close:dialog="galleryOpen = false"
      @update:index="galleryIndex = $event"
    />
  </v-card>
</template>

<script>
import ImageWrapper from "@/components/image/ImageWrapper.vue";
import ImageOverflow from "@/components/image/ImageOverflow.vue";
export default {
  name: "ImageCarousel",
  components: { ImageWrapper, ImageOverflow },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    cycleImages: false,
    galleryOpen: false,
    galleryIndex: 0,
    url: null,
    date: null,
    licence: null,
    carouselItem: 0,
    imageMaxHeight: "500",
  }),

  methods: {
    openGallery(index) {
      this.galleryIndex = index;
      this.galleryOpen = true;
      this.cycleImages = false;
    },
    activeImage(index) {
      this.carouselItem = index;
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
