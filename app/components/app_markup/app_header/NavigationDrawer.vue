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
    }"
  >
    <template #title>
      <span
        class="tw:mb-2 tw:block tw:font-serif tw:text-[1.55rem] tw:font-bold tw:tracking-[-0.055em]"
      >
        <span class="tw:text-home-accent">Geo</span>
        <span class="tw:text-white">CASe</span>
      </span>
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
      <img
        src="https://files.geocollections.info/img/geocase/front_page/geocase_landing2.jpg"
        alt=""
        aria-hidden="true"
        class="tw:mt-5 tw:aspect-[2.88/1] tw:w-full tw:rounded-xl tw:object-cover"
      />
      <section
        class="tw:mt-7 tw:border-t tw:border-home-border tw:pt-5"
        :aria-label="t('header.resources')"
      >
        <h2
          class="tw:px-4 tw:text-xs tw:font-extrabold tw:uppercase tw:tracking-[0.14em] tw:text-home-muted"
        >
          {{ t("header.resources") }}
        </h2>
        <nav
          :aria-label="t('header.resources')"
          class="tw:mt-2 tw:flex tw:flex-col tw:gap-1"
        >
          <a
            v-for="resource in settings.externalResources"
            :key="resource.url"
            :href="resource.url"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:flex tw:min-h-11 tw:items-center tw:gap-3 tw:rounded-lg tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-home-link tw:no-underline tw:transition-colors tw:hover:bg-home-hover tw:hover:text-home-ink tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-focus"
          >
            <UIcon
              name="i-lucide-link-2"
              class="tw:size-4 tw:shrink-0 tw:text-home-muted"
              aria-hidden="true"
            />
            <span class="tw:flex-1">{{ resource.text }}</span>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="tw:size-3.5 tw:shrink-0 tw:text-home-muted"
              aria-hidden="true"
            />
          </a>
        </nav>
      </section>
    </template>
  </USlideover>
</template>
