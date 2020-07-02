<template>
  <v-app>
    <AppHeader />

    <v-content
      :class="{
        'pt-2': $route.name === 'Dashboard',
        'custom-pb': $vuetify.breakpoint.smAndDown
      }"
    >
      <router-view />
    </v-content>

    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from "./components/app_markup/AppHeader";
import AppFooter from "./components/app_markup/AppFooter";
import toastMixin from "./mixins/toastMixin";

export default {
  name: "App",

  components: {
    AppFooter,
    AppHeader
  },

  mixins: [toastMixin]
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
  padding-bottom: 200px !important;
}
</style>
