<script setup lang="ts">
import { useAsyncData, useRouter } from "#imports";
import { $fetch } from "ofetch";
import { useI18n } from "vue-i18n";
import PartnersMap from "@/components/PartnersMap.vue";
import type { CatalogInstitution } from "@/utils/institutionCatalog";
const { data: institutions, status, error, refresh } = await useAsyncData("institution-catalog", () => $fetch<CatalogInstitution[]>("/catalog/institutions"), { default: () => [] });
const mappedInstitutions = computed(() => filteredInstitutions.value.flatMap((item) => item.coordinates ? [{ id: item.id, name: item.name, url: item.url, coordinates: item.coordinates as [number, number] }] : []));
const { t } = useI18n();
const { localePath } = useAppNavigation();
const route = useRoute();
const router = useRouter();
const institutionSearch = computed({
  get: () => typeof route.query.q === "string" ? route.query.q : "",
  set: (value: string) => {
    void router.replace({ path: route.path, query: { ...route.query, q: value || undefined }, hash: route.hash });
  },
});
const filteredInstitutions = computed(() => {
  const terms = institutionSearch.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return institutions.value.filter((item) => {
    const country = item.countryKey ? t(`partnersPage.countries.${item.countryKey}`) : "";
    const text = [item.name, item.country, country, item.description].join(" ").toLocaleLowerCase();
    return terms.every((term) => text.includes(term));
  });
});
definePageMeta({
  name: "Institutions",
  path: "/:locale(en|ee|de)?/institution",
  alias: "/:locale(en|ee|de)?/partners_and_providers",
  layout: "default",
});
useHead(() => ({ title: t("partnersPage.pageTitle") }));

const organizations = [
  { name: "CETAF", logoFile: "cetaf.png", url: "https://cetaf.org" },
  { name: "DiSSCo Research Infrastructure", logoFile: "dissco-logo.png", url: "https://dissco.eu" },
  { name: "Biodiversity Information Standards", logoFile: "tdwg.png", url: "https://tdwg.org" },
  { name: "Global Biodiversity Information Facility", logoFile: "gbif.png", url: "https://gbif.org" },
  { name: "BioCASe", logoFile: "biocase.png", url: "https://biocase.org" },
  { name: "Botanic Garden and Botanical Museum Berlin", logoFile: "bgbm.png", url: "https://bgbm.org" },
] as const;

const countryCount = computed(() => new Set(institutions.value.map((institution) => institution.country)).size);
</script>

