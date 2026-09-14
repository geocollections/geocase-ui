<script setup lang="ts">
import { computed, ref } from "vue";

interface TableOptions {
  page: number;
  itemsPerPage: number;
  [key: string]: unknown;
}

interface TablePagination {
  pageCount: number;
  itemsLength?: number;
  itemsPerPage?: number;
  page?: number;
  pageStart?: number;
  pageStop?: number;
}

const props = withDefaults(
  defineProps<{
    options?: TableOptions;
    pagination?: TablePagination;
    itemsPerPageOptions?: number[];
    itemsPerPageText?: string;
    pageSelectText?: string;
    goToText?: string;
    goToButtonText?: string;
    selectPageId?: string;
  }>(),
  {
    options: () => ({ page: 0, itemsPerPage: 0 }),
    pagination: () => ({ pageCount: 1 }),
    itemsPerPageOptions: () => [],
    itemsPerPageText: "Rows per page",
    pageSelectText: "Page 0 / 0",
    goToText: "Go to page",
    goToButtonText: "Go",
    selectPageId: "page-select-btn",
  },
);

const emit = defineEmits<{
  "update:options": [options: TableOptions];
}>();
const goToValue = ref<number>();
const isPagePickerOpen = ref(false);
const isFirstPage = computed(() => props.options.page <= 1);
const isLastPage = computed(
  () => props.options.page >= props.pagination.pageCount,
);

function updatePage(page: number) {
  emit("update:options", { ...props.options, page });
}

function pageLimitRule(value: unknown) {
  const page = Number(value);
  return (
    Number.isInteger(page) &&
    page >= 1 &&
    page <= props.pagination.pageCount
  );
}

function selectPage() {
  if (!pageLimitRule(goToValue.value)) return;
  updatePage(Number(goToValue.value));
  goToValue.value = undefined;
  isPagePickerOpen.value = false;
}

function changeRowsPerPage(value: unknown) {
  if (typeof value !== "number") return;
  emit("update:options", {
    ...props.options,
    itemsPerPage: value,
    page: 1,
  });
}
</script>

<template>
  <nav
    aria-label="Table pagination"
    class="tw:flex tw:min-h-full tw:flex-wrap tw:items-center tw:justify-around tw:gap-2 tw:sm:mr-3"
  >
    <div class="tw:flex tw:items-center tw:gap-3 tw:sm:ml-auto tw:sm:mr-7">
      <span class="tw:hidden tw:whitespace-nowrap tw:text-xs tw:sm:inline">
        {{ itemsPerPageText }}
      </span>
      <USelect
        :model-value="options.itemsPerPage"
        :items="itemsPerPageOptions"
        size="sm"
        class="tw:w-24 tw:text-xs"
        :ui="{ content: 'tw:z-[5000]' }"
        :aria-label="itemsPerPageText"
        @update:model-value="changeRowsPerPage"
      />
    </div>

    <div class="tw:my-1 tw:flex tw:items-center tw:justify-end">
      <UButton
        icon="i-lucide-chevrons-left"
        color="neutral"
        variant="ghost"
        :disabled="isFirstPage"
        aria-label="First page"
        @click="updatePage(1)"
      />
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="ghost"
        :disabled="isFirstPage"
        aria-label="Previous page"
        @click="updatePage(options.page - 1)"
      />

      <UPopover
        v-model:open="isPagePickerOpen"
        :content="{ side: 'bottom', sideOffset: 8 }"
        :ui="{ content: 'tw:z-[5000] tw:p-2' }"
      >
        <UButton
          :id="selectPageId"
          :label="pageSelectText"
          color="neutral"
          variant="ghost"
          size="sm"
          class="tw:whitespace-nowrap tw:text-xs"
        />

        <template #content>
          <form
            class="tw:flex tw:items-center tw:gap-2"
            @submit.prevent="selectPage"
          >
            <label :for="`${selectPageId}-input`" class="tw:whitespace-nowrap tw:text-xs">
              {{ goToText }}
            </label>
            <UInput
              :id="`${selectPageId}-input`"
              v-model.number="goToValue"
              type="number"
              :min="1"
              :max="pagination.pageCount"
              size="sm"
              class="tw:w-20 tw:text-xs"
              autofocus
            />
            <UButton
              type="submit"
              :label="goToButtonText"
              trailing-icon="i-lucide-chevron-right"
              color="neutral"
              variant="ghost"
              size="sm"
              :disabled="!pageLimitRule(goToValue)"
            />
          </form>
        </template>
      </UPopover>

      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="ghost"
        :disabled="isLastPage"
        aria-label="Next page"
        @click="updatePage(options.page + 1)"
      />
      <UButton
        icon="i-lucide-chevrons-right"
        color="neutral"
        variant="ghost"
        :disabled="isLastPage"
        aria-label="Last page"
        @click="updatePage(pagination.pageCount)"
      />
    </div>
  </nav>
</template>
