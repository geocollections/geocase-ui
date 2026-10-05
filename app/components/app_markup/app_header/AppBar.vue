<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "#imports";
import { useI18n } from "vue-i18n";
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
const settings = useSettingsStore();
const { language, localePath, changeLanguage } = useAppNavigation();
const quickSearch = ref("");
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
    to: "/institution",
  },
  {
    label: t("header.help"),
    to: "/help",
  },
]);
const languageNames = {
  en: "English",
  ee: "Eesti",
  de: "Deutsch",
} as const;
const languages = computed(() =>
  (Object.entries(languageNames) as [keyof typeof languageNames, string][]).map(
    ([value, label]) => ({
      label,
      onSelect: () => changeLanguage(value),
    }),
  ),
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
    class="tw:fixed tw:inset-x-0 tw:top-0 tw:z-2020 tw:h-16 tw:border-b tw:border-home-accent/20 tw:bg-home-hero tw:text-home-hero-muted tw:shadow-header-home"
  >
    <nav
      aria-label="Main navigation"
      class="tw:flex tw:h-full tw:items-center tw:gap-1 tw:px-3 tw:sm:gap-2 tw:sm:px-5"
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
        aria-label="GeoCASe"
        class="tw:mr-1 tw:flex tw:shrink-0 tw:items-center tw:rounded-lg tw:whitespace-nowrap tw:no-underline tw:transition-opacity tw:hover:opacity-85 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-accent tw:sm:mr-3"
      >
        <span
          class="tw:font-serif tw:text-[1.55rem] tw:font-bold tw:tracking-[-0.055em]"
        >
          <span class="tw:text-home-accent">Geo</span>
          <span class="tw:text-white">CASe</span>
        </span>
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
          :aria-label="t('header.language')"
          :title="languageNames[language]"
          color="neutral"
          variant="ghost"
          class="header-button tw:px-2.5"
        >
          {{ languageNames[language] }}
        </UButton>
      </UDropdownMenu>
      <UTooltip :text="t('header.menu')" :ui="{ content: 'tw:z-[3400]' }">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="header-button tw:gap-2 tw:px-3"
          :aria-label="t('header.menu')"
          @click="emit('toggle:navigationDrawer')"
        >
          <span class="tw:hidden tw:min-[600px]:inline">{{
            t("header.menu")
          }}</span>
        </UButton>
      </UTooltip>
    </nav>
  </header>
</template>
