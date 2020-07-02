<template>
  <v-hover v-slot:default="{ hover }">
    <v-app-bar
      dark
      app
      height="64"
      :color="$route.name !== 'Dashboard' ? 'primary' : ''"
      style="z-index: 2000"
      :elevation="$route.name === 'Dashboard' && hover ? 12 : 4"
      :class="{ 'app-bar-front': $route.name === 'Dashboard' }"
    >
      <div class="d-flex align-center">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-img
              v-on="on"
              alt="GeoCASe Logo"
              class="shrink mr-4 link"
              contain
              :src="require('@/assets/geocase_logo.png')"
              transition="scale-transition"
              width="55"
              @click="goToGeocasePage"
            />
          </template>
          <span>Go to current GeoCASe application</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-toolbar-title
              v-on="on"
              class="align-center font-weight-bold link"
              style="letter-spacing: 1px"
              @click="goToFrontPage"
            >
              <!--        <span-->
              <!--          class="hidden-xs-only"-->
              <!--          :class="{ 'small-font': $vuetify.breakpoint.smOnly }"-->
              <!--          >GeoCASe experimental</span-->
              <!--        >-->
              <span>GeoCASe experimental</span>
              <!--        <span class="hidden-sm-and-up">-->
              <!--          <v-icon large>fas fa-home</v-icon>-->
              <!--        </span>-->
            </v-toolbar-title>
          </template>
          <span>Go to front page</span>
        </v-tooltip>
      </div>

      <v-spacer />

      <div v-if="$route.name === 'Detail'">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon @click="$router.go(-1)">
              <v-icon large>fas fa-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>Go back</span>
        </v-tooltip>
      </div>
    </v-app-bar>
  </v-hover>
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
.app-bar-front {
  /*background: linear-gradient(*/
  /*  320deg,*/
  /*  rgba(255, 193, 7, 0.46) 0%,*/
  /*  rgba(255, 160, 0, 0.46) 100%*/
  /*) !important;*/

  background: linear-gradient(
    320deg,
    rgba(0, 0, 0, 0.46) 0%,
    rgba(255, 160, 0, 0.46) 100%
  ) !important;
}

.app-bar-front:hover {
  /*background: linear-gradient(*/
  /*  320deg,*/
  /*  rgba(255, 193, 7, 1) 0%,*/
  /*  rgba(255, 160, 0, 1) 100%*/
  /*) !important;*/

  background: linear-gradient(
    320deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(255, 160, 0, 1) 100%
  ) !important;
}

.link:hover {
  cursor: pointer;
  opacity: 0.7;
}

.small-font {
  font-size: 0.9em;
}
</style>
