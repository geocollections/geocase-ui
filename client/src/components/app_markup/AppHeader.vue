<template>
  <div class="app-header">
    <app-bar-wrapper />

    <landing-image />
  </div>
</template>

<script>
import LandingImage from "./header/LandingImage";
import AppBarWrapper from "./header/AppBarWrapper";
export default {
  name: "AppHeader",
  components: { AppBarWrapper, LandingImage }
};
</script>

<style scoped></style>
