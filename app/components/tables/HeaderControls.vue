<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

interface TableHeader {
  text: string;
  value: string;
  show?: boolean;
}

const props = withDefaults(
  defineProps<{
    headers?: TableHeader[];
    visibleHeaders?: TableHeader[];
    sortBy?: string[];
    isTableHeaderFixed?: boolean;
  }>(),
  {
    headers: () => [],
    visibleHeaders: () => [],
    sortBy: () => [],
    isTableHeaderFixed: false,
  },
);

const emit = defineEmits<{
  change: [header: TableHeader];
  reset: [];
  toggle: [isFixed: boolean];
}>();
const { t } = useI18n();
const onlyVisible = ref(false);
const filter = ref("");

const displayedHeaders = computed(() => {
  const headers = onlyVisible.value ? props.visibleHeaders : props.headers;
  const query = filter.value.trim().toLocaleLowerCase();
  if (!query) return headers;
  return headers.filter((header) =>
    header.text.toLocaleLowerCase().includes(query),
  );
});
</script>

<template>
  <UPopover
    :content="{ align: 'start', side: 'bottom', sideOffset: 8 }"
    :ui="{ content: 'tw:z-[5000] tw:w-80 tw:p-0' }"
  >
    <UButton
      icon="i-lucide-table-properties"
      color="primary"
      variant="solid"
      size="lg"
      :aria-label="t('search.table.tooltipConfig')"
      :title="t('search.table.tooltipConfig')"
    />

    <template #content>
      <section class="tw:w-80 tw:text-slate-900">
        <div class="tw:flex tw:items-center tw:gap-1 tw:border-b tw:border-slate-200 tw:p-2">
          <h2 class="tw:mr-auto tw:font-semibold">
            {{ t("search.table.headers") }}
          </h2>
          <UButton
            icon="i-lucide-refresh-cw"
            color="error"
            variant="ghost"
            :aria-label="t('search.table.tooltipResetHeaders')"
            :title="t('search.table.tooltipResetHeaders')"
            @click="emit('reset')"
          />
          <UButton
            :icon="onlyVisible ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            color="info"
            variant="ghost"
            :aria-label="
              t(
                onlyVisible
                  ? 'search.table.tooltipShowAllHeaders'
                  : 'search.table.tooltipShowActiveHeaders',
              )
            "
            :title="
              t(
                onlyVisible
                  ? 'search.table.tooltipShowAllHeaders'
                  : 'search.table.tooltipShowActiveHeaders',
              )
            "
            @click="onlyVisible = !onlyVisible"
          />
          <UButton
            :icon="
              isTableHeaderFixed
                ? 'i-lucide-table-properties'
                : 'i-lucide-panel-top'
            "
            color="neutral"
            variant="ghost"
            :aria-label="
              t(
                isTableHeaderFixed
                  ? 'search.table.tooltipRemoveFixedHeaders'
                  : 'search.table.tooltipAddFixedHeaders',
              )
            "
            :title="
              t(
                isTableHeaderFixed
                  ? 'search.table.tooltipRemoveFixedHeaders'
                  : 'search.table.tooltipAddFixedHeaders',
              )
            "
            @click="emit('toggle', isTableHeaderFixed)"
          />
        </div>

        <div class="tw:p-2">
          <UInput
            v-model="filter"
            icon="i-lucide-search"
            :placeholder="t('search.table.filter')"
            :aria-label="t('search.table.filter')"
            class="tw:w-full"
          />
        </div>

        <div class="tw:max-h-[500px] tw:overflow-y-auto tw:border-t tw:border-slate-200">
          <div
            v-for="header in displayedHeaders"
            :key="header.value"
            class="tw:px-3 tw:py-2 tw:hover:bg-slate-100"
            :title="
              sortBy.includes(header.value)
                ? t('search.table.headerSelectDisabled')
                : undefined
            "
          >
            <UCheckbox
              :model-value="header.show === true"
              :disabled="sortBy.includes(header.value)"
              :label="header.text || 'Icon'"
              class="tw:min-h-5 tw:w-full tw:text-sm"
              @update:model-value="emit('change', header)"
            />
          </div>
        </div>
      </section>
    </template>
  </UPopover>
</template>
