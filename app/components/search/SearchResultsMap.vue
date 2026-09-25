<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useSearchStore } from "@/stores/search";
import MapWrapper from "@/components/MapWrapper.vue";
const { t } = useI18n();
const store = useSearchStore();
const open = ref(true);
const expanded = ref(false);
const hasArea = computed(() => !!store.search.map.value);
function clearArea() {
  store.updateSearchField({ id: "map", value: null });
  store.fetchResults();
}
</script>

<template>
  <section
    :aria-label="t('search.tab.map')"
    class="tw:mx-4 tw:mb-5 tw:overflow-hidden tw:rounded-xl tw:border tw:border-default tw:sm:mx-6"
  >
    <div
      class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:bg-muted/30 tw:px-4 tw:py-3"
    >
      <div class="tw:min-w-0">
        <h2
          class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold"
        >
          <UIcon name="i-lucide-map" aria-hidden="true" />{{
            t("search.tab.map")
          }}
        </h2>
        <p class="tw:mt-1 tw:text-xs tw:text-muted">
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
          @click="open = !open"
        />
      </div>
    </div>
    <div id="results-map-content" v-show="open" class="tw:relative">
      <UProgress
        v-if="store.isLoading"
        class="tw:absolute tw:inset-x-0 tw:top-0 tw:z-1000"
        size="xs"
      />
      <MapWrapper
        map-id="search-map"
        :open="open"
        :height="expanded ? '65vh' : '350px'"
        :response-results="store.responseResults"
        :response-results-count="store.responseResultsCount"
        activate-search
        @update="store.fetchResults()"
      />
    </div>
  </section>
</template>
