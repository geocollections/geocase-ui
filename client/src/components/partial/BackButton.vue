<template>
  <v-fab-transition>
    <v-btn
      fab
      fixed
      left
      @click="$router.go(-1)"
      style="z-index: 1500"
      title="Go back"
    >
      <v-icon large>mdi-arrow-left</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: "BackButton"
};
</script>

<style scoped />
