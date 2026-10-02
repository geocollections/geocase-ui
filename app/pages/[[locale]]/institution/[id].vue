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

const route = useRoute();
const { t } = useI18n();
const { localePath } = useAppNavigation();
const institution = computed(() => institutions.find((item) => item.id === route.params.id));
const profile = computed(() => institutionProfiles[String(route.params.id)]);
const { data: collection } = await useAsyncData(
  () => `institution-collection-${route.params.id}`,
  () => $fetch(`/api/institution/${encodeURIComponent(String(route.params.id))}`),
);
const loadedImages = ref<string[]>([]);
const failedImages = ref<string[]>([]);
const galleryImages = computed(() => (collection.value?.images ?? []).filter(
  (image: { url: string }) => typeof image.url === "string" && image.url.trim() && !failedImages.value.includes(image.url),
));
watch(collection, () => {
  loadedImages.value = [];
  failedImages.value = [];
});
useHead(() => ({ title: institution.value?.name ?? t("partnersPage.pageTitle") }));
</script>

<template>
  <article v-if="institution" class="tw:mx-auto tw:w-full tw:max-w-6xl tw:px-4 tw:py-8 tw:text-home-ink tw:sm:px-6 tw:sm:py-12">
    <NuxtLink :to="localePath('/institution')" class="tw:inline-flex tw:items-center tw:gap-2 tw:font-semibold tw:text-home-link">
      <UIcon name="i-lucide-arrow-left" aria-hidden="true" />
      {{ t("partnersPage.backToInstitutions") }}
    </NuxtLink>

    <header class="tw:mt-8 tw:rounded-3xl tw:bg-[#eaf0e9] tw:p-6 tw:sm:p-10 tw:lg:p-12">
      <p class="tw:text-xs tw:font-extrabold tw:tracking-[0.16em] tw:text-home-link tw:uppercase">
        {{ t("partnersPage.institutionsTitle") }}
      </p>
      <h1 class="tw:mt-4 tw:max-w-4xl tw:text-[clamp(2.4rem,5vw,4.5rem)] tw:leading-[1.08] tw:font-bold tw:tracking-[-0.04em]">
        {{ institution.name }}
      </h1>
      <p class="tw:mt-5 tw:text-lg tw:text-home-muted">
        {{ t(`partnersPage.countries.${institution.countryKey}`) }}
      </p>
      <UButton
        :to="institution.url"
        target="_blank"
        rel="noopener noreferrer"
        trailing-icon="i-lucide-arrow-up-right"
        class="tw:mt-7"
      >
        {{ t("partnersPage.visitWebsite") }}
      </UButton>
    </header>

    <section class="tw:mt-8 tw:rounded-3xl tw:border tw:border-home-border tw:p-6 tw:sm:p-8">
      <h2 class="tw:text-2xl tw:font-bold">{{ t('partnersPage.overview') }}</h2>
      <p class="tw:mt-4 tw:max-w-3xl tw:text-lg tw:leading-relaxed tw:text-home-muted">{{ profile?.description }}</p>
    </section>

    <section v-if="collection?.points.length" class="tw:mt-8">
      <h2 class="tw:text-2xl tw:font-bold">{{ t('partnersPage.collectionMap') }}</h2>
      <div class="tw:mt-4 tw:overflow-hidden tw:rounded-3xl tw:border tw:border-home-border">
        <ClientOnly><InstitutionCollectionMap :key="institution.id" :points="collection.points" :label="t('partnersPage.collectionMap')" /></ClientOnly>
      </div>
    </section>

    <section v-if="galleryImages.length" v-show="loadedImages.length" class="tw:mt-8">
      <h2 class="tw:text-2xl tw:font-bold">{{ t('partnersPage.collectionImages') }}</h2>
      <div class="tw:mt-5 tw:grid tw:grid-cols-1 tw:gap-6 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
        <NuxtLink v-for="image in galleryImages" v-show="loadedImages.includes(image.url)" :key="image.id" :to="localePath(`/specimen/${encodeURIComponent(image.id)}`)" class="tw:group tw:flex tw:flex-col tw:overflow-hidden tw:rounded-2xl tw:border tw:border-home-border tw:bg-home-surface tw:shadow-sm tw:transition tw:hover:-translate-y-1 tw:hover:shadow-lg tw:focus-visible:outline-2 tw:focus-visible:outline-home-link">
          <img :src="image.previewUrl" :alt="image.title" @load="loadedImages.push(image.url)" @error="failedImages.push(image.url)" class="tw:aspect-[4/3] tw:w-full tw:bg-white tw:object-contain tw:p-4 tw:transition-transform tw:duration-300 tw:group-hover:scale-[1.03]" />
          <div class="tw:flex-1 tw:border-t tw:border-home-border tw:p-5">
            <p class="tw:text-lg tw:leading-snug tw:font-semibold">{{ image.title }}</p>
            <p v-if="image.locality" class="tw:mt-1 tw:text-sm tw:text-home-muted">{{ image.locality }}</p>
            <p v-if="image.author || image.license" class="tw:mt-2 tw:text-xs tw:text-home-muted">{{ [image.author, image.license].filter(Boolean).join(' · ') }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

  </article>
</template>
