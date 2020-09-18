<template>
  <v-navigation-drawer
    :value="drawerState"
    color="grey lighten-3"
    :permanent="!isSmAndDown"
    :temporary="isSmAndDown"
    :right="isSmAndDown"
    floating
    @input="$emit('change:state', $event)"
  >
    {{ isSmAndDown }}
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
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "AdvancedSearchDrawer",

  props: {
    drawerState: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
    searchDrawer: false
  }),

  computed: {
    isSmAndDown() {
      return this.$vuetify.breakpoint.smAndDown;
    }
  }
};
</script>

<style scoped></style>
