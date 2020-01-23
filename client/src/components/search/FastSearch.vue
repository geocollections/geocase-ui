<template>
  <v-row no-gutters justify="center" class="py-6">
    <v-col cols="10" sm="5" md="4" lg="3" class="px-2">
      <SearchField
        v-model="fastSearch"
        label="Fast search"
        background-color="amber lighten-5"
        fast
      />
    </v-col>
  </v-row>
</template>

<script>
import SearchField from "../input_wrappers/TextFieldWrapper";
export default {
  name: "FastSearch",

  components: { SearchField },

  data: () => ({
    fastSearch: ""
  }),

  watch: {
    fastSearch(newVal) {
      this.$emit("fastSearch:changed", newVal);
    }
  }
};
</script>

<style scoped></style>
