<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";
import FastSearch from "@/components/search/FastSearch.vue";

const { t } = useI18n();
const { localePath } = useAppNavigation();
</script>

<template>
  <section
    class="tw:bg-home-hero tw:relative tw:isolate tw:overflow-hidden tw:text-white"
  >
    <img
      src="https://files.geocollections.info/img/geocase/front_page/geocase_landing3.jpg"
      :alt="t('header.landingPageAltText')"
      class="tw:absolute tw:inset-0 tw:-z-20 tw:size-full tw:object-cover tw:saturate-[0.7]"
    />
    <div
      class="tw:absolute tw:inset-0 tw:-z-10 tw:bg-[#9438c8]/20 tw:mix-blend-color"
      aria-hidden="true"
    />
    <div
      class="tw:from-home-hero/98 tw:via-home-hero/75 tw:to-home-hero/25 tw:absolute tw:z-0 tw:inset-0 tw:bg-linear-to-r"
    />

    <UContainer
      class="tw:relative tw:z-10 tw:flex tw:min-h-135 tw:items-center tw:py-16 tw:sm:py-20"
    >
      <div class="tw:max-w-3xl">
        <p
          class="tw:text-home-accent tw:mb-6 tw:text-xs tw:font-extrabold tw:tracking-[0.18em] tw:uppercase"
        >
          GeoCASe / {{ t("frontPage.heroEyebrow") }}
        </p>
        <h1
          class="tw:max-w-205 tw:text-[clamp(2.5rem,5vw,4.5rem)] tw:leading-[1.06] tw:font-extrabold tw:tracking-[-0.045em]"
        >
          <span class="tw:block">GeoCASe 2.0</span>
          <span class="tw:block">{{ t("frontPage.title") }}</span>
        </h1>
        <p
          class="tw:text-home-hero-muted tw:mt-6 tw:max-w-2xl tw:text-lg tw:leading-relaxed tw:sm:text-2xl"
        >
          {{ t("frontPage.heroDescription") }}
        </p>
        <FastSearch hero />
        <NuxtLink
          :to="localePath('/search')"
          class="tw:hover:text-home-accent tw:focus-visible:outline-home-accent tw:inline-flex tw:items-center tw:gap-3 tw:rounded-2xl tw:font-bold tw:text-white tw:no-underline tw:transition-colors tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4"
        >
          {{ t("frontPage.browseAll") }}
          <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
        </NuxtLink>
      </div>
    </UContainer>
  </section>
</template>
