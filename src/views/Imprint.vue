<template>
  <v-container class="Imprint">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('imprint.html')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Imprint",

  metaInfo: {
    title: "Imprint"
  }
};
</script>

<style scoped></style>
