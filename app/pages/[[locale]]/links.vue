<script setup>
definePageMeta({
  name: "Links",
  path: "/:locale(en|ee|de)?/links",
  layout: "static",
});
useHead({ title: "Links" });
</script>

<template>
  <div v-html="$t('links.html')" />
</template>

<script>
export default {
  name: "Links",
};
</script>

<style scoped>
.Links :deep(.row) {
  margin: 8px 0;
}

.Links :deep(.col-6:first-child) {
  padding-right: 8px;
}

.Links :deep(.col-6:last-child) {
  padding-left: 8px;
}
</style>
