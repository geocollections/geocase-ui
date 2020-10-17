<template>
  <v-card class="mb-6">
    <v-carousel
      height="unset"
      prev-icon="fas fa-angle-left"
      next-icon="fas fa-angle-right"
      delimiter-icon="fas fa-minus"
      :cycle="cycleImages"
      interval="3000"
      @change="activeImage"
      :hide-delimiters="images.length < 2"
      :show-arrows="images.length > 1"
    >
      <v-carousel-item
        class="pa-2"
        :href="entity.extractedImage"
        target="UrlWindow"
        v-for="(entity, index) in images"
        :key="index"
      >
        <image-wrapper
          class="mx-auto"
          :image-src="entity.extractedImage"
          max-height="500"
          :value="carouselItem"
        />
      </v-carousel-item>
    </v-carousel>

    <v-card flat>
      <v-list class="py-0" :three-line="!!(author || date || licence)">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle v-if="author"
              >Author: {{ author }}</v-list-item-subtitle
            >
            <v-list-item-subtitle v-if="date"
              >Date: {{ date }}</v-list-item-subtitle
            >
            <v-list-item-subtitle v-if="licence"
              >Licence: {{ licence }}</v-list-item-subtitle
            >
            <v-list-item-subtitle v-if="url"
              ><a
                :href="url"
                target="UrlWindow"
                class="link text-decoration-none"
                >Link to image
                <v-icon color="primary" x-small
                  >fas fa-external-link-alt</v-icon
                >
              </a></v-list-item-subtitle
            >
          </v-list-item-content>

          <v-list-item-action
            class="align-self-center"
            v-if="images.length > 1"
          >
            <v-switch
              hide-details
              v-model="cycleImages"
              label="Cycle Images"
              inset
            ></v-switch>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <image-overflow v-if="images.length > 1 && false" :images="images" />
    </v-card>
  </v-card>
</template>

<script>
import ImageWrapper from "@/components/partial/image/ImageWrapper";
import ImageOverflow from "@/components/partial/image/ImageOverflow";
export default {
  name: "ImageCarousel",
  components: { ImageOverflow, ImageWrapper },
  props: {
    images: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    cycleImages: false,
    url: null,
    author: null,
    date: null,
    licence: null,
    carouselItem: 0
  }),

  methods: {
    activeImage(index) {
      this.url = this.images[index].extractedImage;
      this.author = this.images[index].image_author;
      this.licence = this.images[index].image_licence;
      this.date = this.images[index].image_date;
      this.licence = this.images[index].image_licence;
    }
  }
};
</script>

<style scoped>
.link:hover {
  opacity: 0.7;
}
</style>
