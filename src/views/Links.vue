<template>
  <v-container class="Links">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('links.html')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Links"
};
</script>

<style scoped>
.Links >>> .row {
  margin: 8px 0;
}

.Links >>> .col-6:first-child {
  padding-right: 8px;
}

.Links >>> .col-6:last-child {
  padding-left: 8px;
}
</style>
