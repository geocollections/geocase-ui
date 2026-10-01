<script setup lang="ts">
definePageMeta({
  name: "Access",
  path: "/:locale(en|ee|de)?/access",
  layout: "default",
});

const { t, tm, rt } = useI18n();
const { localePath } = useAppNavigation();
useHead(() => ({ title: t("accessPage.pageTitle") }));

const highlights = [
  { key: "credit", icon: "i-lucide-quote" },
  { key: "licence", icon: "i-lucide-file-check-2" },
  { key: "care", icon: "i-lucide-shield-check" },
];
const terms = computed(() => tm("accessPage.terms") as string[]);
const legal = computed(
  () => tm("accessPage.legal") as { title: string; paragraphs: string[] }[],
);
const termGroups = computed(() => [
  { key: "user", icon: "i-lucide-book-open", items: terms.value.slice(0, 6) },
  {
    key: "provider",
    icon: "i-lucide-database",
    items: terms.value.slice(6, 9),
  },
]);
const repositories = [
  { key: "portal", name: "geocase-ui", icon: "i-lucide-panels-top-left" },
  { key: "thumbnails", name: "geocase-thumbnail", icon: "i-lucide-images" },
  {
    key: "infrastructure",
    name: "geocase-infrastructure",
    icon: "i-lucide-network",
  },
];
const sections = [
  { id: "terms", key: "termsNav" },
  { id: "legal", key: "legalNav" },
  { id: "source", key: "sourceNav" },
];
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
            {{ t("accessPage.eyebrow") }}
          </p>
          <h1
            class="tw:whitespace-pre-line tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.06] tw:font-bold tw:tracking-tight"
          >
            {{ t("accessPage.heroTitle") }}
          </h1>
          <p
            class="tw:mt-5 tw:max-w-xl tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8"
          >
            {{ t("accessPage.heroDescription") }}
          </p>
          <div class="tw:mt-7 tw:flex tw:flex-wrap tw:items-center tw:gap-4">
            <NuxtLink
              :to="localePath('/search')"
              class="tw:inline-flex tw:items-center tw:gap-3 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:no-underline tw:transition-colors tw:hover:bg-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-link"
            >
              {{ t("accessPage.explore") }}
              <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
            </NuxtLink>
            <a
              href="#terms"
              class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-lg tw:py-3 tw:font-bold tw:text-home-link tw:no-underline tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-link"
            >
              {{ t("accessPage.readTerms") }}
              <UIcon name="i-lucide-arrow-down" aria-hidden="true" />
            </a>
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
            class="tw:relative tw:grid tw:size-32 tw:place-items-center tw:rounded-3xl tw:bg-home-hero tw:text-home-accent tw:shadow-xl tw:rotate-[-8deg]"
          >
            <UIcon
              name="i-lucide-lock-keyhole-open"
              class="tw:size-16 tw:rotate-[8deg]"
            />
          </div>
          <div
            class="tw:absolute tw:top-5 tw:right-5 tw:grid tw:size-14 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-home-link tw:shadow-md"
          >
            <UIcon name="i-lucide-earth" class="tw:size-7" />
          </div>
          <div
            class="tw:absolute tw:bottom-8 tw:left-0 tw:grid tw:size-14 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-home-link tw:shadow-md"
          >
            <UIcon name="i-lucide-file-check-2" class="tw:size-7" />
          </div>
          <div
            class="tw:absolute tw:right-4 tw:bottom-6 tw:grid tw:size-10 tw:place-items-center tw:rounded-full tw:bg-home-accent tw:text-home-hero"
          >
            <UIcon name="i-lucide-check" class="tw:size-5" />
          </div>
        </div>
      </div>
    </header>

    <nav
      :aria-label="t('accessPage.contents')"
      class="tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-3 tw:border-b tw:border-home-border tw:py-5"
    >
      <a
        v-for="(section, index) in sections"
        :key="section.id"
        :href="`#${section.id}`"
        class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded tw:text-sm tw:font-bold tw:text-home-link tw:no-underline tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-link"
      >
        <span class="tw:text-home-muted" aria-hidden="true"
          >0{{ index + 1 }}</span
        >{{ t(`accessPage.${section.key}`) }}
      </a>
    </nav>

    <section aria-labelledby="overview-title" class="tw:py-10 tw:sm:py-12">
      <p
        class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-muted"
      >
        {{ t("accessPage.overview") }}
      </p>
      <h2
        id="overview-title"
        class="tw:mt-2 tw:max-w-2xl tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
      >
        {{ t("accessPage.overviewTitle") }}
      </h2>
      <ul
        class="tw:mt-6 tw:grid tw:gap-4 tw:md:grid-cols-3 tw:list-none tw:p-0"
      >
        <li
          v-for="item in highlights"
          :key="item.key"
          class="tw:rounded-2xl tw:bg-home-surface tw:p-6"
        >
          <span
            class="tw:grid tw:size-11 tw:place-items-center tw:rounded-xl tw:bg-home-link/10 tw:text-home-link"
            ><UIcon :name="item.icon" class="tw:size-5" aria-hidden="true"
          /></span>
          <h3 class="tw:mt-5 tw:text-lg tw:font-bold">
            {{ t(`accessPage.${item.key}Title`) }}
          </h3>
          <p class="tw:mt-2 tw:leading-7 tw:text-home-muted">
            {{ t(`accessPage.${item.key}Description`) }}
          </p>
        </li>
      </ul>
    </section>

    <section id="terms" aria-labelledby="terms-title" class="tw:scroll-mt-24">
      <p
        class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-muted"
      >
        {{ t("accessPage.termsEyebrow") }}
      </p>
      <h2
        id="terms-title"
        class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
      >
        {{ t("accessPage.termsTitle") }}
      </h2>
      <p class="tw:mt-3 tw:leading-7 tw:text-home-muted">
        {{ t("accessPage.termsIntro") }}
      </p>
      <div class="tw:mt-6 tw:grid tw:items-start tw:gap-4 tw:lg:grid-cols-2">
        <div
          v-for="group in termGroups"
          :key="group.key"
          class="tw:rounded-2xl tw:border tw:border-home-border tw:p-5 tw:sm:p-7"
        >
          <h3 class="tw:flex tw:items-center tw:gap-3 tw:text-xl tw:font-bold">
            <UIcon
              :name="group.icon"
              class="tw:size-6 tw:shrink-0 tw:text-home-link"
              aria-hidden="true"
            />{{ t(`accessPage.${group.key}Title`) }}
          </h3>
          <ul class="tw:mt-5 tw:list-none tw:space-y-5 tw:p-0">
            <li
              v-for="(term, index) in group.items"
              :key="index"
              class="tw:flex tw:items-start tw:gap-3"
            >
              <UIcon
                name="i-lucide-check"
                class="tw:mt-1 tw:size-5 tw:shrink-0 tw:text-home-link"
                aria-hidden="true"
              />
              <p class="tw:leading-7 tw:text-home-muted">{{ rt(term) }}</p>
            </li>
          </ul>
        </div>
      </div>
      <aside
        class="tw:mt-4 tw:flex tw:items-start tw:gap-4 tw:rounded-2xl tw:bg-home-surface tw:p-5 tw:sm:p-6"
      >
        <UIcon
          name="i-lucide-info"
          class="tw:mt-1 tw:size-6 tw:shrink-0 tw:text-home-link"
          aria-hidden="true"
        />
        <div>
          <h3 class="tw:font-bold">
            {{ t("accessPage.responsibilityTitle") }}
          </h3>
          <p class="tw:mt-2 tw:leading-7 tw:text-home-muted">
            {{ rt(terms[9] ?? "") }}
          </p>
        </div>
      </aside>
    </section>

    <section
      id="legal"
      aria-labelledby="legal-title"
      class="tw:scroll-mt-24 tw:py-10 tw:sm:py-12"
    >
      <p
        class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-muted"
      >
        {{ t("accessPage.legalEyebrow") }}
      </p>
      <h2
        id="legal-title"
        class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
      >
        {{ t("accessPage.legalTitle") }}
      </h2>
      <div
        class="tw:mt-6 tw:divide-y tw:divide-home-border tw:rounded-3xl tw:bg-home-surface tw:px-5 tw:sm:px-8"
      >
        <section
          v-for="(section, index) in legal"
          :key="index"
          :aria-labelledby="`legal-section-${index}`"
          class="tw:grid tw:gap-4 tw:py-7 tw:lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] tw:lg:gap-10"
        >
          <h3 :id="`legal-section-${index}`" class="tw:text-lg tw:font-bold">
            {{ rt(section.title) }}
          </h3>
          <div
            class="tw:min-w-0 tw:space-y-4 tw:leading-7 tw:text-home-muted tw:[&_a]:wrap-break-word tw:[&_a]:font-bold tw:[&_a]:text-home-link tw:[&_a]:underline tw:[&_a]:underline-offset-4 tw:[&_a:focus-visible]:outline-2 tw:[&_a:focus-visible]:outline-home-link"
          >
            <p
              v-for="(paragraph, paragraphIndex) in section.paragraphs"
              :key="paragraphIndex"
              v-html="rt(paragraph)"
            />
          </div>
        </section>
      </div>
    </section>

    <section
      id="source"
      aria-labelledby="source-title"
      class="tw:mb-4 tw:scroll-mt-24 tw:rounded-3xl tw:bg-home-hero tw:p-6 tw:text-home-hero-muted tw:sm:p-9"
    >
      <p
        class="tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-accent"
      >
        {{ t("accessPage.sourceEyebrow") }}
      </p>
      <h2
        id="source-title"
        class="tw:mt-3 tw:text-2xl tw:font-bold tw:tracking-tight tw:text-white tw:sm:text-3xl"
      >
        {{ t("accessPage.sourceTitle") }}
      </h2>
      <p class="tw:mt-3 tw:max-w-2xl tw:leading-7">
        {{ t("accessPage.sourceDescription") }}
      </p>
      <div class="tw:mt-6 tw:grid tw:gap-3 tw:md:grid-cols-3">
        <a
          v-for="repo in repositories"
          :key="repo.key"
          :href="`https://github.com/geocollections/${repo.name}`"
          target="_blank"
          rel="noopener noreferrer"
          class="tw:group tw:flex tw:items-center tw:gap-3 tw:rounded-xl tw:border tw:border-home-hero-muted/20 tw:p-4 tw:text-white tw:no-underline tw:transition-colors tw:hover:bg-home-hero-muted/10 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-home-accent"
        >
          <UIcon
            :name="repo.icon"
            class="tw:size-5 tw:shrink-0 tw:text-home-accent"
            aria-hidden="true"
          />
          <span class="tw:font-bold">{{ t(`accessPage.${repo.key}`) }}</span>
          <UIcon
            name="i-lucide-arrow-up-right"
            class="tw:ml-auto tw:shrink-0 tw:text-home-accent"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  </article>
</template>
