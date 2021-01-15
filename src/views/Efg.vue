<template>
  <v-container class="Efg">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('efg.html')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Efg",

  metaInfo: {
    title: "About EFG"
  }
};
</script>

<style scoped></style>
