<template>
  <v-fab-transition class="GoBackButton">
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          fab
          fixed
          left
          color="primary"
          dark
          @click="$router.go(-1)"
          :style="style"
        >
          <v-icon large>fas fa-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("detail.goBack") }}</span>
    </v-tooltip>
  </v-fab-transition>
</template>

<script>
export default {
  name: "GoBackButton",
  computed: {
    style() {
      return `top: ${this.$vuetify.application.top + 16}px; z-index: 51600;`;
    }
  }
};
</script>

<style scoped></style>
