<script setup lang="ts">
import { useI18n } from "vue-i18n";
import PartnersMap from "@/components/PartnersMap.vue";
import { institutions } from "@/institutions";

definePageMeta({
  name: "Institution detail",
  path: "/:locale(en|ee|de)?/institution/:id",
  layout: "default",
  validate: (route) => institutions.some((item) => item.id === route.params.id),
});

const route = useRoute();
const { t } = useI18n();
const { localePath } = useAppNavigation();
const institution = computed(() => institutions.find((item) => item.id === route.params.id));
useHead(() => ({ title: institution.value?.name ?? t("partnersPage.pageTitle") }));
</script>

<template>
  <article v-if="institution" class="tw:mx-auto tw:w-full tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <NuxtLink :to="localePath('/institution')" class="tw:inline-flex tw:items-center tw:gap-2 tw:font-semibold tw:text-home-link">
      <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
      {{ t("partnersPage.backToInstitutions") }}
    </NuxtLink>

    <header class="tw:mt-8 tw:rounded-3xl tw:bg-[#eaf0e9] tw:p-6 tw:sm:p-10 tw:lg:p-12">
      <p class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-link tw:uppercase">
        {{ t("partnersPage.institutionsTitle") }}
      </p>
      <h1 class="tw:mt-4 tw:max-w-4xl tw:text-[clamp(2.4rem,5vw,4.5rem)] tw:leading-[1.08] tw:font-bold tw:tracking-[-0.04em]">
        {{ institution.name }}
      </h1>
      <p class="tw:mt-5 tw:text-lg tw:text-home-muted">
        {{ t(`partnersPage.countries.${institution.countryKey}`) }}
      </p>
      <UButton
        :to="institution.url"
        target="_blank"
        rel="noopener noreferrer"
        trailing-icon="i-lucide-arrow-up-right"
        class="tw:mt-7"
      >
        {{ t("partnersPage.visitWebsite") }}
      </UButton>
    </header>

    <section class="tw:mt-8 tw:overflow-hidden tw:rounded-3xl tw:border tw:border-home-border" :aria-label="t('partnersPage.location')">
      <ClientOnly>
        <PartnersMap :institutions="[institution]" class="tw:min-h-96" />
      </ClientOnly>
    </section>
  </article>
</template>
