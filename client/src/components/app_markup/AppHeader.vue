<template>
  <div class="app-header">
    <navigation-drawer :drawer="drawer" @update:drawer="drawer = $event" />

    <advanced-search-drawer v-if="$route.name === 'Search'" />

    <app-bar
      @update:drawer="drawer = !drawer"
      @toggle:searchDrawer="updateSearchDrawerState(!searchDrawer)"
    />

    <landing-image v-if="$route.name === 'FrontPage'" />
  </div>
</template>

<script>
import LandingImage from "./header/LandingImage";
import AppBar from "./header/AppBar";
import NavigationDrawer from "./header/NavigationDrawer";
import AdvancedSearchDrawer from "@/components/search/advanced_search/AdvancedSearchDrawer";
import { mapActions, mapState } from "vuex";
export default {
  name: "AppHeader",
  components: { AdvancedSearchDrawer, NavigationDrawer, AppBar, LandingImage },
  data: () => ({
    drawer: false
  }),
  computed: {
    ...mapState("settings", ["searchDrawer"])
  },
  methods: {
    ...mapActions("settings", ["updateSearchDrawerState"])
  }
};
</script>

<style scoped></style>
