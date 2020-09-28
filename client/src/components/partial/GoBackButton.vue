<template>
  <v-fab-transition class="GoBackButton">
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          fab
          fixed
          right
          color="primary"
          dark
          @click="$router.go(-1)"
          :style="style"
        >
          <v-icon large>fas fa-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>Go back</span>
    </v-tooltip>
  </v-fab-transition>
</template>

<script>
export default {
  name: "GoBackButton",
  computed: {
    style() {
      return `top: ${this.$vuetify.application.top + 16}px`;
    }
  }
};
</script>

<style scoped></style>
