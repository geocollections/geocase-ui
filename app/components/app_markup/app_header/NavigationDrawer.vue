<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="$emit('update:navigationDrawer', $event)"
    app
    location="right"
    temporary
    theme="dark"
    style="z-index: 2050"
    color="primary"
  >
    <v-list density="compact">
      <v-list-subheader>ROUTES</v-list-subheader>
      <v-list-item v-for="item in routes" :key="item.name" :to="item.to">
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <div>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { useSettingsStore } from "@/stores/settings";

import { mapState } from "pinia";

export default {
  name: "NavigationDrawer",
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(useSettingsStore, ["routes"]),
  },
};
</script>

<style scoped></style>
