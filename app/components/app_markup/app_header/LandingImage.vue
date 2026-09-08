<template>
  <section
    class="landing-image"
    :style="{ backgroundImage: `url(${landingImage})` }"
  >
    <v-row class="fill-height" align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="mb-2 font-weight-bold page-header" style="font-size: 2.5rem">
          GeoCASe 2.0
          <div
            class="hidden-sm-and-down"
            :class="$vuetify.display.xl ? 'mt-8' : 'mt-4'"
            :style="titleStyleObject"
          >
            {{ $t("frontPage.title") }}
          </div>
        </h1>

        <FastSearch />
      </v-col>
    </v-row>
  </section>
</template>

<script>
import FastSearch from "@/components/search/FastSearch.vue";

export default {
  name: "LandingImage",
  components: { FastSearch },
  computed: {
    titleStyleObject() {
      return {
        fontSize: this.$vuetify.display.xl ? "4rem" : "3.125rem",
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
  background-size: cover;
  background-position: center;
  min-height: 37vh;

  padding: 32px 0;
  min-height: 275px;
  -webkit-box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.page-header {
  font-size: 3rem;
  color: #ffffff;
  text-shadow: 4px 4px 14px #000000;
  line-height: 90%;
}
</style>
