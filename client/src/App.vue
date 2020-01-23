<template>
  <v-app>
    <AppHeader />

    <v-content>
      <router-view />
    </v-content>

    <AppFooter />
  </v-app>
</template>

<script>
import AppHeader from "./components/app_markup/AppHeader";
import AppFooter from "./components/app_markup/AppFooter";

export default {
  name: "App",

  components: {
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
