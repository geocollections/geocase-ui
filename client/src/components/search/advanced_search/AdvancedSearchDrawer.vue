<template>
  <v-navigation-drawer
    v-model="drawer"
    color="grey lighten-3"
    style="z-index: 2000;"
    :style="`margin-top: ${$vuetify.application.top}px`"
    fixed
    :right="isMdAndDown"
    width="350"
    :height="`calc(100vh - ${$vuetify.application.top}px)`"
  >
    {{ isMdAndDown }}
    {{ drawer }}
    <v-list>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test</v-list-item>
      <v-list-item>test3</v-list-item>
      <v-list-item>test2</v-list-item>
      <v-list-item>test1</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AdvancedSearchDrawer",

  computed: {
    ...mapState("settings", ["searchDrawer"]),

    isMdAndDown() {
      return this.$vuetify.breakpoint.mdAndDown;
    },

    drawer: {
      get() {
        return this.searchDrawer;
      },

      set(value) {
        this.updateSearchDrawerState(value);
      }
    }
  },

  methods: {
    ...mapActions("settings", ["updateSearchDrawerState"])
  }
};
</script>

<style scoped></style>
