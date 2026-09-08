<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";
const { t } = useI18n();
const { localePath } = useAppNavigation();
const logos = [
  {
    href: "https://cetaf.org/",
    alt: "footer.cetafLogoAltText",
    image: "cetaf_logo.png",
  },
  {
    href: "https://taltech.ee/en/department-geology",
    alt: "footer.taltechLogoAltText",
    image: "taltech1.png",
  },
  {
    href: "https://www.museumfuernaturkunde.berlin/",
    alt: "footer.mfnLogoAltText",
    image: "mfn1.png",
  },
];
</script>

<template>
  <footer
    class="tw:bg-neutral-900 tw:px-4 tw:py-5 tw:text-center tw:text-sm tw:text-white tw:shadow-lg tw:[&_a]:text-amber-300 tw:[&_a:hover]:underline"
  >
    <p class="tw:mb-1">
      {{ new Date().getFullYear() }} | <strong>{{ t("footer.title") }}</strong>
    </p>
    <p v-html="t('footer.collab_html')" />
    <p>
      {{ t("footer.dataBy") }}
      <NuxtLink :to="localePath('/partners_and_providers')">{{
        t("footer.partnerInstitutions")
      }}</NuxtLink>
      | <span v-html="t('footer.created_html')" />
    </p>
    <div
      class="tw:mt-3 tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:sm:flex-row"
    >
      <a
        v-for="logo in logos"
        :key="logo.image"
        :href="logo.href"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          :src="`https://geocase.eu/thumbnails/${logo.image}`"
          :alt="t(logo.alt)"
          width="175"
          height="90"
          loading="lazy"
          class="tw:h-22.5 tw:w-43.75 tw:object-contain"
        />
      </a>
    </div>
  </footer>
</template>
