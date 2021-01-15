<template>
  <v-container class="Project">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('project.html')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Project"
};
</script>

<style scoped></style>
