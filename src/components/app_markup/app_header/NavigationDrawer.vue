<template>
  <v-navigation-drawer
    :value="drawer"
    @input="$emit('update:navigationDrawer', $event)"
    app
    right
    temporary
    dark
    style="z-index: 2050"
    color="primary"
  >
    <v-list dense>
      <v-subheader>ROUTES</v-subheader>
      <v-list-item v-for="item in routes" :key="item.name" :to="item.to">
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NavigationDrawer",
  props: {
    drawer: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters("settings", ["routes"]),
  },
};
</script>

<style scoped></style>
