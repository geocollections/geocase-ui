<script setup lang="ts">
import AppLogo from "@/components/AppLogo.vue";
import { computed } from "vue";
import type { NuxtError } from "#app";
import { clearError, useRequestURL, reloadNuxtApp } from "#imports";
import { en, et, de } from "@nuxt/ui/locale";
import i18n from "@/i18n";

const props = defineProps<{ error: NuxtError }>();
// Keep the current error stable while clearError restores the application.
const initialError = props.error;
const statusCode = Number(
  initialError.status || initialError.statusCode || 500,
);
const notFound = statusCode === 404;
const pathname = useRequestURL().pathname;
type Language = "en" | "ee" | "de";
const language = computed<Language>(() => {
  const prefix = pathname.match(/^\/(en|ee|de)(?:\/|$)/)?.[1];
  return prefix ? (prefix as Language) : i18n.locale.value;
});
const uiLocale = computed(() =>
  language.value === "ee" ? et : language.value === "de" ? de : en,
);
const t = (key: string) =>
  i18n.t(`errorPage.${key}`, {}, { locale: language.value });
const localePath = (path: string) =>
  language.value === "en"
    ? path
    : `/${language.value}${path === "/" ? "" : path}`;
const recover = (path: string) => clearError({ redirect: localePath(path) });
const destinations = [
  {
    path: "/search",
    icon: "i-lucide-search",
    title: "searchTitle",
    description: "searchDescription",
  },
  {
    path: "/institution",
    icon: "i-lucide-landmark",
    title: "institutionsTitle",
    description: "institutionsDescription",
  },
  {
    path: "/help",
    icon: "i-lucide-circle-help",
    title: "helpTitle",
    description: "helpDescription",
  },
];
function skipToContent() {
  document.getElementById("main-content")?.focus();
}
useHead(() => ({
  title: `${t(notFound ? "notFoundTitle" : "errorTitle")} | GeoCASe`,
  htmlAttrs: { lang: language.value === "ee" ? "et" : language.value },
  meta: [{ name: "robots", content: "noindex, nofollow" }],
}));
</script>

