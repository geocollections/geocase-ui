<script setup lang="ts">
import { useAsyncData, useRequestURL, useRouter } from "#imports";
import { $fetch } from "ofetch";
import { datasetWebUrl, parseDatasetCatalog } from "@/utils/datasetCatalog";

definePageMeta({ name: "Dataset detail", path: "/:locale(en|ee|de)?/dataset/:guid" });
const route = useRoute();
const router = useRouter();
const origin = useRequestURL().origin;
const { t } = useI18n();
const { localePath } = useAppNavigation();
const { data: dataset, status, error, refresh } = useAsyncData(
  () => `dataset-${route.params.guid}`,
  async () => {
    const response = await $fetch<unknown>(`/catalog/datasets/${encodeURIComponent(String(route.params.guid))}`, { responseType: "json" });
    const dataset = parseDatasetCatalog({ data: [response] })[0];
    if (!dataset) throw new Error("Invalid dataset response");
    return dataset;
  },
);
watch(dataset, (value) => {
  if (value && String(route.params.guid) !== value.dataset_guid) {
    void router.replace({
      path: localePath("/dataset/" + value.dataset_guid),
      query: route.query,
      hash: route.hash,
    });
  }
}, { immediate: true });
const fields = computed(() => [
  ["coverage", dataset.value?.coverage],
  ["spatial", dataset.value?.spatial_label],
  ["taxonomic", dataset.value?.taxonomic_terms],
  ["geoecological", dataset.value?.geoecological_terms],
].filter(([, value]) => typeof value === "string" && value.trim()));
const links = computed(() => [
  { label: "source", url: datasetWebUrl(dataset.value?.landing_page_url) },
  { label: "accessRights", url: datasetWebUrl(dataset.value?.access_rights_uri) },
].filter((link) => link.url));
useHead(() => ({
  title: dataset.value?.title ?? t("datasetDetail.title"),
  link: dataset.value ? [{
    rel: "canonical",
    href: new URL(localePath("/dataset/" + dataset.value.dataset_guid), origin).href,
  }] : [],
}));
</script>


