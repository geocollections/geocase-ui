<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
definePageMeta({
  name: "Partners and providers",
  path: "/:locale(en|ee|de)?/partners_and_providers",
  layout: "default",
});
useHead(() => ({ title: t("partnersPage.pageTitle") }));

const partners = [
  ["CETAF General Secretariat", "belgium", "https://cetaf.org"],
  ["Meise Botanic Garden", "belgium", "https://www.plantentuinmeise.be/en/"],
  ["Museum für Naturkunde Berlin", "germany", "https://www.museumfuernaturkunde.berlin/en/"],
  ["National Museums Scotland", "unitedKingdom", "https://www.nms.ac.uk/"],
  ["National Museum, Prague", "czechRepublic", "https://www.nm.cz/en"],
  ["Natural History Museum Vienna", "austria", "https://www.nhm-wien.ac.at/en"],
  ["Royal Museum of Central Africa", "belgium", "https://www.africamuseum.be/en"],
  ["State Museum of Natural History Stuttgart", "germany", "https://naturkundemuseum-bw.de/en/"],
  ["Tallinn University of Technology", "estonia", "https://taltech.ee/en/"],
  ["Finnish Museum of Natural History", "finland", "https://www.luomus.fi/en"],
  ["Naturalis Biodiversity Center", "netherlands", "https://www.naturalis.nl/en"],
] as const;

const organizations = [
  ["CETAF", "cetaf.png", "https://cetaf.org"],
  ["DiSSCo Research Infrastructure", "dissco-logo.png", "https://dissco.eu"],
  ["Biodiversity Information Standards", "tdwg.png", "https://tdwg.org"],
  ["Global Biodiversity Information Facility", "gbif.png", "https://gbif.org"],
  ["BioCASe", "biocase.png", "https://biocase.org"],
  ["Botanic Garden and Botanical Museum Berlin", "bgbm.png", "https://bgbm.org"],
];

const countryCount = new Set(partners.map((partner) => partner[1])).size;
</script>

<template>
  <article class="tw:mx-auto tw:w-full tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <header class="tw:rounded-3xl tw:bg-[#eaf0e9] tw:p-6 tw:sm:p-10 tw:lg:p-12">
      <div class="tw:max-w-3xl">
        <p class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/80 tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-[0.12em] tw:text-home-link tw:uppercase">
          <span class="tw:size-2 tw:rounded-full tw:bg-geocase" aria-hidden="true" />
          {{ t("partnersPage.eyebrow") }}
        </p>
        <h1 class="tw:text-[clamp(2.8rem,5vw,4.6rem)] tw:leading-[1.06] tw:font-bold tw:tracking-[-0.045em]">{{ t("header.partners") }}</h1>
        <p class="tw:text-home-muted tw:mt-5 tw:text-base tw:leading-7 tw:sm:text-lg tw:sm:leading-8">
          {{ t("partnersPage.heroDescription") }}
        </p>
        <UBadge color="neutral" variant="soft" size="lg" class="tw:mt-7">
          {{ t("partnersPage.summary", { partners: partners.length, countries: countryCount }) }}
        </UBadge>
      </div>
    </header>

    <section class="tw:py-12 tw:sm:py-16" aria-labelledby="partner-institutions">
      <p class="tw:text-home-muted tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase">{{ t("partnersPage.networkEyebrow") }}</p>
      <h2 id="partner-institutions" class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl">{{ t("partnersPage.institutionsTitle") }}</h2>
      <div class="tw:mt-7 tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        <div
          v-for="(partner, index) in partners"
          :key="partner[0]"
          class="tw:flex tw:min-h-48 tw:min-w-0 tw:flex-col tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-6 tw:shadow-sm"
        >
          <div class="tw:flex tw:items-baseline tw:justify-between tw:gap-2">
            <span class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-link tw:uppercase">{{ t(`partnersPage.countries.${partner[1]}`) }}</span>
            <span class="tw:text-xl tw:font-bold tw:text-slate-300">{{ String(index + 1).padStart(2, "0") }}</span>
          </div>
          <h3 class="tw:mt-4 tw:text-lg tw:leading-snug tw:font-bold">{{ partner[0] }}</h3>
          <UButton
            :to="partner[2]"
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
          :key="organization[0]"
          :to="organization[2]"
          :aria-label="organization[0]"
          target="_blank"
          rel="noopener noreferrer"
          color="neutral"
          variant="ghost"
          class="tw:flex tw:min-h-32 tw:items-center tw:justify-center tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-5 tw:hover:bg-white"
        >
          <img
            :src="'https://files.geocollections.info/img/geocase/static/partners/' + organization[1]"
            :alt="organization[0]"
            loading="lazy"
            class="tw:max-h-20 tw:max-w-full tw:object-contain"
          />
        </UButton>
      </div>
    </section>
  </article>
</template>
