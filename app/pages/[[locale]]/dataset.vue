<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";
import SearchService from "@/services/SearchService";
import type { Dataset } from "@/utils/datasets";

definePageMeta({ name: "Datasets", path: "/:locale(en|ee|de)?/dataset" });
const { t } = useI18n();
const { localePath } = useAppNavigation();
const loading = ref(true);
const failed = ref(false);
const datasets = ref<Dataset[]>([]);
useHead(() => ({ title: t("datasetsPage.title") }));
async function loadDatasets() {
  loading.value = true;
  failed.value = false;
  try {
    datasets.value = await SearchService.getDatasets();
  } catch (error) {
    console.error("Failed to load dataset facets", error);
    failed.value = true;
  } finally {
    loading.value = false;
  }
}
onMounted(loadDatasets);
function recordsLink(url: string) {
  return { path: localePath("/search"), query: { datasourceurl__equals: url } };
}
</script>

<template>
  <article class="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <header class="tw:rounded-3xl tw:bg-home-banner tw:p-6 tw:sm:p-10 tw:lg:p-12">
      <h1 class="tw:text-4xl tw:font-bold tw:tracking-tight tw:sm:text-5xl">{{ t("datasetsPage.title") }}</h1>
      <p class="tw:text-home-muted tw:mt-5 tw:max-w-3xl tw:text-lg tw:leading-relaxed">{{ t("datasetsPage.description") }}</p>
    </header>
    <section class="tw:border-home-border tw:mt-6 tw:rounded-3xl tw:border tw:bg-home-surface tw:p-6 tw:sm:p-8" aria-labelledby="datasets-explanation">
      <h2 id="datasets-explanation" class="tw:text-xl tw:font-semibold">{{ t("datasetsPage.explanationTitle") }}</h2>
      <div class="tw:mt-3 tw:grid tw:gap-4 tw:md:grid-cols-2">
        <p class="tw:text-home-muted tw:leading-relaxed">{{ t("datasetsPage.explanation") }}</p>
        <p class="tw:text-home-muted tw:leading-relaxed">{{ t("datasetsPage.institutionExplanation") }}</p>
      </div>
      <p class="tw:text-home-muted tw:mt-4 tw:text-sm tw:leading-relaxed">{{ t("datasetsPage.usageExplanation") }}</p>
    </section>
    <p v-if="loading" role="status" class="tw:mt-8">{{ t("datasetsPage.loading") }}</p>
    <div v-else-if="failed" role="alert" class="tw:mt-8">
      <p>{{ t("datasetsPage.error") }}</p>
      <UButton class="tw:mt-3" @click="loadDatasets">{{ t("datasetsPage.retry") }}</UButton>
    </div>
    <p v-else-if="!datasets.length" class="tw:mt-8">{{ t("datasetsPage.empty") }}</p>
    <ul v-else class="tw:mt-8 tw:grid tw:list-none tw:gap-5 tw:p-0 tw:lg:grid-cols-2">
      <li v-for="dataset in datasets" :key="dataset.url" class="tw:border-home-border tw:flex tw:min-w-0 tw:flex-col tw:rounded-3xl tw:border tw:bg-home-surface tw:p-6 tw:transition-shadow tw:hover:shadow-md tw:sm:p-8">
        <div class="tw:flex tw:flex-col tw:items-start tw:gap-5">
          <div class="tw:min-w-0">
            <p class="tw:text-home-muted tw:mb-3 tw:text-xs tw:font-semibold tw:uppercase tw:tracking-wider">{{ t("datasetsPage.institutions") }}</p>
            <ul v-if="dataset.owners.length" class="tw:grid tw:list-none tw:gap-2 tw:p-0">
              <li v-for="owner in dataset.owners" :key="owner.name">
                <NuxtLink v-if="owner.institutionId" :to="localePath(`/institution/${owner.institutionId}`)" class="tw:text-home-link tw:text-lg tw:font-semibold tw:hover:underline">{{ owner.name }}</NuxtLink>
                <span v-else class="tw:text-lg tw:font-semibold">{{ owner.name }}</span>
              </li>
            </ul>
            <p v-else>{{ t("datasetsPage.unknownInstitution") }}</p>
          </div>
          <NuxtLink :to="recordsLink(dataset.url)" class="tw:text-home-link tw:inline-flex tw:items-center tw:rounded-full tw:bg-home-banner tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:transition-colors tw:hover:bg-home-hover tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4">
            {{ t("datasetsPage.viewRecords") }} ({{ dataset.count.toLocaleString() }})
          </NuxtLink>
        </div>
        <dl class="tw:border-home-border tw:mt-6 tw:grid tw:gap-5 tw:border-t tw:pt-6">
          <div>
            <dt class="tw:text-home-muted tw:text-sm">{{ t("datasetsPage.source") }}</dt>
            <dd class="tw:mt-1 tw:break-all tw:text-sm">{{ dataset.url }}</dd>
          </div>
          <div v-if="dataset.specimenTypes.length">
            <dt class="tw:text-home-muted tw:text-sm">{{ t("datasetsPage.specimenTypes") }}</dt>
            <dd class="tw:mt-2 tw:flex tw:flex-wrap tw:gap-2">
              <UBadge v-for="type in dataset.specimenTypes" :key="type" color="neutral" variant="soft">{{ type }}</UBadge>
            </dd>
          </div>
        </dl>
      </li>
    </ul>
  </article>
</template>
