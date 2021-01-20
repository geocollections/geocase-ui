<template>
  <div v-html="$t('links.html')" />
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
