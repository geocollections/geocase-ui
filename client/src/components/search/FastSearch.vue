<template>
  <v-row no-gutters justify="center" class="py-6">
    <v-col cols="9" sm="4" md="3" lg="2" class="px-2">
      <SearchField
        v-model="fastSearch"
        label="Fast search"
        background-color="amber lighten-5"
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
      this.$emit("fastSearch:changed", { fastSearch: newVal });
    }
  }
};
</script>

<style scoped></style>
