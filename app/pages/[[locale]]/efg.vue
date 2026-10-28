<script setup lang="ts">
definePageMeta({
  name: "Efg",
  path: "/:locale(en|ee|de)?/efg",
  layout: "default",
});

const { t } = useI18n();
useHead(() => ({ title: t("efgPage.pageTitle") }));
</script>

<template>
  <article
    class="tw:mx-auto tw:w-full tw:max-w-6xl tw:min-w-0 tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12"
  >
    <header
      class="tw:relative tw:overflow-hidden tw:rounded-3xl tw:bg-home-banner tw:p-6 tw:sm:p-10 tw:lg:p-12"
    >
      <img
        src="https://files.geocollections.info/img/geocase/front_page/geocase_landing2.jpg"
        alt=""
        aria-hidden="true"
        class="tw:absolute tw:inset-0 tw:size-full tw:object-cover"
      />
      <div
        class="tw:absolute tw:inset-0 tw:bg-linear-to-r tw:from-home-banner/95 tw:via-home-banner/80 tw:to-home-banner/45"
        aria-hidden="true"
      />
      <div
        class="tw:relative tw:z-10 tw:grid tw:items-center tw:gap-8 tw:lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]"
      >
        <div>
          <p
            class="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white/80 tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-[0.12em] tw:text-home-link tw:uppercase"
          >
            <span
              class="tw:size-2 tw:rounded-full tw:bg-geocase"
              aria-hidden="true"
            />
            {{ t("efgPage.eyebrow") }}
          </p>
          <h1
            class="tw:max-w-2xl tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.06] tw:font-bold tw:tracking-[-0.045em]"
          >
            {{ t("efgPage.heroTitle") }}
          </h1>
          <p
            class="tw:mt-5 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8"
          >
            {{ t("efgPage.heroDescription") }}
          </p>
          <div class="tw:mt-7 tw:flex tw:flex-wrap tw:gap-3">
            <a
              href="https://efg.geocase.eu/documentation/html/efg.html"
              target="_blank"
              rel="noopener noreferrer"
              class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:no-underline tw:transition-colors tw:hover:bg-home-link tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-hero"
            >
              {{ t("efgPage.documentationLink") }}
              <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/tdwg/efg"
              target="_blank"
              rel="noopener noreferrer"
              class="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-xl tw:bg-white/85 tw:px-5 tw:py-3 tw:font-bold tw:text-home-link tw:no-underline tw:transition-colors tw:hover:bg-white tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-home-hero"
            >
              {{ t("efgPage.githubLink") }}
              <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div
          class="tw:relative tw:mx-auto tw:grid tw:aspect-square tw:w-full tw:max-w-65 tw:place-items-center"
          aria-hidden="true"
        >
        </div>
      </div>
    </header>

    <section class="tw:py-10 tw:sm:py-12" aria-labelledby="standard-title">
      <p
        class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-muted tw:uppercase"
      >
        {{ t("efgPage.standardEyebrow") }}
      </p>
      <h2
        id="standard-title"
        class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
      >
        {{ t("efgPage.standardTitle") }}
      </h2>
      <p class="tw:mt-3 tw:max-w-3xl tw:leading-7 tw:text-home-muted">
        {{ t("efgPage.standardDescription") }}
      </p>
      <div class="tw:mt-7 tw:grid tw:gap-4 tw:md:grid-cols-2">
        <section
          class="tw:rounded-2xl tw:bg-home-surface tw:p-5 tw:sm:p-7"
          aria-labelledby="schema-title"
        >
          <div
            class="tw:mb-4 tw:grid tw:size-11 tw:place-items-center tw:rounded-xl tw:bg-white tw:text-home-link"
          >
            <UIcon name="i-lucide-file-code-2" class="tw:size-5" />
          </div>
          <h3 id="schema-title" class="tw:text-lg tw:font-bold">
            {{ t("efgPage.schemaTitle") }}
          </h3>
          <p class="tw:mt-2 tw:leading-7 tw:text-home-muted">
            {{ t("efgPage.schemaDescription") }}
          </p>
          <a
            href="https://www.tdwg.org/standards/abcd/"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:mt-4 tw:inline-flex tw:items-center tw:gap-2 tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
          >
            {{ t("efgPage.abcdLink") }}
            <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
          </a>
        </section>
        <section
          class="tw:rounded-2xl tw:bg-home-surface tw:p-5 tw:sm:p-7"
          aria-labelledby="provider-title"
        >
          <div
            class="tw:mb-4 tw:grid tw:size-11 tw:place-items-center tw:rounded-xl tw:bg-white tw:text-home-link"
          >
            <UIcon name="i-lucide-database-zap" class="tw:size-5" />
          </div>
          <h3 id="provider-title" class="tw:text-lg tw:font-bold">
            {{ t("efgPage.providerTitle") }}
          </h3>
          <p class="tw:mt-2 tw:leading-7 tw:text-home-muted">
            {{ t("efgPage.providerDescription") }}
          </p>
          <a
            href="https://www.biocase.org/products/provider_software/"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:mt-4 tw:inline-flex tw:items-center tw:gap-2 tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
          >
            {{ t("efgPage.providerLink") }}
            <UIcon name="i-lucide-arrow-up-right" aria-hidden="true" />
          </a>
        </section>
      </div>
    </section>

    <section
      class="tw:rounded-3xl tw:bg-home-surface tw:p-6 tw:sm:p-9"
      aria-labelledby="community-title"
    >
      <div class="tw:grid tw:gap-7 tw:lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] tw:lg:gap-12">
        <div>
          <p
            class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-muted tw:uppercase"
          >
            {{ t("efgPage.communityEyebrow") }}
          </p>
          <h2
            id="community-title"
            class="tw:mt-2 tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
          >
            {{ t("efgPage.communityTitle") }}
          </h2>
          <p class="tw:mt-4 tw:leading-7 tw:text-home-muted">
            {{ t("efgPage.communityDescription") }}
          </p>
        </div>
        <div class="tw:rounded-2xl tw:bg-white tw:p-5 tw:sm:p-6">
          <h3 class="tw:flex tw:items-center tw:gap-2 tw:text-base tw:font-bold">
            <UIcon
              name="i-lucide-book-open-check"
              class="tw:text-home-link"
              aria-hidden="true"
            />
            {{ t("efgPage.resourcesTitle") }}
          </h3>
          <ul class="tw:mt-4 tw:space-y-3 tw:pl-5 tw:leading-7 tw:text-home-muted">
            <li>
              <a
                class="tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
                href="https://www.tdwg.org/standards/abcd/"
                target="_blank"
                rel="noopener noreferrer"
                >{{ t("efgPage.abcdLink") }}</a
              >
            </li>
            <li>
              <a
                class="tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
                href="https://doi.org/10.5194/fr-21-47-2018"
                target="_blank"
                rel="noopener noreferrer"
                >{{ t("efgPage.paperLink") }}</a
              >
            </li>
            <li>
              <a
                class="tw:font-bold tw:text-home-link tw:underline tw:underline-offset-4"
                href="https://www.foss-rec.net/21/47/2018/fr-21-47-2018.pdf"
                target="_blank"
                rel="noopener noreferrer"
                >{{ t("efgPage.paperPdfLink") }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </section>
  </article>
</template>
