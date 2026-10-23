<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";

definePageMeta({
  name: "Help",
  path: "/:locale(en|ee|de)?/help",
  layout: "default",
});

const { t } = useI18n();
const failedPhotos = ref<string[]>([]);
const contacts = [
  { name: "Olle Hints", initials: "OH", topic: "general", icon: "i-lucide-messages-square", email: "olle.hints@taltech.ee", photo: "https://volt.ttu.ee/v1/2V6C7Q/photo:T003766", phone: "+372 620 3027", phoneHref: "+3726203027" },
  { name: "Kristjan Urtson", initials: "KU", topic: "providers", icon: "i-lucide-database", email: "kristjan.urtson@taltech.ee", photo: "https://media.voog.com/0000/0041/7136/photos/urtson.jpg", phone: "+372 620 3034", phoneHref: "+3726203034" },
  { name: "Alissa Milovidova", initials: "AM", topic: "portal", icon: "i-lucide-panels-top-left", email: "alissa.milovidova@taltech.ee", photo: "https://volt.ttu.ee/v1/2V6C7Q/photo:T0079165", phone: "+372 55959507", phoneHref: "+37255959507" },
];
const { localePath } = useAppNavigation();

useHead(() => ({ title: t("helpPage.pageTitle") }));
</script>

<template>
  <article
    class="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12"
  >
    <header
      class="tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-home-hover tw:p-6 tw:sm:p-10 tw:lg:p-12"
    >
      <div
        class="tw:relative tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]"
      >
        <div>
          <p
            class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/80 tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-link"
          >
            <span
              class="tw:size-2 tw:rounded-full tw:bg-geocase"
              aria-hidden="true"
            />
            {{ t("helpPage.eyebrow") }}
          </p>
          <h1
            class="tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.06] tw:font-bold tw:tracking-tight"
          >
            {{ t("helpPage.heroTitle") }}
          </h1>
          <p
            class="tw:mt-5 tw:max-w-xl tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8"
          >
            {{ t("helpPage.heroDescription") }}
          </p>
          <div class="tw:mt-7 tw:flex tw:flex-wrap tw:items-center tw:gap-4">
            <NuxtLink
              :to="localePath('/tutorial')"
              class="tw:inline-flex tw:items-center tw:gap-3 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:no-underline tw:transition-colors tw:hover:bg-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-link"
            >
              {{ t("helpPage.tutorialLink") }}
              <UIcon name="i-lucide-book-open" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              :to="localePath('/search')"
              class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-lg tw:py-3 tw:font-bold tw:text-home-link tw:no-underline tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-link"
            >
              {{ t("helpPage.searchLink") }}
              <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
        <div
          class="tw:relative tw:mx-auto tw:grid tw:aspect-square tw:w-full tw:max-w-72 tw:place-items-center"
          aria-hidden="true"
        >
          <div
            class="tw:absolute tw:inset-0 tw:rounded-full tw:border tw:border-home-link/15"
          />
          <div
            class="tw:absolute tw:inset-8 tw:rounded-full tw:border tw:border-home-link/20"
          />
          <div class="tw:absolute tw:inset-16 tw:rounded-full tw:bg-white/60" />
          <div
            class="tw:relative tw:grid tw:size-32 tw:place-items-center tw:rounded-3xl tw:bg-home-hero tw:text-home-accent tw:shadow-xl"
          >
            <UIcon name="i-lucide-life-buoy" class="tw:size-16" />
          </div>
          <div
            class="tw:absolute tw:top-5 tw:right-5 tw:grid tw:size-14 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-home-link tw:shadow-md"
          >
            <UIcon name="i-lucide-book-open" class="tw:size-7" />
          </div>
          <div
            class="tw:absolute tw:bottom-8 tw:left-0 tw:grid tw:size-14 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-home-link tw:shadow-md"
          >
            <UIcon name="i-lucide-search" class="tw:size-7" />
          </div>
          <div
            class="tw:absolute tw:right-4 tw:bottom-6 tw:grid tw:size-10 tw:place-items-center tw:rounded-full tw:bg-home-accent tw:text-home-hero"
          >
            <UIcon name="i-lucide-message-circle" class="tw:size-5" />
          </div>
        </div>
      </div>
    </header>

    <section
      class="tw:grid tw:gap-4 tw:py-8 tw:sm:grid-cols-2 tw:sm:py-10"
      :aria-label="t('helpPage.resourcesLabel')"
    >
      <NuxtLink
        :to="localePath('/tutorial')"
        class="tw:group tw:flex tw:items-start tw:gap-4 tw:rounded-2xl tw:bg-home-surface tw:p-5 tw:text-home-ink tw:no-underline tw:transition-colors tw:hover:bg-home-hover tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-link tw:sm:p-6"
      >
        <span
          class="tw:grid tw:size-11 tw:shrink-0 tw:place-items-center tw:rounded-xl tw:bg-home-link/10 tw:text-home-link"
        >
          <UIcon
            name="i-lucide-book-open"
            class="tw:size-5"
            aria-hidden="true"
          />
        </span>
        <span class="tw:min-w-0">
          <span class="tw:block tw:font-bold">{{
            t("helpPage.tutorialTitle")
          }}</span>
          <span
            class="tw:mt-1 tw:block tw:text-sm tw:leading-6 tw:text-home-muted"
          >
            {{ t("helpPage.tutorialDescription") }}
          </span>
        </span>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="tw:ml-auto tw:shrink-0 tw:text-home-link tw:transition-transform tw:group-hover:translate-x-0.5 tw:group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </NuxtLink>

      <NuxtLink
        :to="localePath('/search')"
        class="tw:group tw:flex tw:items-start tw:gap-4 tw:rounded-2xl tw:bg-home-surface tw:p-5 tw:text-home-ink tw:no-underline tw:transition-colors tw:hover:bg-home-hover tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-link tw:sm:p-6"
      >
        <span
          class="tw:grid tw:size-11 tw:shrink-0 tw:place-items-center tw:rounded-xl tw:bg-home-link/10 tw:text-home-link"
        >
          <UIcon name="i-lucide-search" class="tw:size-5" aria-hidden="true" />
        </span>
        <span class="tw:min-w-0">
          <span class="tw:block tw:font-bold">{{
            t("helpPage.searchTitle")
          }}</span>
          <span
            class="tw:mt-1 tw:block tw:text-sm tw:leading-6 tw:text-home-muted"
          >
            {{ t("helpPage.searchDescription") }}
          </span>
        </span>
        <UIcon
          name="i-lucide-arrow-up-right"
          class="tw:ml-auto tw:shrink-0 tw:text-home-link tw:transition-transform tw:group-hover:translate-x-0.5 tw:group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </NuxtLink>
    </section>

    <section
      id="contact"
      aria-labelledby="contact-title"
      class="tw:scroll-mt-24 tw:overflow-hidden tw:rounded-3xl tw:border tw:border-home-border tw:bg-white"
    >
      <div
        class="tw:border-b tw:border-home-border tw:bg-home-surface tw:px-5 tw:py-6 tw:sm:px-8"
      >
        <p
          class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-muted"
        >
          {{ t("helpPage.contactEyebrow") }}
        </p>
        <h2
          id="contact-title"
          class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
        >
          {{ t("helpPage.contactTitle") }}
        </h2>
        <p class="tw:mt-3 tw:max-w-2xl tw:leading-7 tw:text-home-muted">
          {{ t("helpPage.contactDescription") }}
        </p>
      </div>
      <div class="tw:grid tw:gap-5 tw:p-5 tw:sm:p-8 tw:lg:grid-cols-3">
        <article v-for="contact in contacts" :key="contact.email" class="tw:flex tw:min-w-0 tw:flex-col tw:rounded-2xl tw:border tw:border-home-border tw:bg-home-surface/50 tw:p-6">
          <div class="tw:mb-6 tw:flex tw:items-center tw:gap-2 tw:text-xs tw:font-bold tw:tracking-wide tw:text-home-link">
            <UIcon :name="contact.icon" class="tw:size-4 tw:shrink-0" aria-hidden="true" />
            {{ t(`helpPage.contacts.${contact.topic}.title`) }}
          </div>
          <div class="tw:mb-5 tw:flex tw:items-center tw:gap-4">
            <span v-if="contact.photo && !failedPhotos.includes(contact.email)" class="tw:block tw:size-20 tw:shrink-0 tw:overflow-hidden tw:rounded-2xl tw:bg-home-hover"><img :src="contact.photo" :alt="contact.name" :style="contact.initials === 'KU' ? { transform: 'scale(1.7)', transformOrigin: '50% 0%' } : undefined" width="80" height="80" loading="lazy" class="tw:size-20 tw:shrink-0 tw:rounded-2xl tw:bg-home-hover tw:object-cover tw:object-top" @error="failedPhotos.push(contact.email)" /></span>
            <span v-else class="tw:grid tw:size-20 tw:shrink-0 tw:place-items-center tw:rounded-2xl tw:bg-home-hover tw:text-2xl tw:font-bold tw:text-home-link" aria-hidden="true">{{ contact.initials }}</span>
            <h3 class="tw:text-xl tw:leading-tight tw:font-bold tw:tracking-tight">{{ contact.name }}</h3>
          </div>
          <p class="tw:mb-6 tw:text-sm tw:leading-6 tw:text-home-muted">{{ t(`helpPage.contacts.${contact.topic}.description`) }}</p>
          <address class="tw:mt-auto tw:grid tw:gap-3 tw:border-t tw:border-home-border tw:pt-5 tw:text-sm tw:not-italic">
            <a :href="`mailto:${contact.email}`" class="tw:flex tw:min-h-11 tw:items-center tw:gap-2 tw:rounded-lg tw:font-semibold tw:text-home-link tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2">
              <UIcon name="i-lucide-mail" class="tw:size-4 tw:shrink-0" aria-hidden="true" /><span class="tw:break-all">{{ contact.email }}</span>
            </a>
            <a v-if="contact.phone" :href="`tel:${contact.phoneHref}`" class="tw:flex tw:min-h-11 tw:items-center tw:gap-2 tw:rounded-lg tw:text-home-muted tw:hover:text-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2"><UIcon name="i-lucide-phone" class="tw:size-4 tw:shrink-0" aria-hidden="true" />{{ contact.phone }}</a>
          </address>
        </article>
      </div>
    </section>
  </article>
</template>
