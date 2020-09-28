<template>
  <v-container class="About">
    <v-card :loading="loading" elevation="6" shaped class="pa-4">
      <div v-if="page" v-html="page.content_en" />
    </v-card>
  </v-container>
</template>

<script>
import StaticPageService from "@/middleware/StaticPageService";

export default {
  name: "About",
  data: () => ({
    page: null,
    pageId: 73,
    loading: false
  }),
  async created() {
    this.loading = true;
    let response = await StaticPageService.getPage(this.pageId);
    console.log(response?.results?.[0]);
    if (response && response?.results?.[0]) this.page = response.results[0];
    this.loading = false;
  }
};
</script>

<style scoped></style>
