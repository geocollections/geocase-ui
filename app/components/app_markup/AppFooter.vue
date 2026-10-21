<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";

const { t } = useI18n();
const { localePath } = useAppNavigation();
const year = new Date().getFullYear();

const linkGroups = computed(() => [
  {
    title: t("footer.explore"),
    links: [
      { label: t("header.search"), path: "/search" },
      { label: t("datasetsPage.title"), path: "/dataset" },
      { label: t("header.partners"), path: "/institution" },
    ],
  },
  {
    title: t("footer.about"),
    links: [
      { label: t("header.about"), path: "/about" },
      { label: t("header.access"), path: "/access" },
      { label: t("header.tutorial"), path: "/tutorial" },
      { label: t("header.help"), path: "/help" },
      { label: t("header.efg"), path: "/efg" },
    ],
  },
]);

const resources = [
  {
    label: "CETAF",
    href: "https://cetaf.org/",
    icon: "i-lucide-arrow-up-right",
  },
  {
    label: "DiSSCo",
    href: "https://www.dissco.eu/",
    icon: "i-lucide-arrow-up-right",
  },
  {
    label: "GeoCASe API",
    href: "https://api.geocase.eu/",
    icon: "i-lucide-arrow-up-right",
  },
  {
    label: "GitHub",
    href: "https://github.com/geocollections/geocase-ui",
    icon: "i-lucide-github",
  },
];

const logos = [
  {
    href: "https://cetaf.org/",
    alt: "footer.cetafLogoAltText",
    image: "cetaf_logo.png",
  },
  {
    href: "https://taltech.ee/en/department-geology",
    alt: "footer.taltechLogoAltText",
    image: "taltech1.png",
  },
  {
    href: "https://www.museumfuernaturkunde.berlin/",
    alt: "footer.mfnLogoAltText",
    image: "mfn1.png",
  },
];
</script>