<template>
  <article class="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <NuxtLink :to="localePath('/dataset')" class="tw:inline-flex tw:min-h-11 tw:items-center tw:gap-2 tw:rounded-lg tw:font-semibold tw:text-home-link tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4">
      <UIcon name="i-lucide-arrow-left" aria-hidden="true" />{{ t("datasetDetail.back") }}
    </NuxtLink>
    <p v-if="status === 'pending'" role="status" class="tw:mt-6 tw:rounded-3xl tw:bg-home-surface tw:p-8">{{ t("datasetsPage.loading") }}</p>
    <div v-else-if="error" role="alert" class="tw:mt-6 tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-10">
      <h1 class="tw:text-3xl tw:font-bold">{{ t(error.statusCode === 404 ? "datasetDetail.notFound" : "datasetsPage.error") }}</h1>
      <UButton v-if="error.statusCode !== 404" class="tw:mt-4" @click="refresh()">{{ t("datasetsPage.retry") }}</UButton>
    </div>
    <template v-else-if="dataset">
      <header class="tw:relative tw:mt-4 tw:overflow-hidden tw:rounded-3xl tw:bg-home-banner tw:p-6 tw:sm:p-10 tw:lg:p-12">
        <img src="https://files.geocollections.info/img/geocase/front_page/geocase_landing2.jpg" alt="" aria-hidden="true" class="tw:absolute tw:inset-0 tw:size-full tw:object-cover" />
        <div class="tw:absolute tw:inset-0 tw:bg-linear-to-r tw:from-home-banner/95 tw:via-home-banner/95 tw:to-home-banner/75" aria-hidden="true" />
        <div class="tw:relative">
          <p class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-link tw:uppercase">{{ t("datasetDetail.title") }}</p>
          <h1 class="tw:mt-4 tw:max-w-4xl tw:break-words tw:text-[clamp(2rem,4.5vw,3.5rem)] tw:leading-[1.1] tw:font-bold tw:tracking-[-0.035em]">{{ dataset.title }}</h1>
          <p v-if="dataset.organisation_name?.trim()" class="tw:mt-6 tw:flex tw:items-start tw:gap-2.5 tw:text-base tw:font-medium tw:text-home-muted tw:sm:text-lg">
            <UIcon name="i-lucide-landmark" class="tw:mt-1 tw:size-5 tw:shrink-0 tw:text-home-link" aria-hidden="true" />
            <span class="tw:break-words">{{ dataset.organisation_name }}</span>
          </p>
        </div>
      </header>

      <div class="tw:mt-8 tw:grid tw:items-start tw:gap-8 tw:lg:mt-10 tw:lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] tw:lg:gap-10">
        <div class="tw:min-w-0 tw:space-y-9">
          <section v-if="dataset.description?.trim()" aria-labelledby="dataset-description">
            <h2 id="dataset-description" class="tw:text-2xl tw:font-bold tw:tracking-tight">{{ t("datasetDetail.description") }}</h2>
            <p class="tw:mt-4 tw:whitespace-pre-line tw:break-words tw:text-base tw:leading-8 tw:text-home-muted">{{ dataset.description }}</p>
          </section>
          <section v-if="fields.length" aria-labelledby="dataset-coverage" class="tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-8">
            <h2 id="dataset-coverage" class="tw:flex tw:items-center tw:gap-3 tw:text-xl tw:font-bold tw:tracking-tight">
              <UIcon name="i-lucide-globe" class="tw:size-5 tw:shrink-0 tw:text-home-link" aria-hidden="true" />{{ t("datasetDetail.coverage") }}
            </h2>
            <dl class="tw:mt-6 tw:grid tw:gap-6 tw:sm:grid-cols-2">
              <div v-for="[key, value] in fields" :key="key!" class="tw:min-w-0">
                <dt class="tw:text-xs tw:font-bold tw:tracking-wide tw:text-home-muted tw:uppercase">{{ t(`datasetDetail.${key}`) }}</dt>
                <dd class="tw:mt-2 tw:whitespace-pre-line tw:break-words tw:leading-7">{{ value }}</dd>
              </div>
            </dl>
          </section>
          <section v-if="dataset.citation?.trim()" aria-labelledby="dataset-citation">
            <h2 id="dataset-citation" class="tw:flex tw:items-center tw:gap-3 tw:text-xl tw:font-bold tw:tracking-tight">
              <UIcon name="i-lucide-quote" class="tw:size-5 tw:shrink-0 tw:text-home-link" aria-hidden="true" />{{ t("datasetDetail.citation") }}
            </h2>
            <p class="tw:mt-4 tw:border-l-2 tw:border-home-accent tw:pl-5 tw:whitespace-pre-line tw:break-words tw:leading-8 tw:text-home-muted">{{ dataset.citation }}</p>
          </section>
        </div>

        <div class="tw:min-w-0 tw:space-y-5">
          <section v-if="links.length" aria-labelledby="dataset-access" class="tw:rounded-3xl tw:bg-home-hero tw:p-6 tw:text-white">
            <h2 id="dataset-access" class="tw:flex tw:items-center tw:gap-3 tw:text-xl tw:font-bold">
              <UIcon name="i-lucide-external-link" class="tw:size-5 tw:shrink-0 tw:text-home-accent" aria-hidden="true" />{{ t("datasetDetail.access") }}
            </h2>
            <ul class="tw:mt-5 tw:grid tw:list-none tw:gap-3 tw:p-0">
              <li v-for="link in links" :key="link.label">
                <a :href="link.url" class="tw:flex tw:min-h-12 tw:items-center tw:justify-between tw:gap-3 tw:rounded-xl tw:bg-white/10 tw:px-4 tw:py-3 tw:text-sm tw:font-semibold tw:transition-colors tw:hover:bg-white/20 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-white">
                  <span class="tw:break-words">{{ t(`datasetDetail.${link.label}`) }}</span><UIcon name="i-lucide-arrow-up-right" class="tw:size-4 tw:shrink-0" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </section>

          <section v-if="dataset.license_text?.trim() || dataset.license_uri?.trim() || dataset.rights_statement?.trim()" aria-labelledby="dataset-licence" class="tw:rounded-3xl tw:border tw:border-home-border tw:p-6">
            <h2 id="dataset-licence" class="tw:flex tw:items-center tw:gap-3 tw:text-lg tw:font-bold">
              <UIcon name="i-lucide-shield-check" class="tw:size-5 tw:shrink-0 tw:text-home-link" aria-hidden="true" />{{ t("datasetDetail.licence") }}
            </h2>
            <p v-if="dataset.license_text" class="tw:mt-4 tw:whitespace-pre-line tw:break-words tw:font-semibold">{{ dataset.license_text }}</p>
            <a v-if="datasetWebUrl(dataset.license_uri)" :href="datasetWebUrl(dataset.license_uri)" class="tw:mt-3 tw:inline-block tw:break-all tw:text-sm tw:leading-6 tw:text-home-link tw:underline tw:underline-offset-4">{{ dataset.license_uri }}</a>
            <p v-if="dataset.rights_statement" class="tw:mt-4 tw:whitespace-pre-line tw:break-words tw:text-sm tw:leading-7 tw:text-home-muted">{{ dataset.rights_statement }}</p>
          </section>

          <div class="tw:rounded-2xl tw:bg-home-surface tw:p-5">
            <p class="tw:text-xs tw:font-bold tw:tracking-wider tw:text-home-muted">GUID</p>
            <p class="tw:mt-2 tw:break-all tw:font-mono tw:text-xs tw:leading-6 tw:text-home-muted">{{ dataset.dataset_guid }}</p>
          </div>
        </div>
      </div>
    </template>
  </article>
</template>
