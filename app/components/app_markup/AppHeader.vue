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
  </div>
</template>

<script>
import { useSettingsStore } from "@/stores/settings";

import { mapActions, mapState } from "pinia";
import SearchDrawer from "@/components/app_markup/app_header/SearchDrawer.vue";
import AppBar from "@/components/app_markup/app_header/AppBar.vue";
import NavigationDrawer from "@/components/app_markup/app_header/NavigationDrawer.vue";
export default {
  name: "AppHeader",
  components: { NavigationDrawer, SearchDrawer, AppBar },
  data: () => ({
    drawer: false,
  }),
  mounted() {
    if (this.$vuetify.display.mdAndUp) this.updateSearchDrawerState(true);
  },
  computed: {
    ...mapState(useSettingsStore, ["searchDrawer"]),
  },
  methods: {
    ...mapActions(useSettingsStore, ["updateSearchDrawerState"]),
  },
};
</script>

<style scoped></style>
