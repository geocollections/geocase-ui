<template>
  <section class="tw:min-h-64" aria-live="polite">
    <div
      v-if="localities.length === 0"
      class="tw:flex tw:justify-center tw:p-4 tw:sm:p-8"
    >
      <UCard variant="subtle" class="tw:w-full tw:max-w-xl tw:text-center">
        <div class="tw:flex tw:flex-col tw:items-center tw:gap-3">
          <span
            class="tw:bg-muted tw:text-highlighted tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-full"
            aria-hidden="true"
          >
            <UIcon name="i-lucide-map-pin-off" class="tw:size-6" />
          </span>
          <p class="tw:text-highlighted tw:text-base tw:font-semibold">
            {{ $t("search.mapNoResults") }}
          </p>
          <p v-if="!search.has_map.value" class="tw:text-muted tw:text-sm">
            {{ $t("search.mapNoResultsFilterInfo") }}
          </p>
          <UButton
            v-if="!search.has_map.value"
            icon="i-lucide-filter-plus"
            color="neutral"
            variant="solid"
            @click="updateSearchField({ id: 'has_map', value: 'true' })"
          >
            {{ $t("search.addFilter") }}
          </UButton>
        </div>
      </UCard>
    </div>

    <div v-show="localities.length > 0" class="map tw:overflow-hidden">
      <MapWrapper
        :response-results="responseResults"
        :response-results-count="responseResultsCount"
        :height="isDetailView ? '50vh' : '70vh'"
        :is-detail-view="isDetailView"
      />
    </div>
  </section>
</template>

<script>
import { useSearchStore } from "@/stores/search";

import { mapActions, mapState } from "pinia";
import MapWrapper from "@/components/MapWrapper.vue";

export default {
  name: "TabMap",
  components: { MapWrapper },
  props: {
    responseResults: {
      type: Array,
      required: true,
    },
    responseResultsCount: {
      type: Number,
      required: false,
      default: 1,
    },
    isDetailView: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState(useSearchStore, ["search"]),

    localities() {
      if (this.responseResultsCount > 0) {
        return this.responseResults.filter((locality) => !!locality.has_map);
      } else return [];
    },
  },

  methods: {
    ...mapActions(useSearchStore, ["updateSearchField"]),
  },
};
</script>
