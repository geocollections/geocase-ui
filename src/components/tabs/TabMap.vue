<template>
  <v-card flat>
    <v-row
      no-gutters
      class="my-4"
      justify="center"
      v-if="localities.length === 0"
    >
      <v-col cols="12" style="max-width: 500px;">
        <v-alert
          class="mb-0"
          text
          border="left"
          icon="fas fa-search"
          color="secondary"
        >
          <div>
            {{ $t("search.mapNoResults") }}
          </div>

          <div v-if="!search.has_map.value">
            {{ $t("search.mapNoResultsFilterInfo") }}
            <v-btn
              x-small
              color="secondary"
              @click="updateSearchField({ id: 'has_map', value: 'true' })"
              >{{ $t("search.addFilter") }}</v-btn
            >
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <div class="map" v-show="localities.length > 0">
      <map-wrapper
        :response-results="responseResults"
        :response-results-count="responseResultsCount"
        :height="isDetailView ? '50vh' : '70vh'"
      />
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
import MapWrapper from "@/components/MapWrapper";

export default {
  name: "TabMap",
  components: { MapWrapper },
  props: {
    responseResults: {
      type: Array,
      required: true
    },
    responseResultsCount: {
      type: Number,
      required: false,
      default: 1
    },
    isDetailView: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState("search", ["search"]),

    localities() {
      if (this.responseResultsCount > 0) {
        return this.responseResults.filter(locality => !!locality.has_map);
      } else return [];
    }
  },

  methods: {
    ...mapActions("search", ["updateSearchField"])
  }
};
</script>

<style scoped>
.map-progress-circular {
  transition: margin-left 200ms ease-in-out;
}
</style>
