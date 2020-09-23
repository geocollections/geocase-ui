<template>
  <div class="app-header">
    <search-drawer
      :drawer="searchDrawer"
      @update:drawer="updateSearchDrawerState($event)"
      v-if="$route.name === 'Search'"
    />

    <app-bar
      @update:drawer="drawer = !drawer"
      @toggle:searchDrawer="updateSearchDrawerState(!searchDrawer)"
    />

    <landing-image v-if="$route.name === 'FrontPage'" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import SearchDrawer from "@/components/app_markup/header/SearchDrawer";
import AppBar from "@/components/app_markup/header/AppBar";
import LandingImage from "@/components/app_markup/header/LandingImage";
export default {
  name: "AppHeader",
  components: { SearchDrawer, AppBar, LandingImage },
  computed: {
    ...mapState("settings", ["searchDrawer"])
  },
  methods: {
    ...mapActions("settings", ["updateSearchDrawerState"])
  }
};
</script>

<style scoped></style>
