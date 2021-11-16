<template>
  <div v-html="$t('tutorial.html')" />
</template>

<script>
export default {
  name: "Tutorial",
};
</script>

<style>
.tutorial__avatar-card-size {
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 12px;
}

@media only screen and (min-width: 960px) {
  .tutorial__avatar-card-size {
    width: 380px;
    float: right;
    margin-left: 24px;
  }
}
</style>
