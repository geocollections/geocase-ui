<template>
  <div
    class="
      pa-2
      d-flex
      flex-column flex-lg-row flex-nowrap
      justify-space-between
      align-center
      pagination
    "
    v-if="numberOfResults >= 0"
  >
    <div>
      <SelectWrapper
        :value="paginateBy"
        :items="paginateByItems"
        @change="$emit('update:paginateBy', $event)"
        is-pagination
      />
    </div>

    <div>
      <v-pagination
        :value="page"
        :class="{
          'justify-end font-small': $vuetify.breakpoint.smAndUp,
          'font-smaller': $vuetify.breakpoint.xsOnly,
        }"
        style="font-size: 0.75rem"
        circle
        prev-icon="fas fa-angle-left"
        next-icon="fas fa-angle-right"
        :length="Math.ceil(numberOfResults / paginateBy)"
        :total-visible="
          $vuetify.breakpoint.smAndDown
            ? $vuetify.breakpoint.xsOnly
              ? 4
              : 5
            : 7
        "
        @input="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>

<script>
import SelectWrapper from "@/components/input_wrappers/SelectWrapper";

export default {
  name: "Pagination",
  components: { SelectWrapper },
  props: {
    paginateBy: {
      type: Number,
      required: true,
      default: 25,
    },
    paginateByItems: {
      type: Array,
      required: true,
    },
    page: {
      type: Number,
      required: true,
      default: 1,
    },
    numberOfResults: {
      type: Number,
      required: true,
      default: 0,
    },
    results: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.font-small >>> .v-pagination__item {
  font-size: 0.875rem;
}

.font-smaller >>> .v-pagination__item {
  font-size: 0.75rem;
}
</style>
