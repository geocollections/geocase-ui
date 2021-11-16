<template>
  <v-img
    v-if="imageSrc"
    :max-height="maxHeight"
    :width="width"
    min-width="72"
    :contain="contain"
    aspect-ratio="1"
    :src="imageSrc"
    :lazy-src="imageSrc"
    :class="{ 'background-size-unset': backgroundSizeUnset }"
    :alt="altText"
  >
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-row>
    </template>
  </v-img>
</template>

<script>
export default {
  name: "ImageWrapper",
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
    maxHeight: {
      type: String,
      default: "400",
    },
    width: {
      type: String,
      default: "unset",
    },
    contain: {
      type: Boolean,
      default: true,
    },
    backgroundSizeUnset: {
      type: Boolean,
      default: false,
    },
    altText: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
.background-size-unset >>> .v-image__image {
  background-size: unset;
}
</style>
