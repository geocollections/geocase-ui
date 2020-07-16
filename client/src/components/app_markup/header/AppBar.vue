<template>
  <v-hover v-slot:default="{ hover }">
    <v-app-bar
      dark
      app
      height="64"
      :color="$route.name !== 'Dashboard' ? 'primary' : ''"
      style="z-index: 2000"
      elevation="12"
      :class="{
        'app-bar-primary': $route.name === 'Dashboard',
        'app-bar-fossil': appBarFossil,
        'app-bar-mineral': appBarMineral,
        'app-bar-rock': appBarRock,
        'app-bar-meteorite': appBarMeteorite
      }"
      hide-on-scroll
    >
      <v-app-bar-nav-icon
        @click.stop="$emit('update:drawer')"
        aria-label="Open navigation drawer"
        class="mr-2"
      />

      <div class="d-flex align-center">
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

      <fast-search
        style="max-width: 300px"
        v-if="$route.name !== 'Dashboard' && $vuetify.breakpoint.mdAndUp"
        in-app-header
      />

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
import FastSearch from "../../search/FastSearch";
import { mapGetters } from "vuex";
export default {
  name: "AppBar",

  components: { FastSearch },

  computed: {
    ...mapGetters("detail", [
      "item",
      "isItemFossil",
      "isItemMineral",
      "isItemRock",
      "isItemMeteorite"
    ]),

    appBarFossil() {
      return this.$route.name === "Detail" && this.isItemFossil;
    },

    appBarMineral() {
      return this.$route.name === "Detail" && this.isItemMineral;
    },

    appBarRock() {
      return this.$route.name === "Detail" && this.isItemRock;
    },

    appBarMeteorite() {
      return this.$route.name === "Detail" && this.isItemMeteorite;
    }
  },

  methods: {
    goToFrontPage() {
      if (window.location.pathname === "/") {
        window.location.assign(window.location.origin);
      } else this.$router.push({ path: "/" });
    }
  }
};
</script>

<style scoped>
.app-bar-primary {
  background: linear-gradient(
    320deg,
    rgba(255, 160, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.7) 100%
  ) !important;
}

.app-bar-primary:hover {
  background: linear-gradient(
    320deg,
    rgba(255, 160, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.9) 100%
  ) !important;
}

.app-bar-fossil {
  background: linear-gradient(
    320deg,
    rgba(139, 195, 74, 0.9) 0%,
    rgba(0, 0, 0, 0.9) 100%
  ) !important;
}

/*.app-bar-fossil:hover {*/
/*  background: linear-gradient(*/
/*    320deg,*/
/*    rgba(139, 195, 74, 0.9) 0%,*/
/*    rgba(0, 0, 0, 0.9) 100%*/
/*  ) !important;*/
/*}*/

.app-bar-mineral {
  background: linear-gradient(
    320deg,
    rgba(233, 30, 99, 0.9) 0%,
    rgba(0, 0, 0, 0.9) 100%
  ) !important;
}

/*.app-bar-mineral:hover {*/
/*  background: linear-gradient(*/
/*    320deg,*/
/*    rgba(233, 30, 99, 0.9) 0%,*/
/*    rgba(0, 0, 0, 0.9) 100%*/
/*  ) !important;*/
/*}*/

.app-bar-rock {
  background: linear-gradient(
    320deg,
    rgba(3, 169, 244, 0.9) 0%,
    rgba(0, 0, 0, 0.9) 100%
  ) !important;
}

/*.app-bar-rock:hover {*/
/*  background: linear-gradient(*/
/*    320deg,*/
/*    rgba(3, 169, 244, 0.9) 0%,*/
/*    rgba(0, 0, 0, 0.9) 100%*/
/*  ) !important;*/
/*}*/

.app-bar-meteorite {
  background: linear-gradient(
    320deg,
    rgba(96, 125, 139, 0.9) 0%,
    rgba(0, 0, 0, 0.9) 100%
  ) !important;
}

/*.app-bar-meteorite:hover {*/
/*  background: linear-gradient(*/
/*    320deg,*/
/*    rgba(96, 125, 139, 0.9) 0%,*/
/*    rgba(0, 0, 0, 0.9) 100%*/
/*  ) !important;*/
/*}*/

.link:hover {
  cursor: pointer;
  opacity: 0.7;
}

.small-font {
  font-size: 0.9em;
}
</style>
