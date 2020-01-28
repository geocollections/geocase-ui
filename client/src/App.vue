<template>
  <v-app>
    <AppHeader />

    <Snackbar />

    <v-content>
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
html {
  overflow-y: auto !important;
}
</style>
