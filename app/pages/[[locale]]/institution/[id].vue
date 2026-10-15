<script setup lang="ts">
import { useAsyncData } from "#imports";
import { $fetch } from "ofetch";
import { useI18n } from "vue-i18n";
import InstitutionCollectionMap from "@/components/InstitutionCollectionMap.vue";
import { institutionProfiles } from "@/institutionProfiles";
import { institutions } from "@/institutions";

definePageMeta({
  name: "Institution detail",
  path: "/:locale(en|ee|de)?/institution/:id",
  layout: "default",
  validate: (route) => institutions.some((item) => item.id === route.params.id),
});

type CollectionImage = {
  id: string;
  url: string;
  previewUrl: string;
  fallbackUrl?: string;
  title: string;
  locality?: string;
  author?: string;
  license?: string;
};
type Collection = {
  points: { latitude: number; longitude: number; count: number }[];
  countries: { country: string; count: number }[];
  images: CollectionImage[];
  total: number;
  locationsUnavailable?: boolean;
  imagesUnavailable?: boolean;
};
const route = useRoute();
const { t } = useI18n();
const { localePath } = useAppNavigation();
const institution = computed(() =>
  institutions.find((item) => item.id === route.params.id),
);
const profile = computed(() => institutionProfiles[String(route.params.id)]);
const {
  data: collection,
  status,
  error,
  refresh,
} = useAsyncData(
  () => `institution-collection-${route.params.id}`,
  () =>
    $fetch<Collection>(
      `/api/institution/${encodeURIComponent(String(route.params.id))}`,
    ).then((data) => {
      if (
        !data ||
        !Array.isArray(data.points) ||
        !Array.isArray(data.images) ||
        typeof data.total !== "number"
      )
        throw new Error("Invalid institution collection response");
      return data;
    }),
  { lazy: true },
);
const collectionPoints = computed(() => collection.value?.points ?? []);
const failedImages = ref<string[]>([]);
const galleryImages = computed(() =>
  (collection.value?.images ?? []).filter(
    (image) => !failedImages.value.includes(image.id),
  ),
);
const searchLink = computed(() => ({
  path: localePath("/search"),
  query: { datasetowner: `"${profile.value?.datasetOwner}"` },
}));
function imageError(event: Event, image: { id: string; fallbackUrl?: string }) {
  const target = event.target as HTMLImageElement;
  if (image.fallbackUrl && target.dataset.fallback !== "true") {
    target.dataset.fallback = "true";
    target.src = image.fallbackUrl;
  } else failedImages.value.push(image.id);
}
watch(collection, () => {
  failedImages.value = [];
});
useHead(() => ({
  title: institution.value?.name ?? t("partnersPage.pageTitle"),
}));
</script>

