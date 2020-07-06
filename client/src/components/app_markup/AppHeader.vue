<template>
  <div class="app-header">
    <navigation-drawer :drawer="drawer" @update:drawer="drawer = $event" />

    <app-bar @update:drawer="drawer = !drawer" />

    <landing-image />
  </div>
</template>

<script>
import LandingImage from "./header/LandingImage";
import AppBar from "./header/AppBar";
import NavigationDrawer from "./header/NavigationDrawer";
export default {
  name: "AppHeader",
  components: { NavigationDrawer, AppBar, LandingImage },
  data: () => ({
    drawer: false
  })
};
</script>

<style scoped></style>
