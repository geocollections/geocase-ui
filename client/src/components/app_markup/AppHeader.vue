<template>
  <div class="app-header">
    <v-app-bar dark app height="64" color="primary" style="z-index: 2000">
      <div class="d-flex align-center">
        <v-img
          alt="GeoCASe Logo"
          class="shrink mr-4 link"
          contain
          :src="require('../../assets/geocase_logo.png')"
          transition="scale-transition"
          width="55"
          @click="goToGeocasePage"
          title="Go to GeoCASe page"
        />

        <v-toolbar-title
          class="align-center font-weight-bold link"
          style="letter-spacing: 1px"
          @click="goToFrontPage"
          title="Go to front page"
        >
          <span>GeoCASe</span>
          <span class="hidden-xs-only">-experimental</span>
        </v-toolbar-title>
      </div>

      <v-spacer />

      <div v-if="$route.name === 'Detail'">
        <v-btn icon @click="$router.go(-1)" title="Go back">
          <v-icon large>mdi-arrow-left</v-icon>
        </v-btn>
      </div>
    </v-app-bar>

    <!-- LANDING IMAGE -->
    <v-parallax
      v-if="$route.name === 'GeoCASe-prototype'"
      class="landing-image"
      :src="require('@/assets/geocase_landing.jpg')"
      style="height: 30vh;"
    >
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="mb-1 font-weight-bold page-header">
            GeoCASe-prototype
          </h1>

          <FastSearch />
        </v-col>
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
import FastSearch from "../search/FastSearch";
export default {
  name: "AppHeader",
  components: { FastSearch },
  methods: {
    goToGeocasePage() {
      window.open("http://www.geocase.eu/", "GeocaseWindow");
    },

    goToFrontPage() {
      if (window.location.pathname === "/") {
        window.location.assign(window.location.href);
      } else this.$router.push({ path: "/" });
    }
  }
};
</script>

<style scoped>
.link:hover {
  cursor: pointer;
  opacity: 0.9;
}

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
