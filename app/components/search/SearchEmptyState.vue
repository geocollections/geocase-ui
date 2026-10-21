<script setup>
import { computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "#imports";
import { useSearchStore } from "@/stores/search";
import { useSettingsStore } from "@/stores/settings";

defineProps({ images: { type: Boolean, default: false } });
const { t } = useI18n();
const store = useSearchStore();
const settings = useSettingsStore();
const route = useRoute();
const router = useRouter();
const hasFilters = computed(() =>
  store.searchIds.some((id) => {
    const value = store.search[id]?.value;
    return value != null && String(value).trim() !== "";
  }),
);
async function resetSearch() {
  store.resetSearch();
  await router.push({ path: route.path, query: {}, hash: route.hash });
}
async function editSearch() {
  settings.updateSearchDrawerState(true);
  await nextTick();
  document.querySelector("#search-filters-panel input")?.focus();
}
</script>

<template>
  <UAlert
    v-if="!store.resultsError"
    color="neutral"
    variant="soft"
    icon="i-lucide-search-x"
    :title="t(images ? 'search.imageNoResults' : 'search.tableNoResults')"
    :description="
      t(
        hasFilters
          ? 'search.noResultsFilteredHint'
          : 'search.noResultsBroadHint',
      )
    "
  >
    <template #actions>
      <div class="tw:flex tw:flex-wrap tw:gap-2">
        <UButton
          color="primary"
          variant="soft"
          icon="i-lucide-sliders-horizontal"
          :label="t('search.editSearch')"
          @click="editSearch"
        />
        <UButton
          v-if="hasFilters"
          color="neutral"
          variant="outline"
          icon="i-lucide-rotate-ccw"
          :label="t('search.drawer.resetSearch')"
          @click="resetSearch"
        />
      </div>
    </template>
  </UAlert>
</template>
