<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "#imports";
import { useSettingsStore } from "@/stores/settings";
import { useToggle } from "@/composables/useToggle";
import { useDesktopLayout } from "@/composables/useDesktopLayout";
import AppBar from "./app_header/AppBar.vue";
import NavigationDrawer from "./app_header/NavigationDrawer.vue";
import SearchDrawer from "./app_header/SearchDrawer.vue";

const route = useRoute();
const settings = useSettingsStore();
const { isOpen: drawer, toggle, close } = useToggle();
const { isDesktop } = useDesktopLayout();
watch(isDesktop, (value) => settings.updateSearchDrawerState(value));
watch(
  () => route.path,
  () => {
    close();
    if (!isDesktop.value) settings.updateSearchDrawerState(false);
  },
);
</script>

<template>
  <AppBar
    @toggle:navigation-drawer="toggle"
    @toggle:search-drawer="
      settings.updateSearchDrawerState(!settings.searchDrawer)
    "
  />
  <SearchDrawer
    v-if="route.name === 'Search'"
    v-model:drawer="settings.searchDrawer"
  />
  <NavigationDrawer v-model:drawer="drawer" />
</template>