<template>
  <article class="tw:mx-auto tw:w-full tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <header class="tw:grid tw:overflow-hidden tw:rounded-3xl tw:bg-[#eaf0e9] tw:lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="tw:p-6 tw:sm:p-10 tw:lg:p-12">
        <p class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/80 tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-[0.12em] tw:text-home-link tw:uppercase">
          <span class="tw:size-2 tw:rounded-full tw:bg-geocase" aria-hidden="true" />
          {{ t("partnersPage.eyebrow") }}
        </p>
        <h1 class="tw:text-[clamp(2.8rem,5vw,4.6rem)] tw:leading-[1.06] tw:font-bold tw:tracking-[-0.045em]">{{ t("header.partners") }}</h1>
        <p class="tw:text-home-muted tw:mt-5 tw:text-base tw:leading-7 tw:sm:text-lg tw:sm:leading-8">
          {{ t("partnersPage.heroDescription") }}
        </p>
        <UBadge color="neutral" variant="soft" size="lg" class="tw:mt-7">
          {{ t("partnersPage.summary", { partners: institutions.length, countries: countryCount }) }}
        </UBadge>
        <div class="tw:mt-7 tw:w-full tw:min-w-0 tw:rounded-2xl tw:bg-white/85 tw:p-5 tw:sm:p-6">
          <label for="institution-search" class="tw:mb-2 tw:block tw:text-sm tw:font-semibold">{{ t("institutionFilter.label") }}</label>
          <div class="tw:flex tw:gap-2">
            <UInput id="institution-search" v-model="institutionSearch" type="search" icon="i-lucide-search" :placeholder="t('institutionFilter.placeholder')" class="tw:min-w-0 tw:flex-1" size="lg" />
            <UButton v-if="institutionSearch" color="neutral" variant="outline" icon="i-lucide-x" :aria-label="t('institutionFilter.clear')" @click="institutionSearch = ''" />
          </div>
          <p v-if="status === 'success'" role="status" aria-live="polite" class="tw:mt-3 tw:text-sm tw:text-home-muted">{{ t("institutionFilter.count", { shown: filteredInstitutions.length, total: institutions.length }) }}</p>
        </div>
      </div>
      <div class="tw:p-4 tw:pt-0 tw:sm:p-6 tw:sm:pt-0 tw:lg:p-6">
        <ClientOnly>
          <PartnersMap v-if="mappedInstitutions.length" :key="mappedInstitutions.map((item) => item.id).join(',')" :institutions="mappedInstitutions" class="tw:h-full tw:min-h-80 tw:overflow-hidden tw:rounded-2xl tw:lg:min-h-112" />
        </ClientOnly>
      </div>
    </header>

    <section class="tw:py-12 tw:sm:py-16" aria-labelledby="partner-institutions">
      <p class="tw:text-home-muted tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase">{{ t("partnersPage.networkEyebrow") }}</p>
      <h2 id="partner-institutions" class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl">{{ t("partnersPage.institutionsTitle") }}</h2>
      <p v-if="status === 'pending'" role="status" class="tw:mt-5">{{ t("institutionsCatalog.loading") }}</p>
      <div v-if="error" role="alert" class="tw:mt-5">
        <p>{{ t("institutionsCatalog.error") }}</p>
        <UButton @click="refresh()">{{ t("partnersPage.retry") }}</UButton>
      </div>
      <p v-if="status === 'success' && !institutions.length" class="tw:mt-5">{{ t("institutionsCatalog.empty") }}</p>
      <p v-if="status === 'success' && institutions.length && !filteredInstitutions.length" class="tw:mt-5 tw:text-home-muted">{{ t("institutionFilter.noMatches") }}</p>
      <div class="tw:mt-7 tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        <div
          v-for="(institution, index) in filteredInstitutions"
          :key="institution.id"
          class="institution-card tw:relative tw:flex tw:min-h-48 tw:min-w-0 tw:flex-col tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-6 tw:shadow-sm tw:transition-colors tw:duration-200 tw:hover:bg-[#eaf0e9] tw:focus-within:bg-[#eaf0e9]"
        >
          <div class="tw:flex tw:items-baseline tw:justify-between tw:gap-2">
            <span class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-link tw:uppercase">{{ institution.countryKey ? t(`partnersPage.countries.${institution.countryKey}`) : institution.country }}</span>
            <span class="tw:text-xl tw:font-bold tw:text-slate-300">{{ String(index + 1).padStart(2, "0") }}</span>
          </div>
          <h3 class="tw:mt-4 tw:text-lg tw:leading-snug tw:font-bold">
            <NuxtLink :to="localePath(`/institution/${institution.id}`)" class="tw:hover:text-home-link tw:after:absolute tw:after:inset-0 tw:after:z-1 tw:after:rounded-2xl tw:focus-visible:outline-none tw:focus-visible:after:ring-2 tw:focus-visible:after:ring-home-link">
              {{ institution.name }}
            </NuxtLink>
          </h3>
          <p v-if="institution.description" class="tw:mt-3 tw:line-clamp-3 tw:text-sm tw:leading-6 tw:text-home-muted">{{ institution.description }}</p>
          <div class="tw:mt-auto tw:flex tw:items-end tw:justify-between tw:gap-4 tw:pt-5">
          <UButton
            v-if="institution.url" :to="institution.url"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-arrow-up-right"
            class="tw:relative tw:z-2 tw:min-h-11 tw:min-w-0 tw:shrink tw:whitespace-normal tw:border-home-link tw:font-bold tw:text-home-link tw:transition-colors tw:hover:bg-home-link tw:hover:text-white tw:active:bg-home-hero tw:active:text-white"
          >
            {{ t("partnersPage.visitWebsite") }}
          </UButton>
            <img
              v-if="institution.logoUrl"
              :src="institution.logoUrl"
              :alt="institution.name"
              loading="lazy"
              width="96"
              height="56"
              class="tw:ml-auto tw:h-14 tw:w-24 tw:shrink-0 tw:object-contain tw:object-right-bottom"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-10" aria-labelledby="related-organizations">
      <p class="tw:text-home-muted tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase">{{ t("partnersPage.collaborationEyebrow") }}</p>
      <h2 id="related-organizations" class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl">{{ t("partnersPage.relatedTitle") }}</h2>
      <p class="tw:text-home-muted tw:mt-4 tw:max-w-3xl tw:leading-7">
        {{ t("partnersPage.relatedDescription") }}
      </p>
      <div class="tw:mt-7 tw:grid tw:gap-3 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        <UButton
          v-for="organization in organizations"
          :key="organization.name"
          :to="organization.url"
          :aria-label="organization.name"
          target="_blank"
          rel="noopener noreferrer"
          color="neutral"
          variant="ghost"
          class="tw:flex tw:min-h-32 tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-5 tw:hover:bg-white"
        >
          <img
            :src="'https://files.geocollections.info/img/geocase/static/partners/' + organization.logoFile"
            :alt="organization.name"
            loading="lazy"
            class="tw:max-h-20 tw:max-w-full tw:object-contain"
          />
        </UButton>
      </div>
    </section>
  </article>
</template>
