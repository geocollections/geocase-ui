<template>
  <v-img
    :alt="$t('header.landingPageAltText')"
    class="landing-image"
    :src="landingImage"
    style="height: 37vh"
  >
    <v-row class="fill-height" align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="mb-2 font-weight-bold page-header" style="font-size: 2.5rem">
          GeoCASe 2.0
          <div
            class="hidden-sm-and-down"
            :class="$vuetify.breakpoint.xlOnly ? 'mt-8' : 'mt-4'"
            :style="titleStyleObject"
          >
            {{ $t("frontPage.title") }}
          </div>
        </h1>

        <FastSearch />
      </v-col>
    </v-row>
  </v-img>
</template>

<script>
import FastSearch from "@/components/search/FastSearch";

export default {
  name: "LandingImage",
  components: { FastSearch },
  computed: {
    titleStyleObject() {
      return {
        fontSize: this.$vuetify.breakpoint.xlOnly ? "4rem" : "3.125rem",
      };
    },

    landingImage() {
      return "https://files.geocollections.info/img/geocase/front_page/geocase_landing.jpg";
    },
  },
};
</script>

<style scoped>
.landing-image {
  /*margin-top: 64px;*/
  padding-top: 64px;
  min-height: 275px;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.page-header {
  font-size: 3rem;
  color: #ffffff;
  text-shadow: 4px 4px 14px #000000;
  line-height: 90%;
}
</style>
