<template>
  <NuxtLayout><NuxtPage /></NuxtLayout>
</template>
<script setup>
import i18n from "@/i18n";
const route = useRoute();
useHead(() => ({
  htmlAttrs: { lang: i18n.locale.value === "ee" ? "et" : i18n.locale.value },
  titleTemplate: "%s | GeoCASe",
}));
useSeoMeta({
  description: () => i18n.t("seo.description"),
  ogTitle: () => i18n.t("seo.ogTitle"),
  ogDescription: () => i18n.t("seo.description"),
  ogImage:
    "https://files.geocollections.info/img/geocase/front_page/geocase_landing.jpg",
  ogUrl: () => `https://geocase.eu${route.fullPath}`,
  ogImageAlt: () => i18n.t("header.landingPageAltText"),
  twitterCard: "summary_large_image",
  ogSiteName: "GeoCASe",
});
</script>
