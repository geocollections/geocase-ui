<template>
  <v-fab-transition class="OpenFilters">
    <v-btn
      v-show="showFab"
      small
      fixed
      bottom
      right
      color="amber"
      dark
      @click="updateSearchDrawerState(true)"
      style="z-index: 1500"
    >
      <v-icon left small>fas fa-sliders-h</v-icon>
      <span>Filters</span>
    </v-btn>
  </v-fab-transition></template
>

<script>
import { mapActions } from "vuex";

export default {
  name: "OpenFilters",

  computed: {
    showFab() {
      return this.$vuetify.breakpoint.mdAndDown;
    }
  },

  methods: {
    ...mapActions("settings", ["updateSearchDrawerState"])
  }
};
</script>

<style scoped></style>
