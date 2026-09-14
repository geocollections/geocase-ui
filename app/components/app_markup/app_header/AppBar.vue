<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "#imports";
import { useI18n } from "vue-i18n";
import { useDetailStore } from "@/stores/detail";
import { useSettingsStore } from "@/stores/settings";
import {
  navigationVisibility,
  useAppNavigation,
} from "@/composables/useAppNavigation";

const emit = defineEmits<{
  "toggle:searchDrawer": [];
  "toggle:navigationDrawer": [];
}>();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const detail = useDetailStore();
const settings = useSettingsStore();
const { language, localePath, changeLanguage } = useAppNavigation();
const quickSearch = ref("");
const isProduction =
  import.meta.client && /(^|\.)geocase\.eu$/.test(window.location.hostname);
const barGradientClass = computed(() => {
  if (route.name === "Detail") {
    if (detail.isItemFossil) return "tw:from-fossil";
    if (detail.isItemMineral) return "tw:from-mineral";
    if (detail.isItemRock) return "tw:from-rock";
    if (detail.isItemMeteorite) return "tw:from-meteorite";
  }
  return "tw:from-geocase";
});
const links = computed(() => [
  {
    label: t("header.search"),
    to: "/search",
  },
  {
    label: t("header.about"),
    to: "/about",
  },
  {
    label: t("header.access"),
    to: "/access",
  },
  {
    label: t("header.partners"),
    to: "/partners_and_providers",
  },
  {
    label: t("header.help"),
    to: "/help",
  },
]);
const languages = computed(() =>
  (["en", "ee", "de"] as const).map((value, index) => ({
    label: ["ENG", "EST", "GER"][index],
    onSelect: () => changeLanguage(value),
  })),
);
const resources = computed(() =>
  settings.externalResources.map((item) => ({
    label: item.text,
    to: item.url,
    target: "_blank",
    icon: "i-lucide-external-link",
  })),
);
function submitSearch() {
  router.push({
    path: localePath("/search"),
    query: { q: quickSearch.value || undefined, page: 1 },
  });
}
</script>

<template>
  <header
    class="tw:fixed tw:inset-x-0 tw:top-0 tw:z-2020 tw:h-16 tw:bg-linear-320/srgb tw:to-header-dark tw:text-white tw:shadow-xl"
    :class="barGradientClass"
  >
    <nav
      aria-label="Main navigation"
      class="tw:flex tw:h-full tw:items-center tw:gap-1 tw:px-3 tw:sm:gap-2 tw:sm:px-4"
    >
      <UTooltip
        v-if="route.name === 'Search'"
        :text="t('header.showSearch')"
        :ui="{ content: 'tw:z-[3400]' }"
      >
        <UButton
          icon="i-lucide-sliders-horizontal"
          color="neutral"
          variant="ghost"
          class="header-button"
          aria-label="Toggle navigation drawer"
          @click="emit('toggle:searchDrawer')"
        />
      </UTooltip>
      <NuxtLink
        :to="localePath('/')"
        :title="t('header.titleTooltip')"
        class="tw:shrink-0 tw:whitespace-nowrap tw:text-lg tw:font-bold tw:tracking-wide tw:text-white tw:no-underline tw:sm:mr-2 tw:sm:text-xl"
      >
        GeoCASe
        <span
          v-if="!isProduction"
          class="tw:hidden tw:text-xs tw:min-[600px]:inline"
          >DEV</span
        >
      </NuxtLink>
      <UButton
        v-for="link in links"
        :key="link.to"
        :to="localePath(link.to)"
        :label="link.label"
        color="neutral"
        variant="ghost"
        class="header-button"
        :class="navigationVisibility[link.to]?.header"
      />
      <div class="tw:flex-1" />
      <form
        v-if="route.name !== 'FrontPage' && route.name !== 'Search'"
        class="tw:hidden tw:w-52 tw:shrink tw:min-[960px]:block"
        @submit.prevent="submitSearch"
      >
        <UInput
          v-model="quickSearch"
          :placeholder="t('frontPage.quickSearch')"
          :aria-label="t('frontPage.quickSearch')"
          icon="i-lucide-search"
          class="tw:w-full"
        />
      </form>
      <UDropdownMenu :items="languages" :ui="{ content: 'tw:z-[3300]' }">
        <UButton
          aria-label="select language"
          color="neutral"
          variant="ghost"
          class="header-button"
        >
          <img
            :src="`https://files.geocollections.info/img/geocase/flags/${language}.svg`"
            :alt="language"
            class="tw:size-6 tw:rounded-full tw:object-cover"
          />
        </UButton>
      </UDropdownMenu>
      <UDropdownMenu :items="resources" :ui="{ content: 'tw:z-[3300]' }">
        <UButton
          :aria-label="t('header.resources')"
          icon="i-lucide-library"
          color="neutral"
          variant="ghost"
          class="header-button"
        >
          <span class="tw:hidden tw:min-[600px]:inline">{{
            t("header.resources")
          }}</span>
        </UButton>
      </UDropdownMenu>
      <UTooltip :text="t('header.menu')" :ui="{ content: 'tw:z-[3400]' }">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="header-button"
          :aria-label="t('header.menu')"
          @click="emit('toggle:navigationDrawer')"
        />
      </UTooltip>
    </nav>
  </header>
</template>
