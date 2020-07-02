<template>
  <v-parallax
    v-if="$route.name === 'Dashboard'"
    class="landing-image"
    :src="require('@/assets/geocase_landing.jpg')"
    style="height: 30vh;"
  >
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 class="mb-1 font-weight-bold page-header">
          GeoCASe
        </h1>

        <FastSearch />
      </v-col>
    </v-row>
  </v-parallax>
</template>

<script>
import FastSearch from "../../search/FastSearch";

export default {
  name: "LandingImage",
  components: { FastSearch }
};
</script>

<style scoped>
.landing-image {
  margin-top: 64px;
  min-height: 160px;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}

.page-header {
  font-size: 3rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px #000000;
  line-height: 90%;
}
</style>
