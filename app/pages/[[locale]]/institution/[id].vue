<script setup lang="ts">
import ProviderDataPanel from "@/components/ProviderDataPanel.vue";
import { useAsyncData, createError } from "#imports";
import { useI18n } from "vue-i18n";
import InstitutionCollectionMap from "@/components/InstitutionCollectionMap.vue";
import { institutions as legacyInstitutions } from "@/institutions";
import { findCatalogInstitution, institutionDatasets, institutionSourceUrls, institutionCollectionSearchQuery, type CatalogInstitution } from "@/utils/institutionCatalog";
import {
  getInstitutionCountryMarkers,
} from "@/utils/institutionMap";
import { $fetch } from "ofetch";
import { parseDatasetCatalog, datasetProviderParams } from "@/utils/datasetCatalog";
import { loadInstitutionCollection } from "@/services/institutionCollection";

definePageMeta({
  name: "Institution detail",
  path: "/:locale(en|ee|de)?/institution/:id",
  layout: "default",
});

const route = useRoute();
const { t } = useI18n();
const { localePath } = useAppNavigation();
const { data: institutions, error: institutionError } = await useAsyncData("institution-catalog", () => $fetch<CatalogInstitution[]>("/catalog/institutions"));
const institution = computed(() => findCatalogInstitution(institutions.value ?? [], String(route.params.id)));
if (institutionError.value) throw createError({ statusCode: 502, statusMessage: "Institution catalog unavailable" });
const legacyInstitution = computed(() => !institution.value ? legacyInstitutions.find((item) => item.id === route.params.id) : undefined);
if (!institution.value && !legacyInstitution.value) throw createError({ statusCode: 404, statusMessage: "Institution not found" });
const {
  data: catalog,
  status: datasetsStatus,
  error: datasetsError,
  refresh: refreshDatasets,
} = useAsyncData("institution-provider-catalog", async () =>
  parseDatasetCatalog({ data: await $fetch<unknown>("/catalog/datasets") }),
  { lazy: true },
);
const linkedCatalog = computed(() => institution.value ? institutionDatasets(catalog.value ?? [], institution.value.institution_id) : []);
const sourceUrls = computed(() => institutionSourceUrls(linkedCatalog.value));
const {
  data: collection,
  status,
  error,
  refresh,
} = useAsyncData(
  () => `institution-collection-${route.params.id}-${sourceUrls.value.join("|")}`,
  () => loadInstitutionCollection(sourceUrls.value),
  { lazy: true },
);
const providerData = computed(() => linkedCatalog.value.length ? linkedCatalog.value.map((item) => ({
  ...item,
  provider_params: datasetProviderParams(item.provider_params),
})) : null);
const topCountries = computed(() =>
  [...(collection.value?.countries ?? [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8),
);
const collectionPoints = computed(() => collection.value?.points ?? []);
const hasCountryMarkers = computed(
  () =>
    getInstitutionCountryMarkers(collection.value?.countries ?? []).length > 0,
);
const failedImages = ref<string[]>([]);
const galleryImages = computed(() =>
  (collection.value?.images ?? []).filter(
    (image) => !failedImages.value.includes(image.id),
  ),
);
const searchLink = computed(() => ({
  path: localePath("/search"),
  query: institutionCollectionSearchQuery(sourceUrls.value),
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
  title: institution.value?.name ?? legacyInstitution.value?.name ?? t("partnersPage.pageTitle"),
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
        {{ institution.countryKey ? t(`partnersPage.countries.${institution.countryKey}`) : institution.country }}
      </p>
      <p v-if="institution.address" class="tw:mt-3 tw:text-home-muted">{{ institution.address }}</p>
      <img v-if="institution.logoUrl" :src="institution.logoUrl" :alt="institution.name" class="tw:mt-5 tw:max-h-24 tw:max-w-64 tw:object-contain" />
      <div class="tw:mt-7 tw:flex tw:flex-wrap tw:gap-3">
        <UButton
          v-if="sourceUrls.length"
          :to="searchLink"
          icon="i-lucide-search"
          class="tw:bg-home-link tw:text-white"
          >{{ t("partnersPage.exploreCollection") }}</UButton
        >
        <UButton
          v-if="institution.url" :to="institution.url"
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
        v-if="collection && !error && sourceUrls.length"
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
        <span
          v-if="!collection.coordinatesUnavailable"
          class="tw:rounded-xl tw:bg-white/70 tw:px-4 tw:py-3"
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
        {{ institution.description }}
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
    <section v-if="institution.coordinates" class="tw:mt-8" aria-labelledby="collection-map-title">
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
            :source-urls="sourceUrls"
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
        status === 'success' &&
        datasetsStatus === 'success' &&
        !hasCountryMarkers &&
        !collectionPoints.length &&
        !error &&
        !collection?.locationsUnavailable &&
        !collection?.coordinatesUnavailable
      "
      class="tw:mt-3 tw:text-home-muted"
    >
      {{
        t(
          sourceUrls.length
            ? (collection?.total ? "partnersPage.noCollectionCoordinates" : "catalogImprovements.noIndexedRecords")
            : "catalogImprovements.collectionUnavailable",
        )
      }}
    </p>
    <section class="tw:mt-8" aria-labelledby="institution-datasets-title">
      <h2 id="institution-datasets-title" class="tw:text-2xl tw:font-bold">
        {{ t("partnersPage.linkedDatasets")
        }}<span
          v-if="datasetsStatus === 'success'"
          class="tw:ml-2 tw:text-home-muted"
          >({{ linkedCatalog.length }})</span
        >
      </h2>
      <p class="tw:mt-2 tw:max-w-3xl tw:text-home-muted">
        {{ t("partnersPage.datasetsDescription") }}
      </p>
      <ul v-if="linkedCatalog.length" class="tw:mt-5 tw:grid tw:list-none tw:gap-4 tw:p-0 tw:md:grid-cols-2">
        <li v-for="item in linkedCatalog" :key="item.dataset_guid" class="tw:rounded-2xl tw:bg-home-surface tw:p-6">
          <NuxtLink :to="localePath('/dataset/' + item.dataset_guid)" class="tw:text-lg tw:font-bold tw:text-home-link tw:hover:underline">{{ item.title }}</NuxtLink>
          <p v-if="item.description" class="tw:mt-3 tw:line-clamp-3 tw:leading-7 tw:text-home-muted">{{ item.description }}</p>
        </li>
      </ul>
      <p v-if="datasetsStatus === 'pending'" role="status" class="tw:mt-5">
        {{ t("datasetsPage.loading") }}
      </p>
      <div
        v-else-if="datasetsError"
        role="alert"
        class="tw:mt-5 tw:rounded-2xl tw:bg-home-surface tw:p-5"
      >
        <p>{{ t("datasetsPage.error") }}</p>
        <UButton
          class="tw:mt-3"
          color="neutral"
          variant="outline"
          @click="refreshDatasets()"
          >{{ t("partnersPage.retry") }}</UButton
        >
      </div>
      <p
        v-else-if="datasetsStatus === 'success' && !linkedCatalog.length"
        class="tw:mt-5 tw:text-home-muted"
      >
        {{ t("partnersPage.noLinkedDatasets") }}
      </p>
    </section>

    <section
      v-if="topCountries.length"
      class="tw:mt-8 tw:rounded-3xl tw:border tw:border-home-border tw:p-6 tw:sm:p-8"
      aria-labelledby="institution-coverage-title"
    >
      <h2 id="institution-coverage-title" class="tw:text-2xl tw:font-bold">
        {{ t("partnersPage.geographicCoverage") }}
      </h2>
      <p class="tw:mt-2 tw:text-home-muted">
        {{
          t("partnersPage.coverageDescription", {
            count: collection?.countries.length ?? 0,
          })
        }}
      </p>
      <ul
        class="tw:mt-5 tw:grid tw:list-none tw:gap-3 tw:p-0 tw:sm:grid-cols-2 tw:lg:grid-cols-4"
      >
        <li v-for="country in topCountries" :key="country.country">
          <NuxtLink
            :to="{
              path: localePath('/search'),
              query: institutionCollectionSearchQuery(
                sourceUrls,
                country.country,
              ),
            }"
            class="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:rounded-xl tw:bg-home-surface tw:p-4 tw:text-home-link tw:hover:underline"
            ><span>{{ country.country }}</span
            ><strong>{{ country.count.toLocaleString() }}</strong></NuxtLink
          >
        </li>
      </ul>
    </section>

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
    <ProviderDataPanel :data="providerData" />
  </article>
  <article v-else-if="legacyInstitution" class="tw:mx-auto tw:max-w-6xl tw:px-4 tw:py-12 tw:text-home-ink">
    <h1 class="tw:text-3xl tw:font-bold">{{ legacyInstitution.name }}</h1>
    <p role="status" class="tw:mt-5 tw:max-w-2xl tw:leading-7 tw:text-home-muted">{{ t("catalogImprovements.legacyInstitution") }}</p>
    <UButton :to="localePath('/institution')" class="tw:mt-6" icon="i-lucide-arrow-left">{{ t("partnersPage.backToInstitutions") }}</UButton>
  </article>
</template>
