<script setup>
definePageMeta({
  name: "Help",
  path: "/:locale(en|ee|de)?/help",
  layout: "static",
});
useHead({ title: "Help" });
</script>

<template>
  <div v-html="$t('help.html')" />
</template>

<script>
export default {
  name: "help",
};
</script>

<style scoped></style>
