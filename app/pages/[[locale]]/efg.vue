<script setup>
definePageMeta({
  name: "Efg",
  path: "/:locale(en|ee|de)?/efg",
  layout: "static",
});
useHead({ title: "Efg" });
</script>

<template>
  <div v-html="$t('efg.html')" />
</template>

<script>
export default {
  name: "Efg",
};
</script>

<style scoped></style>
