<template>
  <v-container class="Join">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('join.html')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Join",

  metaInfo: {
    title: "Join the Network"
  }
};
</script>

<style scoped></style>
