<template>
  <v-app>
    <AppHeader />

    <v-content>
      <Dashboard />
    </v-content>

    <AppFooter />
  </v-app>
</template>

<script>
import Dashboard from "./components/Dashboard";
import AppHeader from "./components/app_markup/AppHeader";
import AppFooter from "./components/app_markup/AppFooter";

export default {
  name: "App",

  components: {
    AppFooter,
    AppHeader,
    Dashboard
  }
};
</script>
