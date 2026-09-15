<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useFrontpageStore } from "@/stores/frontpage";
import { useAppNavigation } from "@/composables/useAppNavigation";
import HoverCard from "@/components/front_page/HoverCard.vue";
import StatsCard from "@/components/front_page/StatsCard.vue";
import MapCard from "@/components/front_page/MapCard.vue";

definePageMeta({ name: "FrontPage", path: "/:locale(en|ee|de)?" });

const { t } = useI18n();
const frontpage = useFrontpageStore();
const { localePath } = useAppNavigation();
const stats = computed(() => frontpage.stats);
const cards = computed(() => Object.values(frontpage.getCards));

useHead(() => ({ title: t("frontPage.title") }));
</script>

<template>
  <div class="tw:bg-home-surface tw:text-home-ink">
    <UContainer class="tw:pb-18">
      <div
        class="tw:border-home-border tw:grid tw:grid-cols-3 tw:border-b tw:py-7 tw:max-[600px]:grid-cols-1 tw:max-[600px]:py-4"
      >
        <StatsCard
          v-for="item in stats"
          :id="item.id"
          :key="item.id"
          :text="item.text"
          :count="item.count"
        />
      </div>

      <section
        class="tw:mt-16 tw:max-[600px]:mt-10"
        aria-labelledby="collections-title"
      >
        <div
          class="tw:mb-7 tw:flex tw:items-end tw:justify-between tw:gap-6 tw:max-[600px]:items-start"
        >
          <div>
            <p
              class="tw:text-home-muted tw:mb-2.5 tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase"
            >
              {{ t("frontPage.collectionsEyebrow") }}
            </p>
            <h2
              id="collections-title"
              class="tw:text-[clamp(1.75rem,3vw,2.5rem)] tw:leading-tight tw:font-extrabold tw:tracking-[-0.035em]"
            >
              {{ t("frontPage.collectionsTitle") }}
            </h2>
          </div>
          <NuxtLink
            :to="localePath('/search')"
            class="tw:text-home-link tw:flex tw:shrink-0 tw:items-center tw:gap-2 tw:font-bold tw:no-underline tw:hover:underline"
          >
            {{ t("frontPage.browseAll") }}
            <UIcon name="i-lucide-arrow-right" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div
          class="tw:grid tw:grid-cols-4 tw:gap-5 tw:max-[960px]:grid-cols-2 tw:max-[600px]:grid-cols-1"
        >
          <HoverCard v-for="card in cards" :key="card.title" :card="card" />
        </div>
      </section>

      <section
        class="tw:mt-16 tw:max-[600px]:mt-10"
        aria-labelledby="map-title"
      >
        <div
          class="tw:mb-7 tw:flex tw:items-end tw:justify-between tw:gap-6 tw:max-[600px]:flex-col tw:max-[600px]:items-start"
        >
          <div>
            <p
              class="tw:text-home-muted tw:mb-2.5 tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:uppercase"
            >
              {{ t("frontPage.mapEyebrow") }}
            </p>
            <h2
              id="map-title"
              class="tw:text-[clamp(1.75rem,3vw,2.5rem)] tw:leading-tight tw:font-extrabold tw:tracking-[-0.035em]"
            >
              {{ t("frontPage.mapTitle") }}
            </h2>
          </div>
          <p class="tw:text-home-muted tw:max-w-sm tw:leading-relaxed">
            {{ t("frontPage.mapDescription") }}
          </p>
        </div>
        <div
          class="tw:border-home-border tw:h-125 tw:overflow-hidden tw:rounded-2xl tw:border tw:bg-white tw:max-[600px]:h-95"
        >
          <MapCard />
        </div>
      </section>
    </UContainer>
  </div>
</template>
