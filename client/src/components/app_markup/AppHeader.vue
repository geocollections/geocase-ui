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
          <span class="hidden-xs-only">-prototype</span>
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
    >
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="mb-1 font-weight-bold page-header">
            GeoCASe-prototype
          </h1>

          <FastSearch />

          <v-container>
            <DetailSearch :show-title="false" />
          </v-container>
        </v-col>
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
import FastSearch from "../search/FastSearch";
import DetailSearch from "../search/DetailSearch";
export default {
  name: "AppHeader",
  components: { FastSearch, DetailSearch },
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
}

.page-header {
  font-size: 3rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px #000000;
  line-height: 90%;
}
</style>