<template>
  <article
    v-if="institution"
    class="tw:mx-auto tw:w-full tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12"
  >
    <NuxtLink
      :to="localePath('/institution')"
      class="tw:inline-flex tw:items-center tw:gap-2 tw:font-semibold tw:text-home-link"
    >
      <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
      {{ t("partnersPage.backToInstitutions") }}
    </NuxtLink>

    <header
      class="tw:mt-8 tw:rounded-3xl tw:bg-home-banner tw:p-6 tw:sm:p-10 tw:lg:p-12"
    >
      <p
        class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-link tw:uppercase"
      >
        {{ t("partnersPage.institutionsTitle") }}
      </p>
      <h1
        class="tw:mt-4 tw:max-w-4xl tw:text-[clamp(2.4rem,5vw,4.5rem)] tw:leading-[1.08] tw:font-bold tw:tracking-[-0.04em]"
      >
        {{ institution.name }}
      </h1>
      <p class="tw:mt-5 tw:text-lg tw:text-home-muted">
        {{ t(`partnersPage.countries.${institution.countryKey}`) }}
      </p>
      <div class="tw:mt-7 tw:flex tw:flex-wrap tw:gap-3">
        <UButton
          v-if="profile?.datasetOwner"
          :to="searchLink"
          icon="i-lucide-search"
          class="tw:bg-home-link tw:text-white"
          >{{ t("partnersPage.exploreCollection") }}</UButton
        >
        <UButton
          :to="institution.url"
          target="_blank"
          rel="noopener noreferrer"
          trailing-icon="i-lucide-arrow-up-right"
          variant="outline"
          color="neutral"
        >
          {{ t("partnersPage.visitWebsite") }}
        </UButton>
      </div>
      <div
        v-if="collection && !error"
        class="tw:mt-8 tw:flex tw:flex-wrap tw:gap-4 tw:text-sm"
      >
        <span
          v-if="!collection.locationsUnavailable"
          class="tw:rounded-xl tw:bg-white/70 tw:px-4 tw:py-3"
          ><strong class="tw:text-xl">{{
            collection.total.toLocaleString()
          }}</strong>
          {{ t("partnersPage.specimens") }}</span
        >
        <span class="tw:rounded-xl tw:bg-white/70 tw:px-4 tw:py-3"
          ><strong class="tw:text-xl">{{
            collectionPoints.length.toLocaleString()
          }}</strong>
          {{ t("partnersPage.mappedLocations") }}</span
        >
      </div>
    </header>

    <section
      class="tw:mt-8 tw:rounded-3xl tw:border tw:border-home-border tw:p-6 tw:sm:p-8"
    >
      <h2 class="tw:text-2xl tw:font-bold">{{ t("partnersPage.overview") }}</h2>
      <p
        class="tw:mt-4 tw:max-w-3xl tw:text-lg tw:leading-relaxed tw:text-home-muted"
      >
        {{ profile?.description }}
      </p>
    </section>

    <div
      v-if="
        error ||
        collection?.locationsUnavailable ||
        collection?.imagesUnavailable
      "
      role="alert"
      class="tw:mt-8 tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:rounded-2xl tw:bg-home-surface tw:p-5"
    >
      <p>{{ t("partnersPage.collectionLoadError") }}</p>
      <UButton
        color="neutral"
        variant="outline"
        icon="i-lucide-refresh-cw"
        :loading="status === 'pending'"
        @click="refresh()"
        >{{ t("partnersPage.retry") }}</UButton
      >
    </div>
    <section class="tw:mt-8" aria-labelledby="collection-map-title">
      <h2 id="collection-map-title" class="tw:text-2xl tw:font-bold">
        {{ t("partnersPage.collectionMap") }}
      </h2>
      <p class="tw:mt-2 tw:text-home-muted">
        {{ t("partnersPage.mapDescription") }}
      </p>
      <div class="tw:mt-3 tw:flex tw:flex-wrap tw:gap-5 tw:text-sm">
        <span class="tw:flex tw:items-center tw:gap-2"
          ><span class="institution-location-dot tw:size-7" aria-hidden="true"
            >●</span
          >{{ t("partnersPage.institutionLocation") }}</span
        >
        <span class="tw:flex tw:items-center tw:gap-2"
          ><span class="map-country-count tw:size-8" aria-hidden="true">#</span
          >{{ t("partnersPage.countryRecords") }}</span
        >
      </div>
      <div
        class="tw:mt-4 tw:overflow-hidden tw:rounded-3xl tw:border tw:border-home-border"
      >
        <ClientOnly
          ><InstitutionCollectionMap
            :key="institution.id"
            :countries="collection?.countries ?? []"
            :dataset-owner="profile?.datasetOwner ?? ''"
            :institution="institution"
            :home-label="t('partnersPage.institutionLocation')"
            :count-label="t('partnersPage.specimens')"
            :label="t('partnersPage.collectionMap')"
        /></ClientOnly>
      </div>
    </section>

    <p
      v-if="status === 'pending'"
      role="status"
      class="tw:mt-3 tw:text-home-muted"
    >
      {{ t("partnersPage.loadingCollection") }}
    </p>
    <p
      v-else-if="
        !collectionPoints.length && !error && !collection?.locationsUnavailable
      "
      class="tw:mt-3 tw:text-home-muted"
    >
      {{
        t(
          profile?.datasetOwner
            ? "partnersPage.noCollectionCoordinates"
            : "partnersPage.noCollectionDataset",
        )
      }}
    </p>
    <section class="tw:mt-8" aria-labelledby="collection-images-title">
      <h2 id="collection-images-title" class="tw:text-2xl tw:font-bold">
        {{ t("partnersPage.collectionImages") }}
      </h2>
      <p
        v-if="status === 'pending'"
        role="status"
        class="tw:mt-4 tw:text-home-muted"
      >
        {{ t("partnersPage.loadingCollection") }}
      </p>
      <p
        v-else-if="
          !galleryImages.length && !error && !collection?.imagesUnavailable
        "
        class="tw:mt-4 tw:text-home-muted"
      >
        {{ t("partnersPage.noCollectionImages") }}
      </p>
      <div
        class="tw:mt-5 tw:grid tw:grid-cols-1 tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3"
      >
        <NuxtLink
          v-for="image in galleryImages"
          :key="image.id"
          :to="localePath(`/specimen/${encodeURIComponent(image.id)}`)"
          class="tw:group tw:flex tw:flex-col tw:overflow-hidden tw:rounded-2xl tw:border tw:border-home-border tw:bg-home-surface tw:shadow-sm tw:transition tw:hover:-translate-y-1 tw:hover:shadow-lg tw:focus-visible:outline-2 tw:focus-visible:outline-home-link"
        >
          <img
            :src="image.previewUrl"
            :alt="image.title"
            loading="lazy"
            width="640"
            height="480"
            @error="imageError($event, image)"
            class="tw:aspect-[4/3] tw:w-full tw:bg-white tw:object-contain tw:p-4 tw:transition-transform tw:duration-300 tw:group-hover:scale-[1.03]"
          />
          <div class="tw:flex-1 tw:border-t tw:border-home-border tw:p-5">
            <p class="tw:text-lg tw:leading-snug tw:font-semibold">
              {{ image.title }}
            </p>
            <p
              v-if="image.locality"
              class="tw:mt-1 tw:text-sm tw:text-home-muted"
            >
              {{ image.locality }}
            </p>
            <p
              v-if="image.author || image.license"
              class="tw:mt-2 tw:text-xs tw:text-home-muted"
            >
              {{ [image.author, image.license].filter(Boolean).join(" · ") }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </article>
</template>
