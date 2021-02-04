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
import { mapActions, mapState } from "vuex";
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

  metaInfo() {
    const description = this.$t("seo.description");
    const ogTitle = this.$t("seo.ogTitle");
    const image =
      "https://files.geocollections.info/img/geocase/front_page/geocase_landing.jpg";
    const ogUrl = document.location.href;
    const imageAlt = this.$t("header.landingPageAltText");
    return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: "Welcome",
      // all titles will be injected into this template
      titleTemplate: "%s | GeoCASe",
      meta: [
        {
          vmid: "description",
          name: "description",
          content: description
        },
        // Essential
        {
          vmid: "og:title",
          property: "og:title",
          content: ogTitle
        },
        {
          vmid: "og:description",
          property: "og:description",
          content: description
        },
        {
          vmid: "og:image",
          property: "og:image",
          content: image
        },
        {
          vmid: "og:url",
          property: "og:url",
          content: ogUrl
        },
        {
          vmid: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image"
        },
        // Non-Essential
        {
          vmid: "og:site_name",
          property: "og:site_name",
          content: "GeoCASe"
        },
        {
          vmid: "og:image:alt",
          name: "og:image:alt",
          content: imageAlt
        },
        {
          vmid: "twitter:image:alt",
          name: "twitter:image:alt",
          content: imageAlt
        }
      ]
    };
  },

  computed: {
    ...mapState("cookie", ["cookieLaw"])
  },

  created() {
    this.getStats();
    this.getAllFieldNames();
  },

  methods: {
    ...mapActions("frontpage", ["getStats"]),
    ...mapActions("search", ["getAllFieldNames"]),
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