<template>
  <UApp :locale="uiLocale">
    <div
      class="tw:flex tw:min-h-dvh tw:flex-col tw:bg-home-surface tw:font-[Nunito,sans-serif] tw:text-home-ink"
    >
      <a
        href="#main-content"
        class="skip-link"
        @click.prevent="skipToContent"
        >{{ t("skipToContent") }}</a
      >
      <header
        class="tw:border-b tw:border-home-accent/20 tw:bg-home-hero tw:text-white"
      >
        <div
          class="tw:mx-auto tw:flex tw:min-h-18 tw:max-w-6xl tw:flex-wrap tw:items-center tw:justify-between tw:gap-4 tw:px-5 tw:py-3 tw:sm:px-8"
        >
          <a
            :href="localePath('/')"
            aria-label="GeoCASe"
            class="tw:rounded-lg tw:font-serif tw:text-[1.75rem] tw:font-bold tw:tracking-[-0.055em] tw:no-underline tw:focus-visible:outline-home-accent"
            @click.prevent="recover('/')"
          >
            <AppLogo />
          </a>
          <nav
            :aria-label="t('navigation')"
            class="tw:flex tw:items-center tw:gap-1 tw:text-sm tw:font-bold"
          >
            <a
              :href="localePath('/')"
              class="tw:inline-flex tw:min-h-11 tw:items-center tw:rounded-xl tw:px-3 tw:text-home-hero-muted tw:no-underline tw:hover:bg-white/10 tw:hover:text-white tw:focus-visible:outline-home-accent"
              @click.prevent="recover('/')"
              >{{ t("home") }}</a
            >
            <a
              :href="localePath('/search')"
              class="tw:inline-flex tw:min-h-11 tw:items-center tw:gap-2 tw:rounded-xl tw:bg-home-accent/15 tw:px-3 tw:text-home-accent tw:no-underline tw:hover:bg-home-accent/25 tw:focus-visible:outline-home-accent"
              @click.prevent="recover('/search')"
              ><UIcon name="i-lucide-search" aria-hidden="true" />{{
                t("search")
              }}</a
            >
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        tabindex="-1"
        class="tw:mx-auto tw:w-full tw:max-w-6xl tw:flex-1 tw:px-5 tw:py-10 tw:sm:px-8 tw:sm:py-16"
      >
        <section
          class="tw:grid tw:items-center tw:gap-10 tw:lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] tw:lg:gap-16"
        >
          <div>
            <p
              class="tw:mb-5 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-home-border tw:bg-white tw:px-3 tw:py-1.5 tw:text-xs tw:font-extrabold tw:tracking-widest tw:text-home-muted tw:uppercase"
            >
              <span
                class="tw:size-2 tw:rounded-full tw:bg-geocase"
                aria-hidden="true"
              />{{ t("error") }} {{ statusCode }}
            </p>
            <h1
              class="tw:max-w-xl tw:text-[clamp(2.25rem,5vw,4rem)] tw:leading-[1.08] tw:font-bold tw:tracking-[-0.045em] tw:wrap-anywhere"
            >
              {{ t(notFound ? "notFoundTitle" : "errorTitle") }}
            </h1>
            <p
              class="tw:mt-5 tw:max-w-lg tw:text-base tw:leading-7 tw:text-home-muted tw:sm:text-lg tw:sm:leading-8"
            >
              {{ t(notFound ? "notFoundDescription" : "errorDescription") }}
            </p>
            <div class="tw:mt-8 tw:flex tw:flex-wrap tw:gap-3">
              <button
                v-if="!notFound"
                type="button"
                class="tw:inline-flex tw:min-h-12 tw:items-center tw:gap-2 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:hover:bg-home-link"
                @click="reloadNuxtApp({ force: true })"
              >
                <UIcon name="i-lucide-rotate-ccw" aria-hidden="true" />{{
                  t("retry")
                }}
              </button>
              <a
                :href="localePath('/search')"
                class="tw:inline-flex tw:min-h-12 tw:items-center tw:gap-2 tw:rounded-xl tw:bg-home-hero tw:px-5 tw:py-3 tw:font-bold tw:text-white tw:no-underline tw:hover:bg-home-link"
                @click.prevent="recover('/search')"
                ><UIcon name="i-lucide-search" aria-hidden="true" />{{
                  t("search")
                }}</a
              >
              <a
                :href="localePath('/')"
                class="tw:inline-flex tw:min-h-12 tw:items-center tw:gap-2 tw:rounded-xl tw:border tw:border-home-border tw:bg-white tw:px-5 tw:py-3 tw:font-bold tw:text-home-link tw:no-underline tw:hover:bg-home-hover"
                @click.prevent="recover('/')"
                ><UIcon name="i-lucide-house" aria-hidden="true" />{{
                  t("backHome")
                }}</a
              >
            </div>
          </div>
          <div
            class="tw:relative tw:mx-auto tw:grid tw:aspect-square tw:w-full tw:max-w-80 tw:place-items-center tw:overflow-hidden tw:rounded-[2.5rem] tw:bg-home-banner tw:sm:max-w-96"
            aria-hidden="true"
          >
            <div
              class="tw:absolute tw:size-[85%] tw:rotate-[-20deg] tw:rounded-[42%] tw:border tw:border-home-link/15"
            />
            <div
              class="tw:absolute tw:size-[65%] tw:rotate-[15deg] tw:rounded-[45%] tw:border tw:border-home-link/20"
            />
            <div
              class="tw:absolute tw:size-[45%] tw:rounded-full tw:bg-white/50"
            />
            <div
              class="tw:relative tw:flex tw:flex-col tw:items-center tw:gap-2"
            >
              <UIcon
                :name="notFound ? 'i-lucide-compass' : 'i-lucide-unplug'"
                class="tw:size-12 tw:text-home-link"
              />
              <span
                class="tw:font-serif tw:text-[clamp(5.5rem,16vw,9rem)] tw:leading-none tw:font-bold tw:tracking-[-0.07em] tw:text-home-ink"
                >{{ statusCode }}</span
              >
            </div>
            <span
              class="tw:absolute tw:top-8 tw:right-10 tw:size-3 tw:rounded-full tw:bg-home-accent"
            />
            <span
              class="tw:absolute tw:bottom-10 tw:left-10 tw:size-2 tw:rounded-full tw:bg-home-link/40"
            />
          </div>
        </section>

        <section
          class="tw:mt-12 tw:border-t tw:border-home-border tw:pt-8 tw:sm:mt-16"
          :aria-label="t('continueExploring')"
        >
          <h2 class="tw:mb-5 tw:text-lg tw:font-bold">
            {{ t("continueExploring") }}
          </h2>
          <div class="tw:grid tw:gap-3 tw:sm:grid-cols-3">
            <a
              v-for="destination in destinations"
              :key="destination.path"
              :href="localePath(destination.path)"
              class="tw:group tw:flex tw:items-start tw:gap-3 tw:rounded-2xl tw:border tw:border-home-border tw:bg-white tw:p-5 tw:text-home-ink tw:no-underline tw:transition-colors tw:hover:border-home-link/30 tw:hover:bg-home-hover"
              @click.prevent="recover(destination.path)"
            >
              <UIcon
                :name="destination.icon"
                class="tw:mt-0.5 tw:size-5 tw:shrink-0 tw:text-home-link"
                aria-hidden="true"
              />
              <div class="tw:min-w-0">
                <h3 class="tw:font-bold">{{ t(destination.title) }}</h3>
                <p class="tw:mt-1 tw:text-sm tw:leading-6 tw:text-home-muted">
                  {{ t(destination.description) }}
                </p>
              </div>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="tw:ml-auto tw:mt-0.5 tw:size-4 tw:shrink-0 tw:text-home-muted"
                aria-hidden="true"
              />
            </a>
          </div>
        </section>
      </main>
      <footer
        class="tw:border-t tw:border-home-border tw:px-5 tw:py-5 tw:text-center tw:text-sm tw:text-home-muted"
      >
        GeoCASe · {{ t("footer") }}
      </footer>
    </div>
  </UApp>
</template>
