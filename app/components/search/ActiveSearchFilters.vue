<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "#imports";
import { useSearchStore } from "@/stores/search";

const { t } = useI18n();
const store = useSearchStore();
const route = useRoute();
const router = useRouter();
const activeFilters = computed(() =>
  store.searchIds.flatMap((id) => {
    const field = store.search[id];
    const value = field.value;
    if (value == null || (typeof value === "string" && !value.trim())) return [];
    const label = id === "q"
      ? t("search.activeFilters.keyword")
      : t(`search.table.${id}`);
    let displayValue;
    if (id === "map") displayValue = t("search.activeFilters.mapArea");
    else if (field.type === "single_checkbox")
      displayValue = t(value === "true" ? "search.activeFilters.yes" : "search.activeFilters.no");
    else if (field.type === "checkbox") {
      const decoded = value.replaceAll("&quot;", '"');
      const values = Array.from(decoded.matchAll(/"([^"\n]*)"/g), (match) => match[1]);
      displayValue = values.length ? values.join(", ") : decoded;
    } else displayValue = value;
    const operator = field.lookUpType
      ? t(`search.activeFilters.operators.${field.lookUpType.replaceAll(" ", "_")}`)
      : "";
    return [{ id, label, value: displayValue, operator }];
  }),
);

async function removeFilter(id) {
  if (id === "map") {
    store.updateSearchField({ id, value: null });
    if (store.page === 1) {
      await store.fetchResults();
      return;
    }
  }
  const query = { ...route.query };
  for (const key of Object.keys(query)) {
    if (key.split("__")[0] === id) delete query[key];
  }
  query.page = "1";
  await router.push({ path: route.path, query, hash: route.hash });
}
</script>

<template>
  <section
    v-if="activeFilters.length"
    :aria-label="t('search.activeFilters.title')"
    class="tw:border-default tw:mx-4 tw:mb-5 tw:border-t tw:pt-4 tw:sm:mx-6"
  >
    <div class="tw:mb-2.5 tw:flex tw:items-center tw:gap-2 tw:text-muted">
      <UIcon name="i-lucide-list-filter" class="tw:size-4" aria-hidden="true" />
      <span class="tw:text-xs tw:font-semibold tw:tracking-wide">
        {{ t("search.activeFilters.title") }}
      </span>
      <UBadge color="neutral" variant="soft" size="sm">{{ activeFilters.length }}</UBadge>
    </div>
    <ul class="tw:m-0 tw:flex tw:list-none tw:flex-wrap tw:gap-2 tw:p-0">
      <li
        v-for="filter in activeFilters"
        :key="filter.id"
        class="tw:flex tw:max-w-full tw:items-center tw:gap-1 tw:rounded-xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:py-1 tw:pr-1 tw:pl-3 tw:text-sm tw:text-slate-800"
      >
        <span class="tw:min-w-0 tw:break-words tw:[overflow-wrap:anywhere]">
          <span class="tw:text-slate-600">{{ filter.label }}<span v-if="filter.operator" class="tw:ml-1">{{ filter.operator }}</span>:</span>
          <span class="tw:ml-1 tw:font-semibold">{{ filter.value }}</span>
        </span>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          class="tw:shrink-0 tw:rounded-lg tw:text-slate-500 tw:hover:bg-amber-100 tw:hover:text-slate-900"
          :aria-label="t('search.activeFilters.remove', { field: filter.label })"
          @click="removeFilter(filter.id)"
        />
      </li>
    </ul>
  </section>
</template>
