<script setup lang="ts">
import { useI18n } from "vue-i18n";
import PartnersMap from "@/components/PartnersMap.vue";
import { institutions } from "@/institutions";
const { t } = useI18n();
const { localePath } = useAppNavigation();
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

const countryCount = new Set(institutions.map((institution) => institution.countryKey)).size;
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
      </div>
      <div class="tw:p-4 tw:pt-0 tw:sm:p-6 tw:sm:pt-0 tw:lg:p-6">
        <ClientOnly>
          <PartnersMap :institutions="institutions" class="tw:h-full tw:min-h-80 tw:overflow-hidden tw:rounded-2xl tw:lg:min-h-112" />
        </ClientOnly>
      </div>
    </header>

    <section class="tw:py-12 tw:sm:py-16" aria-labelledby="partner-institutions">
      <p class="tw:text-home-muted tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase">{{ t("partnersPage.networkEyebrow") }}</p>
      <h2 id="partner-institutions" class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl">{{ t("partnersPage.institutionsTitle") }}</h2>
      <div class="tw:mt-7 tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        <div
          v-for="(institution, index) in institutions"
          :key="institution.id"
          class="tw:flex tw:min-h-48 tw:min-w-0 tw:flex-col tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-6 tw:shadow-sm tw:transition-colors tw:duration-200 tw:hover:bg-[#eaf0e9] tw:focus-within:bg-[#eaf0e9]"
        >
          <div class="tw:flex tw:items-baseline tw:justify-between tw:gap-2">
            <span class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-link tw:uppercase">{{ t(`partnersPage.countries.${institution.countryKey}`) }}</span>
            <span class="tw:text-xl tw:font-bold tw:text-slate-300">{{ String(index + 1).padStart(2, "0") }}</span>
          </div>
          <h3 class="tw:mt-4 tw:text-lg tw:leading-snug tw:font-bold">
            <NuxtLink :to="localePath(`/institution/${institution.id}`)" class="tw:hover:text-home-link">
              {{ institution.name }}
            </NuxtLink>
          </h3>
          <NuxtLink :to="localePath(`/institution/${institution.id}`)" class="tw:mt-3 tw:text-sm tw:font-semibold tw:text-home-link">
            {{ t("partnersPage.viewDetails") }}
          </NuxtLink>
          <UButton
            :to="institution.url"
            target="_blank"
            rel="noopener noreferrer"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-up-right"
            class="tw:mt-auto tw:self-start tw:px-0 tw:pt-5 tw:font-bold tw:text-home-link"
          >
            {{ t("partnersPage.visitWebsite") }}
          </UButton>
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
