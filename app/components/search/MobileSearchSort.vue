<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "#imports";
import { useI18n } from "vue-i18n";
import { useSearchStore } from "@/stores/search";

const store = useSearchStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const items = computed(() => [
  { label: t("mobileSearch.defaultOrder"), value: "default" },
  ...store.translatedTableHeaders.filter((header) => header.sortable !== false && !["icon", "url"].includes(header.value)).map((header) => ({ label: header.text, value: header.value })),
]);
const field = computed(() => store.sortBy[0] ?? "default");
const descending = computed(() => Boolean(store.sortDesc[0]));
function updateSort(value: string, desc: boolean) {
  void router.push({
    path: route.path,
    query: { ...route.query, page: "1", sort_by: value === "default" ? undefined : value, sort_desc: value === "default" ? undefined : String(desc) },
    hash: route.hash,
  });
}
</script>

<template>
  <div class="tw:flex tw:min-w-0 tw:flex-1 tw:items-center tw:gap-2 tw:lg:hidden">
    <label for="mobile-sort-field" class="tw:sr-only">{{ t("mobileSearch.sortBy") }}</label>
    <USelect id="mobile-sort-field" :model-value="field" :items="items" class="tw:min-w-0 tw:flex-1" :ui="{ content: 'tw:z-[5000]' }" @update:model-value="updateSort($event, descending)" />
    <UButton
      :icon="descending ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide'"
      :aria-label="t(descending ? 'mobileSearch.descending' : 'mobileSearch.ascending')"
      :title="t(descending ? 'mobileSearch.descending' : 'mobileSearch.ascending')"
      :aria-pressed="descending"
      :disabled="field === 'default'"
      color="neutral"
      variant="outline"
      @click="updateSort(field, !descending)"
    />
  </div>
</template>
