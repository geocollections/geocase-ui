<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { $fetch } from "ofetch";
import { institutionOwnerMatchesLabel } from "@/utils/institutionCatalog";
import { parseSourceFilter } from "@/utils/sourceFilters";
import { parseDatasetCatalog } from "@/utils/datasetCatalog";
import { useAsyncData, useRoute, useRouter } from "#imports";
import { useSearchStore } from "@/stores/search";

const { t } = useI18n();
const store = useSearchStore();
const route = useRoute();
const router = useRouter();
const { localePath } = useAppNavigation();
const { data: sourceCatalog } = useAsyncData("active-filter-dataset-catalog", async () =>
  store.search.datasourceurl.value ? parseDatasetCatalog({ data: await $fetch("/catalog/datasets") }) : [],
  { lazy: true, watch: [() => store.search.datasourceurl.value] },
);

const activeFilters = computed(() =>
  store.searchIds.flatMap((id) => {
    const field = store.search[id];
    const value = field.value;
    if (value == null || (typeof value === "string" && !value.trim()))
      return [];
    const label =
      id === "q" ? t("search.activeFilters.keyword") : id === "datasourceurl" ? t("datasetsPage.title") : t(`search.table.${id}`);
    let displayValue;
    if (id === "datasourceurl" && field.lookUpType === "equals") {
      displayValue = parseSourceFilter(String(value)).map((url) => {
        const candidates = (sourceCatalog.value ?? []).filter((item) => item.provider_url === url);
        const owners = Array.from(String(store.search.datasetowner.value ?? "").matchAll(/"(?:\\.|[^"\\])*"/g), (match) => {
          try { return JSON.parse(match[0]); } catch { return ""; }
        });
        const scoped = candidates.filter((item) => item.organisation_name && owners.some((owner) => institutionOwnerMatchesLabel(owner, item.organisation_name)));
        const titles = (scoped.length ? scoped : candidates).map((item) => item.title);
        return titles.length ? titles.join(" / ") : url;
      }).join(", ");
    }
    else if (id === "map") displayValue = t("search.activeFilters.mapArea");
    else if (field.type === "single_checkbox")
      displayValue = t(
        value === "true"
          ? "search.activeFilters.yes"
          : "search.activeFilters.no",
      );
    else if (field.type === "checkbox") {
      const decoded = value.replaceAll("&quot;", '"');
      const values = Array.from(
        decoded.matchAll(/"([^"\n]*)"/g),
        (match) => match[1],
      );
      displayValue = values.length ? values.join(", ") : decoded;
    } else displayValue = value;
    const operator = field.lookUpType
      ? t(
          `search.activeFilters.operators.${field.lookUpType.replaceAll(" ", "_")}`,
        )
      : "";
    const sourceLinks = id === "datasourceurl" && field.lookUpType === "equals"
      ? parseSourceFilter(String(value)).flatMap((url) => {
          const matches = (sourceCatalog.value ?? []).filter((item) => item.provider_url === url);
          return matches.length
            ? matches.map((item) => ({ href: localePath("/dataset/" + item.dataset_guid), label: item.title, source: url }))
            : [{ href: null, label: url, source: url }];
        })
      : [];
    return [{ id, label, value: displayValue, operator, sourceLinks }];
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
    class="tw:border-default tw:mx-3 tw:mb-2 tw:border-t tw:pt-2 tw:sm:mx-6 tw:sm:mb-5 tw:sm:pt-4"
  >
    <div class="tw:mb-2.5 tw:hidden tw:items-center tw:sm:flex tw:gap-2 tw:text-muted">
      <UIcon name="i-lucide-list-filter" class="tw:size-4" aria-hidden="true" />
      <span class="tw:text-xs tw:font-semibold tw:tracking-wide">
        {{ t("search.activeFilters.title") }}
      </span>
      <UBadge color="neutral" variant="soft" size="sm">{{
        activeFilters.length
      }}</UBadge>
    </div>
    <ul class="tw:m-0 tw:flex tw:list-none tw:flex-wrap tw:gap-2 tw:p-0">
      <li
        v-for="filter in activeFilters"
        :key="filter.id"
        class="tw:flex tw:max-w-full tw:items-center tw:gap-1 tw:rounded-xl tw:border tw:border-[#ddc4eb] tw:bg-[#f8f2fb] tw:py-1 tw:pr-1 tw:pl-3 tw:text-sm tw:text-slate-800"
      >
        <span class="tw:min-w-0 tw:break-words tw:[overflow-wrap:anywhere]">
          <span class="tw:text-slate-600"
            >{{ filter.label
            }}<span v-if="filter.operator" class="tw:ml-1">{{
              filter.operator
            }}</span
            >:</span
          >
          <span class="tw:ml-1 tw:font-semibold">{{ filter.value }}</span>
          <span v-for="link in filter.sourceLinks" :key="link.href ?? link.source" class="tw:mt-1 tw:block tw:text-xs">
            <NuxtLink v-if="link.href" :to="link.href" :title="link.source" class="tw:text-home-link tw:underline tw:underline-offset-2 tw:hover:text-geocase-700">{{ t("datasetDetail.view") }} →</NuxtLink>

          </span>
        </span>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          class="tw:shrink-0 tw:rounded-lg tw:text-slate-500 tw:hover:bg-[#efe2f6] tw:hover:text-slate-900"
          :aria-label="
            t('search.activeFilters.remove', { field: filter.label })
          "
          @click="removeFilter(filter.id)"
        />
      </li>
    </ul>
  </section>
</template>
