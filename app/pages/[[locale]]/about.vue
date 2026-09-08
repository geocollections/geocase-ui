<script setup>
definePageMeta({
  name: "About",
  path: "/:locale(en|ee|de)?/about",
  layout: "static",
});
useHead({ title: "About" });
</script>

<template>
  <div class="About" v-html="$t('about.html')" />
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped></style>
