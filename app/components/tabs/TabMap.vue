<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSearchStore } from "@/stores/search";
import MapWrapper from "@/components/MapWrapper.vue";

const props = defineProps({
  responseResults: {
    type: Array,
    required: true,
  },
  responseResultsCount: {
    type: Number,
    default: 1,
  },
  isDetailView: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const searchStore = useSearchStore();

const localities = computed(() =>
  props.responseResultsCount > 0
    ? props.responseResults.filter((locality) => locality.has_map)
    : [],
);
</script>

<template>
  <section
    class="tw:relative tw:min-h-32"
    :aria-busy="searchStore.isLoading"
  >
    <UProgress
      v-if="searchStore.isLoading"
      color="primary"
      size="xs"
      animation="carousel"
      class="tw:absolute tw:inset-x-0 tw:top-0 tw:z-10"
    />

    <div
      v-if="!searchStore.isLoading && localities.length === 0"
      class="tw:mx-auto tw:max-w-2xl tw:px-4 tw:py-10"
    >
      <UAlert
        color="neutral"
        variant="soft"
        icon="i-lucide-map-pin-off"
        :title="t('search.mapNoResults')"
      >
        <template #description>
          <div
            v-if="!searchStore.search.has_map.value"
            class="tw:flex tw:flex-col tw:items-start tw:gap-3 tw:sm:flex-row tw:sm:items-center"
          >
            <span>{{ t("search.mapNoResultsFilterInfo") }}</span>
            <UButton
              size="sm"
              color="primary"
              variant="soft"
              icon="i-lucide-list-filter-plus"
              @click="
                searchStore.updateSearchField({
                  id: 'has_map',
                  value: 'true',
                })
              "
            >
              {{ t("search.addFilter") }}
            </UButton>
          </div>
        </template>
      </UAlert>
    </div>

    <div
      v-show="localities.length > 0"
      role="region"
      :aria-label="t('search.tab.map')"
      class="map tw:ring-default tw:overflow-hidden tw:rounded-xl tw:ring-1 tw:shadow-sm"
    >
      <MapWrapper
        class="tw:w-full"
        :response-results="responseResults"
        :response-results-count="responseResultsCount"
        :height="isDetailView ? '50vh' : '70vh'"
        :is-detail-view="isDetailView"
      />
    </div>
  </section>
</template>
