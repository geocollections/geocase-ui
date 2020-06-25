<template>
  <v-app-bar dark app height="64" color="primary" style="z-index: 2000">
    <div class="d-flex align-center">
      <v-img
        alt="GeoCASe Logo"
        class="shrink mr-4 link"
        contain
        :src="require('@/assets/geocase_logo.png')"
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
        <v-icon large>fas fa-arrow-left</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBarWrapper",
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
</style>
