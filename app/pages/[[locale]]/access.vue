<script setup>
definePageMeta({
  name: "Access",
  path: "/:locale(en|ee|de)?/access",
  layout: "static",
});
useHead({ title: "Access" });
</script>

<template>
  <div v-html="$t('access.html')" />
</template>

<script>
export default {
  name: "Access",
};
</script>

<style scoped></style>
