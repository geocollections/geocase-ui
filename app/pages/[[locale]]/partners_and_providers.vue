<script setup>
definePageMeta({
  name: "Partners and providers",
  path: "/:locale(en|ee|de)?/partners_and_providers",
  layout: "static",
});
useHead({ title: "Partners and providers" });
</script>

<template>
  <div v-html="$t('partners_and_providers.html')" />
</template>

<script>
export default {
  name: "PartnersAndProviders",
};
</script>

<style scoped></style>
