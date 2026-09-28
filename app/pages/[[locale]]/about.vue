<script setup lang="ts">
definePageMeta({
  name: "About",
  path: "/:locale(en|ee|de)?/about",
  layout: "default",
});

const { t } = useI18n();
const { localePath } = useAppNavigation();

useHead(() => ({ title: t("aboutPage.pageTitle") }));

const collections = [
  { key: "minerals", icon: "i-lucide-gem" },
  { key: "rocks", icon: "i-lucide-mountain" },
  { key: "meteorites", icon: "i-lucide-orbit" },
  { key: "fossils", icon: "i-lucide-shell" },
];
</script>

<template>
  <article
    class="tw:mx-auto tw:w-full tw:max-w-6xl tw:min-w-0 tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12"
  >
    <header
      class="tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-[#edf1e9] tw:p-6 tw:sm:p-10 tw:lg:p-12"
    >
      <div
        class="tw:relative tw:z-10 tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]"
      >
        <div>
          <p
            class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/80 tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-[0.12em] tw:text-home-link tw:uppercase"
          >
            <span
              class="tw:size-2 tw:rounded-full tw:bg-geocase"
              aria-hidden="true"
            />
            {{ t("aboutPage.eyebrow") }}
          </p>
          <h1
            class="tw:max-w-2xl tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.06] tw:font-bold tw:tracking-[-0.045em]"
          >
            {{ t("aboutPage.heroTitle") }}
          </h1>
          <p
            class="tw:text-home-muted tw:mt-5 tw:max-w-xl tw:text-base tw:leading-7 tw:sm:text-lg tw:sm:leading-8"
          >
            {{ t("aboutPage.heroDescription") }}
          </p>
          <NuxtLink
            :to="localePath('/search')"
            class="tw:mt-7 tw:inline-flex tw:items-center tw:gap-3 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:no-underline tw:transition-colors tw:hover:bg-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-hero"
          >
            {{ t("aboutPage.explore") }}
            <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div
          class="tw:relative tw:mx-auto tw:grid tw:aspect-square tw:w-full tw:max-w-75 tw:place-items-center"
          aria-hidden="true"
        >
          <div
            class="tw:absolute tw:inset-3 tw:rounded-full tw:border tw:border-home-link/20"
          />
          <div
            class="tw:absolute tw:inset-10 tw:rounded-full tw:border tw:border-home-link/20"
          />
          <div class="tw:absolute tw:inset-17 tw:rounded-full tw:bg-white/65" />
          <div
            class="tw:relative tw:flex tw:size-30 tw:items-center tw:justify-center tw:rounded-full tw:bg-home-hero tw:text-home-accent tw:shadow-xl"
          >
            <UIcon name="i-lucide-earth" class="tw:size-15" />
          </div>
          <div
            class="tw:absolute tw:top-5 tw:right-8 tw:grid tw:size-12 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-mineral tw:shadow-md"
          >
            <UIcon name="i-lucide-gem" class="tw:size-6" />
          </div>
          <div
            class="tw:absolute tw:bottom-10 tw:left-2 tw:grid tw:size-12 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-fossil tw:shadow-md"
          >
            <UIcon name="i-lucide-shell" class="tw:size-6" />
          </div>
          <div
            class="tw:absolute tw:right-1 tw:bottom-12 tw:grid tw:size-12 tw:place-items-center tw:rounded-2xl tw:bg-white tw:text-rock tw:shadow-md"
          >
            <UIcon name="i-lucide-mountain" class="tw:size-6" />
          </div>
        </div>
      </div>
    </header>

    <section class="tw:py-10 tw:sm:py-12" aria-labelledby="collections-title">
      <p
        class="tw:text-home-muted tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase"
      >
        {{ t("aboutPage.collectionsEyebrow") }}
      </p>
      <h2
        id="collections-title"
        class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
      >
        {{ t("aboutPage.collectionsTitle") }}
      </h2>
      <p class="tw:text-home-muted tw:mt-3 tw:max-w-2xl tw:leading-7">
        {{ t("aboutPage.collectionsDescription") }}
      </p>
      <ul class="tw:mt-6 tw:grid tw:grid-cols-2 tw:gap-3 tw:sm:grid-cols-4">
        <li
          v-for="collection in collections"
          :key="collection.key"
          class="tw:flex tw:min-w-0 tw:flex-col tw:gap-4 tw:rounded-2xl tw:bg-home-surface tw:p-4 tw:sm:p-5"
        >
          <UIcon
            :name="collection.icon"
            class="tw:size-6 tw:text-home-link"
            aria-hidden="true"
          />
          <span class="tw:font-bold">{{
            t(`aboutPage.collections.${collection.key}`)
          }}</span>
        </li>
      </ul>
    </section>

    <section
      class="tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-9"
      aria-labelledby="network-title"
    >
      <div
        class="tw:grid tw:gap-7 tw:lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] tw:lg:gap-12"
      >
        <div>
          <p
            class="tw:text-home-muted tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase"
          >
            {{ t("aboutPage.networkEyebrow") }}
          </p>
          <h2
            id="network-title"
            class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
          >
            {{ t("aboutPage.networkTitle") }}
          </h2>
          <p class="tw:text-home-muted tw:mt-4 tw:leading-7">
            {{ t("aboutPage.networkDescription") }}
          </p>
        </div>
        <div class="tw:grid tw:gap-3">
          <div class="tw:rounded-2xl tw:bg-white tw:p-5">
            <h3
              class="tw:flex tw:items-center tw:gap-2 tw:text-base tw:font-bold"
            >
              <UIcon
                name="i-lucide-database"
                class="tw:text-home-link"
                aria-hidden="true"
              />
              {{ t("aboutPage.sharedTitle") }}
            </h3>
            <p class="tw:text-home-muted tw:mt-2 tw:leading-7">
              {{ t("aboutPage.sharedIntro") }}
              <a
                class="tw:text-home-link tw:font-bold tw:underline tw:underline-offset-4"
                href="https://www.biocase.org/products/provider_software/index.shtml"
                target="_blank"
                rel="noopener noreferrer"
                >BioCASe Provider Software</a
              >
              {{ t("aboutPage.sharedStandards") }}
              <a
                class="tw:text-home-link tw:font-bold tw:underline tw:underline-offset-4"
                href="https://www.tdwg.org/standards/abcd/"
                target="_blank"
                rel="noopener noreferrer"
                >ABCD</a
              >
              {{ t("aboutPage.and") }}
              <a
                class="tw:text-home-link tw:font-bold tw:underline tw:underline-offset-4"
                href="https://github.com/tdwg/efg"
                target="_blank"
                rel="noopener noreferrer"
                >ABCD-EFG</a
              >
              ({{ t("aboutPage.extensionNote") }}
              <a
                class="tw:text-home-link tw:font-bold tw:underline tw:underline-offset-4"
                href="https://doi.org/10.5194/fr-21-47-2018"
                target="_blank"
                rel="noopener noreferrer"
                >Petersen et al. 2018</a
              >).
            </p>
          </div>
          <div class="tw:rounded-2xl tw:bg-white tw:p-5">
            <h3
              class="tw:flex tw:items-center tw:gap-2 tw:text-base tw:font-bold"
            >
              <UIcon
                name="i-lucide-search"
                class="tw:text-home-link"
                aria-hidden="true"
              />
              {{ t("aboutPage.searchTitle") }}
            </h3>
            <p class="tw:text-home-muted tw:mt-2 tw:leading-7">
              {{ t("aboutPage.searchIntro") }}
              <a
                class="tw:text-home-link tw:font-bold tw:underline tw:underline-offset-4"
                href="https://gbif.org"
                target="_blank"
                rel="noopener noreferrer"
                >GBIF</a
              >{{ t("aboutPage.gbifDescription") }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="tw:py-10 tw:sm:py-12" aria-labelledby="history-title">
      <p
        class="tw:text-home-muted tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase"
      >
        {{ t("aboutPage.storyEyebrow") }}
      </p>
      <h2
        id="history-title"
        class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
      >
        {{ t("aboutPage.storyTitle") }}
      </h2>
      <div class="tw:mt-7 tw:grid tw:gap-4 tw:md:grid-cols-2">
        <div
          class="tw:rounded-2xl tw:border tw:border-home-border tw:p-5 tw:sm:p-6"
        >
          <span class="tw:text-home-link tw:text-sm tw:font-extrabold"
            >2007</span
          >
          <h3 class="tw:mt-2 tw:text-lg tw:font-bold">
            {{ t("aboutPage.firstTitle") }}
          </h3>
          <p class="tw:text-home-muted tw:mt-2 tw:leading-7">
            {{ t("aboutPage.firstDescription") }}
          </p>
        </div>
        <div
          class="tw:rounded-2xl tw:border tw:border-home-border tw:p-5 tw:sm:p-6"
        >
          <span class="tw:text-home-link tw:text-sm tw:font-extrabold"
            >2020</span
          >
          <h3 class="tw:mt-2 tw:text-lg tw:font-bold">
            {{ t("aboutPage.upgradeTitle") }}
          </h3>
          <p class="tw:text-home-muted tw:mt-2 tw:leading-7">
            {{ t("aboutPage.upgradeIntro") }}
            <a
              class="tw:text-home-link tw:font-bold tw:underline tw:underline-offset-4"
              href="https://cetaf.org/"
              target="_blank"
              rel="noopener noreferrer"
              >CETAF</a
            >
            {{ t("aboutPage.earthScienceGroup") }}
          </p>
        </div>
      </div>
      <p class="tw:text-home-muted tw:mt-6 tw:max-w-3xl tw:leading-7">
        {{ t("aboutPage.cetafDescription") }}
        <a
          class="tw:text-home-link tw:font-bold tw:underline tw:underline-offset-4"
          href="https://www.dissco.eu/"
          target="_blank"
          rel="noopener noreferrer"
          >{{ t("aboutPage.disscoName") }}</a
        >.
      </p>
    </section>

    <section
      class="tw:mb-4 tw:rounded-2xl tw:bg-home-surface tw:p-6 tw:sm:p-8"
      aria-labelledby="governance-title"
    >
      <div class="tw:flex tw:items-start tw:gap-4">
        <UIcon
          name="i-lucide-users-round"
          class="tw:mt-1 tw:size-6 tw:shrink-0 tw:text-home-link"
          aria-hidden="true"
        />
        <div>
          <h2
            id="governance-title"
            class="tw:text-xl tw:font-bold tw:tracking-tight"
          >
            {{ t("aboutPage.governanceTitle") }}
          </h2>
          <p class="tw:text-home-muted tw:mt-2 tw:leading-7">
            {{ t("aboutPage.governanceDescription") }}
          </p>
        </div>
      </div>
    </section>
  </article>
</template>
