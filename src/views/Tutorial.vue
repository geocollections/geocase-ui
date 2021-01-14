<template>
  <v-container class="Tutorial">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('tutorial.whole_page')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Tutorial"
};
</script>

<style scoped></style>
