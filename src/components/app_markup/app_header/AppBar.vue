<template>
  <v-hover v-slot:default="{ hover }">
    <v-app-bar
      dark
      app
      clipped-left
      height="64"
      style="z-index: 2020"
      elevation="12"
      class="app-bar-primary"
      :class="{
        'app-bar-fossil': appBarFossil,
        'app-bar-mineral': appBarMineral,
        'app-bar-rock': appBarRock,
        'app-bar-meteorite': appBarMeteorite,
      }"
    >
      <v-tooltip bottom z-index="3000">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            v-show="$route.name === 'Search'"
            @click.stop="$emit('toggle:searchDrawer')"
            aria-label="Toggle navigation drawer"
            class="mr-2"
            icon
          >
            <v-icon>fas fa-sliders-h</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("header.showSearch") }}</span>
      </v-tooltip>

      <v-toolbar-items>
        <v-tooltip bottom z-index="3000">
          <template v-slot:activator="{ on }">
            <v-toolbar-title
              v-on="on"
              class="font-weight-bold link mr-3 white--text align-self-center"
              style="letter-spacing: 1px"
            >
              <router-link to="/" class="white--text text-decoration-none">
                <span
                  class="hidden-xs-only"
                  :class="{ 'small-font': $vuetify.breakpoint.smOnly }"
                  >GeoCASe
                  <span v-if="!isProductionUrl">DEV</span>
                </span>
                <span class="hidden-sm-and-up">
                  <v-icon>fas fa-home</v-icon>
                </span>
              </router-link>
            </v-toolbar-title>
          </template>
          <span>{{ $t("header.titleTooltip") }}</span>
        </v-tooltip>

        <v-btn class="hidden-xs-only" text to="/search">{{
          $t("header.search")
        }}</v-btn>
        <v-btn class="hidden-md-and-down" text to="/about">{{
          $t("header.about")
        }}</v-btn>
        <v-btn class="hidden-md-and-down" text to="/access">{{
          $t("header.access")
        }}</v-btn>
        <v-btn
          class="hidden-md-and-down"
          text
          to="/partners_and_providers"
          exact
          >{{ $t("header.partners") }}</v-btn
        >
        <v-btn class="hidden-xs-only" text to="/tutorial">{{
          $t("header.tutorial")
        }}</v-btn>
      </v-toolbar-items>

      <v-spacer />

      <fast-search
        style="max-width: 300px"
        v-show="
          $route.name !== 'FrontPage' &&
          $route.name !== 'Search' &&
          $vuetify.breakpoint.mdAndUp
        "
        in-app-header
      />

      <v-toolbar-items>
        <LangButtons />

        <v-menu
          transition="slide-y-transition"
          v-model="externalResourcesDropdown"
          offset-y
          z-index="2101"
        >
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on">
              {{ $t("header.resources") }}
              <v-icon right>{{
                externalResourcesDropdown
                  ? "fas fa-caret-up"
                  : "fas fa-caret-down"
              }}</v-icon>
            </v-btn>
          </template>

          <v-list color="primary" dark dense>
            <v-list-item
              v-for="item in externalResources"
              :key="item.text"
              :href="item.url"
              target="ExternalResourceskWindow"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon
            v-on="on"
            @click.stop="$emit('toggle:navigationDrawer')"
            aria-label="Open navigation drawer"
          />
        </template>
        <span>{{ $t("header.showMenu") }}</span>
      </v-tooltip>
    </v-app-bar>
  </v-hover>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import FastSearch from "@/components/search/FastSearch";
import LangButtons from "@/components/LangButtons";
export default {
  name: "AppBar",

  components: { LangButtons, FastSearch },

  data: () => ({
    externalResourcesDropdown: false,
  }),

  computed: {
    ...mapGetters("settings", ["externalResources"]),
    ...mapGetters("detail", [
      "item",
      "isItemFossil",
      "isItemMineral",
      "isItemRock",
      "isItemMeteorite",
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
    },

    isProductionUrl() {
      return document.location.origin.includes("geocase.eu");
    },
  },

  methods: {
    goToFrontPage() {
      if (window.location.pathname === "/") {
        window.location.assign(window.location.origin);
      } else this.$router.push({ path: "/" });
    },
  },
};
</script>

<style scoped>
.app-bar-primary {
  background: linear-gradient(
    320deg,
    rgba(255, 160, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.9) 100%
  ) !important;
}

/*.app-bar-primary:hover {*/
/*  background: linear-gradient(*/
/*    320deg,*/
/*    rgba(255, 160, 0, 0.9) 0%,*/
/*    rgba(0, 0, 0, 0.9) 100%*/
/*  ) !important;*/
/*}*/

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
