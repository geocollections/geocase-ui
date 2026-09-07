<template>
  <div
    class="pa-2 d-flex flex-column flex-lg-row flex-nowrap justify-space-between align-center pagination"
    v-if="numberOfResults >= 0"
  >
    <div>
      <SelectWrapper
        :model-value="paginateBy"
        :items="paginateByItems"
        @update:model-value="$emit('update:paginateBy', $event)"
        is-pagination
      />
    </div>

    <div>
      <v-pagination
        :model-value="page"
        :class="{
          'justify-end font-small': $vuetify.display.smAndUp,
          'font-smaller': $vuetify.display.xs,
        }"
        style="font-size: 0.75rem"
        circle
        prev-icon="fa:fas fa-angle-left"
        next-icon="fa:fas fa-angle-right"
        :length="Math.ceil(numberOfResults / paginateBy)"
        :total-visible="
          $vuetify.display.smAndDown ? ($vuetify.display.xs ? 4 : 5) : 7
        "
        @update:model-value="$emit('update:page', $event)"
      />
    </div>
  </div>
</template>

<script>
import SelectWrapper from "@/components/input_wrappers/SelectWrapper.vue";

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
.font-small :deep(.v-pagination__item) {
  font-size: 0.875rem;
}

.font-smaller :deep(.v-pagination__item) {
  font-size: 0.75rem;
}
</style>