<template>
  <footer
    class="tw:relative tw:overflow-hidden tw:bg-home-hero tw:text-home-hero-muted"
  >
    <div
      class="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:top-0 tw:h-px tw:bg-gradient-to-r tw:from-transparent tw:via-home-accent/70 tw:to-transparent"
      aria-hidden="true"
    />

    <div
      class="tw:mx-auto tw:max-w-7xl tw:px-4 tw:pt-6 tw:pb-5 tw:sm:px-6 tw:md:pt-14 tw:md:pb-8 tw:lg:px-8"
    >
      <section
        class="tw:relative tw:hidden tw:overflow-hidden tw:rounded-3xl tw:md:block tw:border tw:border-white/10 tw:bg-[radial-gradient(ellipse_at_85%_0%,rgb(198_148_216/0.18),transparent_42%),linear-gradient(125deg,#203c34,#182c29_72%)] tw:px-6 tw:py-7 tw:shadow-[0_24px_60px_rgb(0_0_0/0.18)] tw:sm:px-9 tw:sm:py-8"
        :aria-label="t('footer.explore')"
      >
        <div
          class="tw:relative tw:flex tw:flex-col tw:items-start tw:justify-between tw:gap-6 tw:md:flex-row tw:md:items-center"
        >
          <div class="tw:max-w-2xl">
            <p
              class="tw:mb-2 tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-accent tw:uppercase"
            >
              {{ t("frontPage.heroEyebrow") }}
            </p>
            <h2
              class="tw:text-2xl tw:font-bold tw:leading-tight tw:tracking-[-0.03em] tw:text-white tw:sm:text-3xl"
            >
              {{ t("footer.ctaTitle") }}
            </h2>
            <p
              class="tw:mt-2 tw:max-w-xl tw:text-sm tw:leading-relaxed tw:text-home-hero-muted tw:sm:text-base"
            >
              {{ t("footer.ctaDescription") }}
            </p>
          </div>
          <div class="tw:flex tw:flex-wrap tw:gap-3">
            <NuxtLink
              :to="localePath('/search')"
              class="tw:inline-flex tw:min-h-11 tw:items-center tw:gap-2 tw:rounded-xl tw:bg-home-accent tw:px-4 tw:py-2.5 tw:text-sm tw:font-extrabold tw:text-home-hero tw:no-underline tw:transition-colors tw:hover:bg-[#d6b4e5] tw:focus-visible:outline-2 tw:focus-visible:outline-white tw:focus-visible:outline-offset-3"
            >
              {{ t("footer.browseCollections") }}
              <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
            </NuxtLink>
            <NuxtLink
              :to="localePath('/dataset')"
              class="tw:inline-flex tw:min-h-11 tw:items-center tw:rounded-xl tw:border tw:border-white/20 tw:px-4 tw:py-2.5 tw:text-sm tw:font-bold tw:text-white tw:no-underline tw:transition-colors tw:hover:border-white/50 tw:hover:bg-white/8 tw:focus-visible:outline-2 tw:focus-visible:outline-home-accent tw:focus-visible:outline-offset-3"
            >
              {{ t("datasetsPage.title") }}
            </NuxtLink>
          </div>
        </div>
      </section>

      <div class="tw:md:hidden">
        <NuxtLink
          :to="localePath('/')"
          aria-label="GeoCASe"
          class="tw:inline-flex tw:min-h-11 tw:items-center tw:rounded-lg tw:font-serif tw:text-3xl tw:font-bold tw:tracking-[-0.055em] tw:no-underline tw:focus-visible:outline-home-accent"
        >
          <span class="tw:text-home-accent">Geo</span
          ><span class="tw:text-white">CASe</span>
        </NuxtLink>
        <p class="tw:mt-1 tw:text-base tw:leading-6 tw:text-home-hero-muted">
          {{ t("footer.title") }}
        </p>
        <nav
          :aria-label="t('a11y.siteNavigation')"
          class="tw:mt-5 tw:border-t tw:border-white/15"
        >
          <details
            v-for="group in linkGroups"
            :key="group.title"
            class="tw:group tw:border-b tw:border-white/15"
          >
            <summary
              class="tw:flex tw:min-h-13 tw:cursor-pointer tw:list-none tw:items-center tw:justify-between tw:gap-3 tw:py-3 tw:text-base tw:font-bold tw:text-white tw:marker:hidden tw:focus-visible:outline-home-accent"
            >
              {{ group.title }}
              <UIcon
                name="i-lucide-chevron-down"
                class="tw:size-5 tw:shrink-0 tw:transition-transform tw:group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <ul class="tw:m-0 tw:list-none tw:pb-3 tw:pl-3">
              <li v-for="link in group.links" :key="link.path">
                <NuxtLink
                  :to="localePath(link.path)"
                  class="tw:flex tw:min-h-11 tw:items-center tw:rounded-lg tw:px-2 tw:py-2 tw:text-base tw:leading-6 tw:text-home-hero-muted tw:no-underline tw:hover:text-home-accent tw:focus-visible:outline-home-accent"
                  >{{ link.label }}</NuxtLink
                >
              </li>
            </ul>
          </details>
          <details class="tw:group tw:border-b tw:border-white/15">
            <summary
              class="tw:flex tw:min-h-13 tw:cursor-pointer tw:list-none tw:items-center tw:justify-between tw:gap-3 tw:py-3 tw:text-base tw:font-bold tw:text-white tw:marker:hidden tw:focus-visible:outline-home-accent"
            >
              {{ t("footer.resources") }}
              <UIcon
                name="i-lucide-chevron-down"
                class="tw:size-5 tw:shrink-0 tw:transition-transform tw:group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <ul class="tw:m-0 tw:list-none tw:pb-3 tw:pl-3">
              <li v-for="resource in resources" :key="resource.href">
                <a
                  :href="resource.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="tw:flex tw:min-h-11 tw:items-center tw:gap-2 tw:rounded-lg tw:px-2 tw:py-2 tw:text-base tw:leading-6 tw:text-home-hero-muted tw:no-underline tw:hover:text-home-accent tw:focus-visible:outline-home-accent"
                  >{{ resource.label
                  }}<UIcon
                    :name="resource.icon"
                    class="tw:size-4"
                    aria-hidden="true"
                /></a>
              </li>
            </ul>
          </details>
        </nav>
      </div>

      <div
        class="tw:hidden tw:gap-10 tw:py-12 tw:md:grid tw:md:grid-cols-2 tw:lg:grid-cols-[1.45fr_0.8fr_0.9fr_0.8fr] tw:lg:gap-12 tw:lg:py-14"
      >
        <div class="tw:max-w-sm">
          <NuxtLink
            :to="localePath('/')"
            class="tw:inline-flex tw:items-center tw:rounded-lg tw:text-white tw:no-underline tw:focus-visible:outline-2 tw:focus-visible:outline-home-accent tw:focus-visible:outline-offset-4"
          >
            <span
              class="tw:font-serif tw:text-[1.55rem] tw:font-bold tw:tracking-[-0.055em]"
            >
              <span class="tw:text-home-accent">Geo</span>
              <span class="tw:text-white">CASe</span>
            </span>
          </NuxtLink>
          <p
            class="tw:mt-4 tw:text-sm tw:leading-relaxed tw:text-home-hero-muted"
          >
            {{ t("footer.title") }}
          </p>
          <p
            class="tw:mt-3 tw:text-sm tw:leading-relaxed tw:text-home-hero-muted/80"
            v-html="t('footer.collab_html')"
          />
        </div>

        <nav
          v-for="group in linkGroups"
          :key="group.title"
          :aria-label="group.title"
        >
          <h2
            class="tw:mb-4 tw:text-xs tw:font-extrabold tw:tracking-[0.15em] tw:text-home-accent tw:uppercase"
          >
            {{ group.title }}
          </h2>
          <ul class="tw:m-0 tw:grid tw:list-none tw:gap-3 tw:p-0">
            <li v-for="link in group.links" :key="link.path">
              <NuxtLink
                :to="localePath(link.path)"
                class="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-home-hero-muted tw:no-underline tw:transition-colors tw:hover:text-home-accent tw:focus-visible:rounded-sm tw:focus-visible:outline-2 tw:focus-visible:outline-home-accent tw:focus-visible:outline-offset-4"
              >
                {{ link.label }}
                <UIcon
                  v-if="link.path === '/search'"
                  name="i-lucide-arrow-up-right"
                  class="tw:size-3.5 tw:opacity-60"
                  aria-hidden="true"
                />
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav :aria-label="t('footer.resources')">
          <h2
            class="tw:mb-4 tw:text-xs tw:font-extrabold tw:tracking-[0.15em] tw:text-home-accent tw:uppercase"
          >
            {{ t("footer.resources") }}
          </h2>
          <ul class="tw:m-0 tw:grid tw:list-none tw:gap-3 tw:p-0">
            <li v-for="resource in resources" :key="resource.href">
              <a
                :href="resource.href"
                target="_blank"
                rel="noopener noreferrer"
                class="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-home-hero-muted tw:no-underline tw:transition-colors tw:hover:text-home-accent tw:focus-visible:rounded-sm tw:focus-visible:outline-2 tw:focus-visible:outline-home-accent tw:focus-visible:outline-offset-4"
              >
                {{ resource.label }}
                <UIcon
                  :name="resource.icon"
                  class="tw:size-3.5 tw:opacity-65"
                  aria-hidden="true"
                />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <section
        class="tw:flex tw:flex-col tw:gap-3 tw:border-t tw:border-white/12 tw:py-4 tw:md:gap-5 tw:md:py-7 tw:lg:flex-row tw:lg:items-center tw:lg:justify-between"
        :aria-label="t('footer.partners')"
      >
        <div>
          <h2
            class="tw:text-base tw:font-bold tw:text-home-accent tw:md:text-xs tw:md:font-extrabold tw:md:tracking-[0.15em] tw:md:uppercase"
          >
            {{ t("footer.partners") }}
          </h2>
          <p
            class="tw:mt-1.5 tw:hidden tw:text-sm tw:text-home-hero-muted/80 tw:md:block"
          >
            {{ t("footer.dataBy") }}
            <NuxtLink
              :to="localePath('/institution')"
              class="tw:font-bold tw:text-white tw:underline tw:decoration-white/35 tw:underline-offset-4 tw:hover:text-home-accent tw:focus-visible:outline-2 tw:focus-visible:outline-home-accent"
            >
              {{ t("footer.partnerInstitutions") }}
            </NuxtLink>
          </p>
        </div>
        <div
          class="tw:grid tw:grid-cols-2 tw:items-center tw:gap-x-5 tw:gap-y-2 tw:md:grid-cols-3 tw:md:gap-x-7"
        >
          <a
            v-for="(logo, index) in logos"
            :key="logo.image"
            :class="
              index === logos.length - 1
                ? 'tw:col-span-2 tw:w-1/2 tw:justify-self-center tw:md:col-span-1 tw:md:w-auto tw:md:justify-self-auto'
                : undefined
            "
            :href="logo.href"
            target="_blank"
            rel="noopener noreferrer"
            class="tw:flex tw:min-h-16 tw:items-center tw:justify-center tw:rounded-md tw:opacity-80 tw:transition-opacity tw:hover:opacity-100 tw:focus-visible:outline-2 tw:focus-visible:outline-home-accent tw:focus-visible:outline-offset-3"
          >
            <img
              :src="`https://geocase.eu/thumbnails/${logo.image}`"
              :alt="t(logo.alt)"
              width="175"
              height="90"
              loading="lazy"
              class="tw:h-16 tw:w-full tw:max-w-40 tw:object-contain tw:md:max-w-44 tw:lg:h-20 tw:lg:max-w-48"
            />
          </a>
        </div>
      </section>

      <div
        class="tw:flex tw:flex-col tw:gap-2 tw:border-t tw:border-white/12 tw:pt-4 tw:pb-1 tw:text-sm tw:leading-6 tw:text-home-hero-muted/90 tw:md:pt-5 tw:md:pb-2 tw:md:text-xs tw:md:leading-relaxed tw:md:text-home-hero-muted/75 tw:md:flex-row tw:md:items-center tw:md:justify-between"
      >
        <p>© {{ year }} GeoCASe. {{ t("footer.rights") }}</p>
        <p
          class="tw:max-w-2xl tw:md:text-right"
          v-html="t('footer.created_html')"
        />
      </div>
    </div>
  </footer>
</template>
