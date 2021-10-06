<template>
  <div class="app-header">
    <search-drawer
      :drawer="searchDrawer"
      @update:drawer="updateSearchDrawerState($event)"
      v-if="$route.name === 'Search'"
    />

    <app-bar
      @toggle:navigationDrawer="drawer = !drawer"
      @toggle:searchDrawer="updateSearchDrawerState(!searchDrawer)"
    />

    <NavigationDrawer
      :drawer="drawer"
      @update:navigationDrawer="drawer = $event"
    />

    <landing-image v-if="$route.name === 'FrontPage'" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import SearchDrawer from "@/components/app_markup/app_header/SearchDrawer";
import AppBar from "@/components/app_markup/app_header/AppBar";
import LandingImage from "@/components/app_markup/app_header/LandingImage";
import NavigationDrawer from "@/components/app_markup/app_header/NavigationDrawer";
export default {
  name: "AppHeader",
  components: { NavigationDrawer, SearchDrawer, AppBar, LandingImage },
  data: () => ({
    drawer: false
  }),
  mounted() {
    if (this.$vuetify.breakpoint.mdAndUp) this.updateSearchDrawerState(true);
  },
  computed: {
    ...mapState("settings", ["searchDrawer"])
  },
  methods: {
    ...mapActions("settings", ["updateSearchDrawerState"])
  }
};
</script>

<style scoped></style>
