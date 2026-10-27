<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "#imports";
import { useSearchStore } from "@/stores/search";
import MapWrapper from "@/components/MapWrapper.vue";
const { t } = useI18n();
const store = useSearchStore();
const route = useRoute();
const router = useRouter();
const open = ref(false);
const mapPreferenceKey = "geocase:search-map-open";
onMounted(() => {
  let saved = null;
  try {
    saved = localStorage.getItem(mapPreferenceKey);
  } catch {
    saved = null;
  }
  open.value = saved === "true" || (saved !== "false" && window.matchMedia("(min-width: 960px)").matches);
});
function toggleMap() {
  open.value = !open.value;
  try {
    localStorage.setItem(mapPreferenceKey, String(open.value));
  } catch {
    return;
  }
}
const expanded = ref(false);
const hasArea = computed(() => !!store.search.map.value);
let viewportUpdateTimeout;

function updateViewport(payload) {
  clearTimeout(viewportUpdateTimeout);
  viewportUpdateTimeout = setTimeout(
    () => store.updateMapViewport(payload),
    250,
  );
}

function updateFilterFromMap(field, value, zoom) {
  if (!value) return;
  const query = { ...route.query, page: "1" };
  for (const key of Object.keys(query)) {
    if (key === field || key.startsWith(`${field}__`)) delete query[key];
  }
  if (field === "country") {
    for (const key of Object.keys(query)) {
      if (key === "locality" || key.startsWith("locality__")) delete query[key];
    }
  }
  if (field === "country") query[field] = `"${value}"`;
  else query[`${field}__equals`] = value;
  store.mapZoom = zoom;
  router.push({ path: route.path, query, hash: route.hash });
}

function selectCountry(country) {
  updateFilterFromMap("country", country, 5);
}

function selectLocality(locality) {
  updateFilterFromMap("locality", locality, 9);
}

onBeforeUnmount(() => clearTimeout(viewportUpdateTimeout));

function clearArea() {
  store.updateSearchField({ id: "map", value: null });
  store.fetchResults();
}
</script>

<template>
  <section
    :aria-label="t('search.tab.map')"
    class="tw:relative tw:isolate tw:mx-3 tw:mb-2 tw:sm:mb-5 tw:overflow-hidden tw:rounded-xl tw:border tw:border-default tw:sm:mx-6"
  >
    <div
      class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:bg-muted/30 tw:px-3 tw:py-1 tw:lg:px-4 tw:lg:py-3"
    >
      <div class="tw:min-w-0">
        <h2
          class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold"
        >
          <UIcon name="i-lucide-map" aria-hidden="true" />{{
            t("search.tab.map")
          }}
        </h2>
        <div :class="open ? '' : 'tw:hidden tw:lg:block'" aria-live="polite" aria-atomic="true">
          <p
            v-if="!store.isMapLoading && !store.isLoading"
            class="tw:mt-1 tw:text-sm tw:font-medium"
          >
            {{ t(store.mapResultsLevel === 'country' ? 'search.layout.mapCountrySummary' : 'search.layout.mapLocationSummary', {
              count: store.mapResults.length.toLocaleString(),
              records: store.responseResultsCount.toLocaleString(),
            }) }}
          </p>
          <p
            v-if="!store.isMapLoading && !store.isLoading && store.mapResultsLevel === 'points' && store.mapResults.length >= 1000"
            class="tw:mt-2 tw:text-sm tw:font-semibold tw:text-warning"
          >
            {{ t('search.layout.mapLimitNotice') }}
          </p>
        </div>
        <p class="tw:mt-1 tw:hidden tw:text-xs tw:text-muted tw:lg:block">
          {{ t("search.layout.mapNote") }}
        </p>
      </div>
      <div class="tw:flex tw:flex-wrap tw:gap-1">
        <UButton
          v-if="hasArea"
          color="error"
          variant="ghost"
          size="sm"
          icon="i-lucide-x"
          :label="t('search.layout.clearArea')"
          @click="clearArea"
        />
        <UButton
          v-if="open"
          color="neutral"
          variant="ghost"
          size="sm"
          :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
          :aria-label="
            t(expanded ? 'search.layout.reduceMap' : 'search.layout.expandMap')
          "
          :aria-pressed="expanded"
          @click="expanded = !expanded"
        />
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          :icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          :label="t(open ? 'search.layout.hideMap' : 'search.layout.showMap')"
          :aria-expanded="open"
          aria-controls="results-map-content"
          @click="toggleMap"
        />
      </div>
    </div>
    <details v-if="open" class="tw:px-3 tw:pb-2 tw:text-xs tw:text-muted tw:lg:hidden">
      <summary class="tw:flex tw:min-h-11 tw:cursor-pointer tw:items-center">{{ t("mobileSearch.mapHelp") }}</summary>
      <p class="tw:pb-2 tw:leading-relaxed">{{ t("search.layout.mapNote") }}</p>
    </details>
    <div id="results-map-content" v-show="open" class="tw:relative">
      <UProgress
        v-if="store.isMapLoading"
        class="tw:absolute tw:inset-x-0 tw:top-0 tw:z-1000"
        size="xs"
      />
      <MapWrapper
        map-id="search-map"
        :open="open"
        :height="expanded ? '65vh' : '450px'"
        :response-results="store.mapResults"
        :response-results-count="store.mapResults.length"
        :map-level="store.mapResultsLevel"
        activate-search
        @update="store.fetchResults()"
        @viewport-changed="updateViewport"
        @select-country="selectCountry"
        @select-locality="selectLocality"
      />
    </div>
  </section>
</template>
