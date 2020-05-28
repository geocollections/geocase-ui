<template>
  <v-app>
    <AppHeader />

    <Snackbar />

    <!-- Overriding vuetify padding which is set on page load -->
    <v-content
      :class="{
        'pt-2': $route.name === 'GeoCASe-prototype',
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
import Snackbar from "./components/partial/Snackbar";

export default {
  name: "App",

  components: {
    Snackbar,
    AppFooter,
    AppHeader
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
  padding-bottom: 200px !important;
}
</style>
