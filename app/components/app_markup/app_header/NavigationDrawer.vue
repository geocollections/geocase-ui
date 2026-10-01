<script setup lang="ts">
import { useRoute } from "#imports";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "@/stores/settings";
import {
  navigationVisibility,
  useAppNavigation,
} from "@/composables/useAppNavigation";

const drawer = defineModel<boolean>("drawer", { required: true });
const route = useRoute();
const settings = useSettingsStore();
const { t } = useI18n();
const { localePath } = useAppNavigation();
const icons: Record<string, string> = {
  "/": "i-lucide-house",
  "/search": "i-lucide-search",
  "/about": "i-lucide-info",
  "/access": "i-lucide-database",
  "/tutorial": "i-lucide-book-open",
  "/efg": "i-lucide-globe",
  "/partners_and_providers": "i-lucide-handshake",
  "/help": "i-lucide-circle-help",
  "/links": "i-lucide-link",
};
function isActive(path: string) {
  return route.path.replace(/\/$/, "") === localePath(path).replace(/\/$/, "");
}
</script>

<template>
  <USlideover
    v-model:open="drawer"
    :title="t('header.menu')"
    :ui="{
      overlay: 'tw:z-[3290] tw:bg-home-hero/55 tw:backdrop-blur-sm',
      content:
        'tw:z-[3300] tw:w-full tw:max-w-sm tw:bg-home-surface tw:text-home-ink tw:ring-0 tw:shadow-2xl',
      header:
        'tw:relative tw:min-h-36 tw:items-center tw:border-home-accent/20 tw:bg-home-hero tw:px-7 tw:py-8',
      title: 'tw:text-2xl tw:font-semibold tw:tracking-tight tw:text-white',
      close: 'header-button tw:top-5 tw:right-5',
      body: 'tw:p-4 tw:sm:p-5',
      footer: 'tw:border-home-border tw:px-7 tw:py-5',
    }"
  >
    <template #title>
      <span
        class="tw:mb-2 tw:block tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-accent"
        >GeoCASe</span
      >
      {{ t("header.menu") }}
    </template>
    <template #body>
      <nav aria-label="Site navigation" class="tw:flex tw:flex-col tw:gap-1.5">
        <NuxtLink
          v-for="item in settings.routes"
          :key="item.name"
          :to="localePath(item.to)"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          class="tw:group tw:flex tw:min-h-14 tw:items-center tw:gap-4 tw:rounded-xl tw:px-4 tw:py-3 tw:text-base tw:font-bold tw:no-underline tw:hover:no-underline tw:transition-colors tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-focus"
          :class="[
            navigationVisibility[item.to]?.drawer,
            isActive(item.to)
              ? 'tw:bg-home-hero tw:text-home-accent'
              : 'tw:text-home-ink tw:hover:bg-home-hover tw:hover:text-home-link',
          ]"
          @click="drawer = false"
        >
          <span
            class="tw:flex tw:size-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg"
            :class="
              isActive(item.to)
                ? 'tw:bg-home-accent/15'
                : 'tw:bg-home-ink/5 tw:text-home-muted'
            "
          >
            <UIcon
              :name="icons[item.to] || 'i-lucide-arrow-up-right'"
              class="tw:size-5"
              aria-hidden="true"
            />
          </span>
          <span class="tw:flex-1">{{ item.text }}</span>
          <UIcon
            name="i-lucide-arrow-right"
            class="tw:size-4 tw:shrink-0 tw:transition-transform tw:group-hover:translate-x-1 tw:motion-reduce:transition-none"
            :class="isActive(item.to) ? 'tw:opacity-100' : 'tw:opacity-40'"
            aria-hidden="true"
          />
        </NuxtLink>
      </nav>
    </template>
    <template #footer>
      <NuxtLink
        :to="localePath('/')"
        class="tw:flex tw:items-center tw:gap-2 tw:rounded-md tw:text-sm tw:font-extrabold tw:tracking-tight tw:text-home-link tw:no-underline tw:hover:text-home-ink tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-focus"
        @click="drawer = false"
      >
        <UIcon name="i-lucide-globe" class="tw:size-4" aria-hidden="true" />
        GeoCASe
      </NuxtLink>
    </template>
  </USlideover>
</template>
