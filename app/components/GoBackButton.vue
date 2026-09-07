<template>
  <div class="GoBackButton">
    <v-tooltip location="right">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          fixed
          left
          color="primary"
          theme="dark"
          @click="$router.go(-1)"
          :style="style"
        >
          <v-icon size="large">fa:fas fa-arrow-left</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("detail.goBack") }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "GoBackButton",
  computed: {
    style() {
      return "position: fixed; top: 80px; left: 16px; z-index: 2100;";
    },
  },
};
</script>

<style scoped></style>
