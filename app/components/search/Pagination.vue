<script setup lang="ts">
interface PaginationItem {
  text: string;
  value: number;
}

const props = withDefaults(
  defineProps<{
    paginateBy: number;
    paginateByItems: PaginationItem[];
    page: number;
    numberOfResults: number;
    results: unknown[];
  }>(),
  {
    paginateBy: 25,
    page: 1,
    numberOfResults: 0,
    paginateByItems: () => [],
    results: () => [],
  },
);

const emit = defineEmits<{
  "update:paginateBy": [value: number];
  "update:page": [value: number];
}>();

function updatePaginateBy(value: unknown) {
  if (typeof value === "number") emit("update:paginateBy", value);
}
</script>

<template>
  <nav
    v-if="numberOfResults >= 0"
    aria-label="Pagination"
    class="tw:flex tw:flex-col tw:items-center tw:justify-between tw:gap-3 tw:p-2 tw:lg:flex-row"
  >
    <USelect
      :model-value="props.paginateBy"
      :items="props.paginateByItems"
      value-key="value"
      label-key="text"
      color="neutral"
      class="tw:w-44"
      :ui="{ content: 'tw:z-[2005]' }"
      @update:model-value="updatePaginateBy"
    />

    <UPagination
      :page="props.page"
      :total="props.numberOfResults"
      :items-per-page="props.paginateBy"
      :sibling-count="1"
      color="neutral"
      active-color="primary"
      variant="ghost"
      active-variant="solid"
      @update:page="emit('update:page', $event)"
    />
  </nav>
</template>
