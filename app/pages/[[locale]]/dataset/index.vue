<script setup lang="ts">
import { useAsyncData, useRouter } from "#imports";
import { $fetch } from "ofetch";
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";
import { parseDatasetCatalog } from "@/utils/datasetCatalog";

definePageMeta({ name: "Datasets", path: "/:locale(en|ee|de)?/dataset" });
const { t } = useI18n();
const { localePath } = useAppNavigation();
const { data: catalog, status: catalogStatus, error: catalogError, refresh: refreshCatalog } = useAsyncData("dataset-catalog", async () => parseDatasetCatalog({ data: await $fetch<unknown>("/catalog/datasets", { responseType: "json" }) }));
const route = useRoute();
const router = useRouter();
const datasetSearch = computed({
  get: () => typeof route.query.q === "string" ? route.query.q : "",
  set: (value: string) => {
    void router.replace({ path: route.path, query: { ...route.query, q: value || undefined }, hash: route.hash });
  },
});
const filteredCatalog = computed(() => {
  const terms = datasetSearch.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return (catalog.value ?? []).filter((item) => {
    const text = [item.title, item.organisation_name, item.description, item.keywords].filter(Boolean).join(" ").toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
});
useHead(() => ({ title: t("datasetsPage.title") }));
</script>

<template>
  <article class="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <header class="tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-home-banner tw:p-6 tw:sm:p-10 tw:lg:p-12">
      <img src="https://files.geocollections.info/img/geocase/front_page/geocase_landing2.jpg" alt="" aria-hidden="true" class="tw:absolute tw:inset-0 tw:size-full tw:object-cover" />
      <div class="tw:absolute tw:inset-0 tw:bg-linear-to-r tw:from-home-banner/95 tw:via-home-banner/90 tw:to-home-banner/60" aria-hidden="true" />
      <div class="tw:relative tw:grid tw:items-center tw:gap-8 tw:lg:grid-cols-[minmax(0,1fr)_minmax(18rem,23rem)] tw:lg:gap-10">
        <div>
          <h1 class="tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.06] tw:font-bold tw:tracking-[-0.045em]">{{ t("datasetsPage.title") }}</h1>
          <p class="tw:mt-5 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8">{{ t("datasetsPage.description") }}</p>
          <NuxtLink :to="localePath('/search')" class="tw:mt-7 tw:inline-flex tw:min-h-11 tw:items-center tw:gap-3 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:transition-colors tw:hover:bg-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4">
            {{ t("aboutPage.explore") }}<UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
          </NuxtLink>
        </div>
      <div class="tw:w-full tw:min-w-0 tw:rounded-2xl tw:bg-white/85 tw:p-5 tw:sm:p-6">
        <label for="dataset-search" class="tw:mb-2 tw:block tw:text-sm tw:font-semibold">{{ t("datasetFilter.label") }}</label>
        <div class="tw:flex tw:gap-2">
          <UInput id="dataset-search" v-model="datasetSearch" type="search" icon="i-lucide-search" :placeholder="t('datasetFilter.placeholder')" class="tw:min-w-0 tw:flex-1" size="lg" />
          <UButton v-if="datasetSearch" color="neutral" variant="outline" icon="i-lucide-x" :aria-label="t('datasetFilter.clear')" @click="datasetSearch = ''" />
        </div>
        <p v-if="catalogStatus === 'success'" role="status" aria-live="polite" class="tw:mt-3 tw:text-sm tw:text-home-muted">{{ t("datasetFilter.count", { shown: filteredCatalog.length, total: catalog?.length ?? 0 }) }}</p>
      </div>
      </div>
    </header>

    <section class="tw:py-10 tw:sm:py-12" aria-labelledby="datasets-title">
      <h2 id="datasets-title" class="tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl">{{ t("datasetsPage.browseTitle") }}</h2>
      <p class="tw:mt-3 tw:max-w-2xl tw:leading-7 tw:text-home-muted">{{ t("datasetsPage.browseDescription") }}</p>

      <div class="tw:mt-6 tw:grid tw:gap-3">
        <p v-if="catalogStatus === 'pending'" role="status">{{ t("datasetsPage.loading") }}</p>
        <div v-if="catalogError" role="alert" class="tw:rounded-2xl tw:bg-home-surface tw:p-5">
          <p>{{ t("datasetDetail.catalogError") }}</p>
          <UButton class="tw:mt-3" @click="refreshCatalog()">{{ t("datasetsPage.retry") }}</UButton>
        </div>
        <p v-if="catalogStatus === 'success' && !catalog?.length">{{ t("datasetsPage.empty") }}</p>
        <p v-if="catalogStatus === 'success' && catalog?.length && !filteredCatalog.length">{{ t("datasetFilter.noMatches") }}</p>
      </div>

      <ul class="tw:mt-6 tw:grid tw:list-none tw:gap-4 tw:p-0 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        <li v-for="(item, index) in filteredCatalog" :key="item.dataset_guid" class="dataset-card tw:relative tw:flex tw:min-h-48 tw:min-w-0 tw:flex-col tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-6 tw:shadow-sm tw:transition-colors tw:duration-200 tw:hover:bg-[#eaf0e9] tw:focus-within:bg-[#eaf0e9]">
          <div class="tw:flex tw:items-baseline tw:justify-between tw:gap-2">
            <span class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-link tw:uppercase">{{ t("datasetDetail.title") }}</span>
            <span class="tw:text-xl tw:font-bold tw:text-slate-300">{{ String(index + 1).padStart(2, "0") }}</span>
          </div>
          <h3 class="tw:mt-4 tw:break-words tw:text-lg tw:leading-snug tw:font-bold">
            <NuxtLink :to="localePath('/dataset/' + item.dataset_guid)" class="tw:hover:text-home-link tw:after:absolute tw:after:inset-0 tw:after:rounded-2xl tw:focus-visible:outline-none tw:focus-visible:after:ring-2 tw:focus-visible:after:ring-home-link">
              {{ item.title }}
            </NuxtLink>
          </h3>
          <p v-if="item.organisation_name" class="tw:mt-2 tw:break-words tw:text-sm tw:text-home-muted">{{ item.organisation_name }}</p>
          <p v-if="item.description" class="tw:mt-3 tw:line-clamp-3 tw:break-words tw:text-sm tw:leading-6 tw:text-home-muted">{{ item.description }}</p>

        </li>
      </ul>
    </section>

    <section class="tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-9" aria-labelledby="datasets-explanation">
      <div class="tw:flex tw:items-start tw:gap-4">
        <UIcon name="i-lucide-info" class="tw:mt-1 tw:size-6 tw:shrink-0 tw:text-home-link" aria-hidden="true" />
        <div class="tw:min-w-0">
          <h2 id="datasets-explanation" class="tw:text-xl tw:font-bold tw:tracking-tight">{{ t("datasetsPage.explanationTitle") }}</h2>
          <div class="tw:mt-4 tw:grid tw:gap-4 tw:leading-7 tw:text-home-muted">
            <p>{{ t("datasetsPage.explanation") }}</p>
            <p>{{ t("datasetsPage.institutionExplanation") }}</p>
            <p>{{ t("datasetsPage.usageExplanation") }}</p>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>
