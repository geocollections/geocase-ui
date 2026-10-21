<template>
  <v-select
    class="select-wrapper"
    v-bind="$attrs"
    hide-details
    density="compact"
    item-title="text"
    item-value="value"
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
      default: "",
    },
    isPagination: Boolean,
  },
  computed: {
    style() {
      let style = "z-index: 2020;";
      if (this.isPagination) style = "z-index: 2005";
      return style;
    },
  },
};
</script>
