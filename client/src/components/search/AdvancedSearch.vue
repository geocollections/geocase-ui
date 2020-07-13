<template>
  <v-card class="detail-search">
    <v-card-title class="px-3 py-2">
      <span style="cursor: pointer;" @click="showSearch = !showSearch"
        >Advanced search</span
      >
      <v-spacer />
      <span>
        <v-btn icon @click="showSearch = !showSearch">
          <v-icon v-if="showSearch" x-large>fas fa-angle-up</v-icon>
          <v-icon v-else x-large>fas fa-angle-down</v-icon>
        </v-btn>
      </span>
    </v-card-title>

    <div v-show="showSearch">
      <!-- TEXT FIELDS -->
      <v-row no-gutters class="pa-1">
        <v-col
          cols="12"
          sm="4"
          md="12"
          v-for="(item, key) in filteredSearchFields"
          :key="key"
        >
          <v-row no-gutters>
            <v-col cols="12" class="px-1 pb-1">
              <SearchLookUpType
                :use-custom-prepend-inner="item.label"
                :items="lookUpTypes"
                :value="item.lookUpType"
                @input="updateSearchField({ ...item, lookUpType: $event })"
              />
            </v-col>

            <v-col cols="12" class="pa-1">
              <SearchField
                :value="item.value"
                @input="updateSearchFieldDebounced({ ...item, value: $event })"
                dense
                clearable
                clear-icon="fas fa-times"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import SearchLookUpType from "../input_wrappers/SelectWrapper";
import SearchField from "../input_wrappers/TextFieldWrapper";
import { mapActions, mapGetters, mapState } from "vuex";
import { cloneDeep, debounce } from "lodash";
import queryMixin from "../../mixins/queryMixin";

export default {
  name: "AdvancedSearch",

  components: { SearchField, SearchLookUpType },

  mixins: [queryMixin],

  data: () => ({
    showSearch: true
  }),

  computed: {
    ...mapState("search", ["lookUpTypes", "searchFields"]),

    filteredSearchFields() {
      let clonedSearchFields = cloneDeep(this.searchFields);
      return clonedSearchFields.filter(item => item.field !== "fastsearch");
    }
  },

  watch: {
    searchFields: {
      handler(newVal) {
        this.constructQueryParams(newVal);
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("search", ["updateSearchField"]),

    updateSearchFieldDebounced: debounce(function(value) {
      this.updateSearchField(value);
    }, 300)
  }
};
</script>

<style scoped />
