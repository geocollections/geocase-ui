<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { resources, resourceGroups } from "@/resources";

definePageMeta({
  name: "Links",
  path: "/:locale(en|ee|de)?/links",
  layout: "default",
});
const { t } = useI18n();
useHead(() => ({ title: t("linksPage.pageTitle") }));
const groups = computed(() =>
  resourceGroups.map((group) => ({
    ...group,
    resources: resources.filter((resource) => resource.group === group.id),
  })),
);
const hostname = (href: string) => new URL(href).hostname.replace(/^www\./, "");
</script>

<template>
  <article
    class="tw:mx-auto tw:w-full tw:min-w-0 tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12"
  >
    <header
      class="tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-home-banner tw:p-6 tw:sm:p-10 tw:lg:p-12"
    >
      <div
        class="tw:grid tw:items-center tw:gap-8 tw:lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)]"
      >
        <div>
          <p
            class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/80 tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-link tw:uppercase"
          >
            <span
              class="tw:size-2 tw:rounded-full tw:bg-geocase"
              aria-hidden="true"
            />{{ t("linksPage.eyebrow") }}
          </p>
          <h1
            class="tw:max-w-3xl tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.06] tw:font-bold tw:tracking-tight"
          >
            {{ t("linksPage.heroTitle") }}
          </h1>
          <p
            class="tw:mt-5 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8"
          >
            {{ t("linksPage.heroDescription") }}
          </p>
          <p class="tw:mt-5 tw:text-sm tw:font-semibold tw:text-home-link">
            {{
              t("linksPage.summary", {
                resources: resources.length,
                categories: groups.length,
              })
            }}
          </p>
        </div>
        <div
          aria-hidden="true"
          class="tw:relative tw:mx-auto tw:hidden tw:size-48 tw:place-items-center tw:lg:grid"
        >
          <div
            class="tw:absolute tw:inset-0 tw:rounded-full tw:border tw:border-home-link/15"
          />
          <div
            class="tw:absolute tw:inset-5 tw:rounded-full tw:border tw:border-home-link/15"
          />
          <span
            class="tw:grid tw:size-24 tw:place-items-center tw:rounded-3xl tw:bg-home-hero tw:text-home-accent tw:shadow-lg"
            ><UIcon name="i-lucide-compass" class="tw:size-12"
          /></span>
          <span
            class="tw:absolute tw:top-0 tw:right-0 tw:grid tw:size-12 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-home-link tw:shadow-sm"
            ><UIcon name="i-lucide-network" class="tw:size-6"
          /></span>
          <span
            class="tw:absolute tw:bottom-0 tw:left-0 tw:grid tw:size-12 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-home-link tw:shadow-sm"
            ><UIcon name="i-lucide-database" class="tw:size-6"
          /></span>
        </div>
      </div>
    </header>

    <nav
      :aria-label="t('linksPage.categoriesLabel')"
      class="tw:my-7 tw:flex tw:flex-wrap tw:gap-2 tw:sm:my-9"
    >
      <a
        v-for="group in groups"
        :key="group.id"
        :href="`#${group.id}`"
        class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-home-border tw:bg-white tw:px-4 tw:py-2.5 tw:text-sm tw:font-bold tw:text-home-link tw:no-underline tw:transition-colors tw:hover:bg-home-hover tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-focus"
        ><UIcon :name="group.icon" aria-hidden="true" />{{
          t(`linksPage.groups.${group.id}.title`)
        }}<span class="tw:text-xs tw:text-home-muted">{{
          group.resources.length
        }}</span></a
      >
    </nav>

    <section
      v-for="group in groups"
      :id="group.id"
      :key="group.id"
      :aria-labelledby="`${group.id}-title`"
      class="tw:scroll-mt-24 tw:border-t tw:border-home-border tw:py-8 tw:sm:py-10"
    >
      <div class="tw:mb-6 tw:flex tw:items-start tw:gap-4">
        <span
          class="tw:grid tw:size-12 tw:shrink-0 tw:place-items-center tw:rounded-2xl tw:bg-home-hover tw:text-home-link"
          ><UIcon :name="group.icon" class="tw:size-6" aria-hidden="true"
        /></span>
        <div>
          <h2
            :id="`${group.id}-title`"
            class="tw:text-2xl tw:font-bold tw:tracking-tight"
          >
            {{ t(`linksPage.groups.${group.id}.title`) }}
          </h2>
          <p class="tw:mt-2 tw:max-w-2xl tw:leading-7 tw:text-home-muted">
            {{ t(`linksPage.groups.${group.id}.description`) }}
          </p>
        </div>
      </div>
      <ul
        class="tw:m-0 tw:grid tw:list-none tw:gap-4 tw:p-0 tw:md:grid-cols-2 tw:xl:grid-cols-3"
      >
        <li
          v-for="resource in group.resources"
          :key="resource.id"
          class="tw:min-w-0"
        >
          <a
            :href="resource.href"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-card tw:group tw:flex tw:h-full tw:flex-col tw:rounded-2xl tw:border tw:border-home-border tw:bg-home-surface tw:p-5 tw:no-underline tw:transition-colors tw:hover:border-home-link/40 tw:hover:bg-home-hover tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-focus tw:sm:p-6"
          >
            <span class="tw:flex tw:items-start tw:justify-between tw:gap-4"
              ><span
                class="tw:text-lg tw:font-bold tw:leading-6 tw:text-home-ink"
                >{{ resource.name }}</span
              ><UIcon
                name="i-lucide-arrow-up-right"
                class="tw:size-5 tw:shrink-0 tw:text-home-link"
                aria-hidden="true"
            /></span>
            <span
              class="tw:mt-3 tw:flex-1 tw:text-sm tw:leading-6 tw:text-home-muted"
              >{{ t(`linksPage.descriptions.${resource.id}`) }}</span
            >
            <span
              class="tw:mt-5 tw:break-all tw:text-xs tw:font-semibold tw:text-home-link"
              >{{ hostname(resource.href) }}</span
            >
          </a>
        </li>
      </ul>
    </section>
  </article>
</template>
