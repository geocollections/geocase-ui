<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSearchStore } from "@/stores/search";
import { useSettingsStore } from "@/stores/settings";
const { t } = useI18n();
const search = useSearchStore();
const settings = useSettingsStore();
const filterCount = computed(
  () =>
    search.searchIds.filter((id) => {
      const value = search.search[id]?.value;
      return value != null && String(value).trim() !== "";
    }).length,
);
</script>

<template>
  <div
    class="tw:sticky tw:top-16 tw:z-20 tw:-mx-3 tw:mb-3 tw:flex tw:items-center tw:gap-3 tw:border-b tw:border-default tw:bg-default/95 tw:px-3 tw:py-2 tw:backdrop-blur tw:sm:-mx-5 tw:sm:px-5"
  >
    <UButton
      id="search-filters-toggle"
      icon="i-lucide-sliders-horizontal"
      :trailing-icon="
        settings.searchDrawer ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
      "
      color="primary"
      variant="solid"
      size="lg"
      class="tw:min-h-11 tw:flex-1 tw:justify-center tw:sm:flex-none"
      :aria-label="t('search.openFilters')"
      :aria-expanded="settings.searchDrawer"
      aria-controls="search-filters-panel"
      :aria-describedby="filterCount ? 'search-filter-count' : undefined"
      @click="settings.updateSearchDrawerState(!settings.searchDrawer)"
    >
      <span>{{ t("search.openFilters") }}</span>
      <span
        v-if="filterCount"
        id="search-filter-count"
        class="tw:inline-flex tw:min-w-6 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/20 tw:px-1.5 tw:text-sm"
        :aria-label="t('search.activeFilterCount', { count: filterCount })"
        >{{ filterCount }}</span
      >
    </UButton>
    <span class="tw:hidden tw:text-sm tw:text-muted tw:sm:block">{{
      t("search.filtersHint")
    }}</span>
  </div>
</template>
