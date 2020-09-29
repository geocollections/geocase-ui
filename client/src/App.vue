<template>
  <v-app>
    <app-header />

    <v-main
      :class="{
        'pt-2': $route.name === 'FrontPage',
        'custom-pb': $vuetify.breakpoint.smAndDown
      }"
    >
      <router-view />
    </v-main>

    <CookieLaw v-if="cookieLaw" v-on:accept="closeCookieLaw" />

    <app-footer />
  </v-app>
</template>

<script>
import {mapActions, mapState} from "vuex";
import toastMixin from "@/mixins/toastMixin";
import AppHeader from "@/components/app_markup/AppHeader";
import AppFooter from "@/components/app_markup/AppFooter";
import CookieLaw from "@/components/partial/CookieLaw";

export default {
  name: "App",

  components: {
    CookieLaw,
    AppFooter,
    AppHeader
  },

  mixins: [toastMixin],

  computed: {
    ...mapState("cookie", ["cookieLaw"])
  },

  created() {
    this.getStats();
  },

  methods: {
    ...mapActions("frontpage", ["getStats"]),
    ...mapActions("cookie", ["closeCookieLaw"])
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700,800,900&display=swap");

html {
  overflow-y: auto !important;
}

.v-application {
  font-family: "Nunito", sans-serif !important;
  -webkit-font-smoothing: antialiased;
}

.custom-pb {
  /* Main padding is calculated on refresh, no need to add custom 200px */
  /*padding-bottom: 200px !important;*/
}
</style>
