<template>
  <v-card height="600" class="AdvancedSearch">
    <advanced-search-drawer />
  </v-card>
</template>

<script>
import AdvancedSearchDrawer from "@/components/search/advanced_search/AdvancedSearchDrawer";
export default {
  name: "AdvancedSearch",
  components: { AdvancedSearchDrawer }
};
</script>

<style scoped></style>
