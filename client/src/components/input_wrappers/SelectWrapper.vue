<template>
  <v-select
    v-bind="$attrs"
    v-on="$listeners"
    solo
    hide-details
    dense
    prefix="todo"
    style="z-index: 1500;"
  />
</template>

<script>
export default {
  name: "SelectWrapper"
};
</script>

<style scoped></style>
