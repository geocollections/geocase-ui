<template>
  <v-select
    v-bind="$attrs"
    v-on="$listeners"
    hide-details
    dense
    :style="style"
  >
    <template
      v-slot:prepend-inner
      v-if="useCustomPrependInner && useCustomPrependInner.length > 0"
    >
      <div class="custom-prepend-inner">{{ useCustomPrependInner }}</div>
    </template>
  </v-select>
</template>

<script>
export default {
  name: "SelectWrapper",
  props: {
    useCustomPrependInner: {
      type: String,
      default: ""
    },
    isPagination: Boolean
  },
  computed: {
    style() {
      let style = "z-index: 2020;";
      if (this.isPagination) style = "z-index: 2005";
      return style;
    }
  }
};
</script>

<style scoped>
.custom-prepend-inner {
  margin: 5px 4px 3px 0;
  font-weight: bold;
  color: black;
  white-space: nowrap;
}
</style>
