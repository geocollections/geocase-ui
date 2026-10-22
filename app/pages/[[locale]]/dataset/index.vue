<script setup lang="ts">
import { useAsyncData } from "#imports";
import { $fetch } from "ofetch";
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";
import type { CatalogDataset } from "@/utils/datasetCatalog";

definePageMeta({ name: "Datasets", path: "/:locale(en|ee|de)?/dataset" });
const { t } = useI18n();
const { localePath } = useAppNavigation();
const { data: catalog, status: catalogStatus, error: catalogError, refresh: refreshCatalog } = useAsyncData("dataset-catalog", () => $fetch<CatalogDataset[]>("/api/datasets"));
useHead(() => ({ title: t("datasetsPage.title") }));
</script>

<template>
  <article class="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <header class="tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-home-banner tw:p-6 tw:sm:p-10 tw:lg:p-12">
      <img src="https://files.geocollections.info/img/geocase/front_page/geocase_landing2.jpg" alt="" aria-hidden="true" class="tw:absolute tw:inset-0 tw:size-full tw:object-cover" />
      <div class="tw:absolute tw:inset-0 tw:bg-linear-to-r tw:from-home-banner/95 tw:via-home-banner/90 tw:to-home-banner/60" aria-hidden="true" />
      <div class="tw:relative">
        <div>
          <h1 class="tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.06] tw:font-bold tw:tracking-[-0.045em]">{{ t("datasetsPage.title") }}</h1>
          <p class="tw:mt-5 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8">{{ t("datasetsPage.description") }}</p>
          <NuxtLink :to="localePath('/search')" class="tw:mt-7 tw:inline-flex tw:min-h-11 tw:items-center tw:gap-3 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:transition-colors tw:hover:bg-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4">
            {{ t("aboutPage.explore") }}<UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
          </NuxtLink>
        </div>

      </div>
    </header>

    <section class="tw:py-10 tw:sm:py-12" aria-labelledby="datasets-title">
      <p class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-muted tw:uppercase">GeoCASe</p>
      <h2 id="datasets-title" class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl">{{ t("datasetsPage.browseTitle") }}</h2>
      <p class="tw:mt-3 tw:max-w-2xl tw:leading-7 tw:text-home-muted">{{ t("datasetsPage.browseDescription") }}</p>

      <div class="tw:mt-6 tw:grid tw:gap-3">
        <p v-if="catalogStatus === 'pending'" role="status">{{ t("datasetsPage.loading") }}</p>
        <div v-if="catalogError" role="alert" class="tw:rounded-2xl tw:bg-home-surface tw:p-5">
          <p>{{ t("datasetDetail.catalogError") }}</p>
          <UButton class="tw:mt-3" @click="refreshCatalog()">{{ t("datasetsPage.retry") }}</UButton>
        </div>
        <p v-if="catalogStatus === 'success' && !catalog?.length">{{ t("datasetsPage.empty") }}</p>
      </div>

      <ul class="tw:mt-6 tw:grid tw:list-none tw:gap-4 tw:p-0 tw:md:grid-cols-2">
        <li v-for="item in catalog" :key="item.dataset_guid" class="tw:flex tw:min-w-0 tw:flex-col tw:rounded-2xl tw:bg-home-surface tw:p-5 tw:sm:p-6">
          <div class="tw:mb-5 tw:flex tw:items-center tw:gap-3">
            <span class="tw:grid tw:size-10 tw:shrink-0 tw:place-items-center tw:rounded-xl tw:bg-white tw:text-home-link" aria-hidden="true"><UIcon name="i-lucide-database" class="tw:size-5" /></span>
            <span class="tw:text-sm tw:font-bold tw:text-home-link">{{ t("datasetDetail.title") }}</span>
          </div>
          <h3 class="tw:break-words tw:text-xl tw:leading-snug tw:font-bold tw:tracking-tight">
            <NuxtLink :to="localePath('/dataset/' + item.dataset_guid)" class="tw:hover:text-home-link tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4">
              {{ item.title }}
            </NuxtLink>
          </h3>
          <p v-if="item.organisation_name" class="tw:mt-2 tw:break-words tw:text-sm tw:text-home-muted">{{ item.organisation_name }}</p>
          <p v-if="item.description" class="tw:mt-3 tw:line-clamp-3 tw:break-words tw:leading-7 tw:text-home-muted">{{ item.description }}</p>
          <div class="tw:mt-auto tw:flex tw:flex-wrap tw:gap-x-5 tw:gap-y-2 tw:pt-5">
            <NuxtLink :to="localePath('/dataset/' + item.dataset_guid)" class="tw:inline-flex tw:min-h-11 tw:items-center tw:gap-2 tw:font-bold tw:text-home-link tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4">
              {{ t("datasetDetail.view") }}<UIcon name="i-lucide-arrow-right" aria-hidden="true" />
            </NuxtLink>

          </div>
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
