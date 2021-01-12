<template>
  <v-container class="About">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('about.html')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "About"
};
</script>

<style scoped></style>
