<template>
  <v-container class="Tutorial">
    <v-card elevation="6" shaped class="px-8 py-6">
      <div v-html="$t('tutorial.html')" />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Tutorial",

  metaInfo: {
    title: "Tutorial"
  }
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
