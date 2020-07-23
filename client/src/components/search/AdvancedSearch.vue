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
      <!-- SEARCH FIELDS -->
      <v-row no-gutters class="pa-1">
        <v-col
          cols="12"
          :sm="item.fieldType !== 'checkbox' ? 4 : 12"
          lg="12"
          v-for="(item, key) in filteredSearchFields"
          :key="key"
        >
          <!-- TEXT FIELDS -->
          <v-row no-gutters v-if="item.fieldType === 'text'">
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

          <!-- CHECKBOX FIELDS -->
          <v-row no-gutters v-else-if="item.fieldType === 'checkbox'">
            <v-col
              cols="12"
              class="px-1 pb-1 d-flex flex-row justify-space-between"
            >
              <div class="advanced-search--checkbox-label">
                {{ item.label }}
              </div>

              <v-btn icon @click="updateSearchFieldCheckboxState(item.field)">
                <v-icon v-if="item.showCheckboxes">fas fa-angle-up</v-icon>
                <v-icon v-else>fas fa-angle-down</v-icon>
              </v-btn>
            </v-col>

            <v-col
              cols="12"
              sm="4"
              md="3"
              lg="12"
              class="px-1 pb-1"
              v-for="(entity, index) in getCheckboxes(item.field)"
              :key="index"
              v-show="item.showCheckboxes"
            >
              <v-checkbox
                class="mt-0 mb-2"
                :input-value="item.value && item.value.includes(entity)"
                :label="entity"
                @change="
                  updateCheckbox({ item, bool: $event, fieldName: entity })
                "
                hide-details
                dense
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row no-gutters class="pa-1">
        <v-col cols="12" class="d-flex justify-end pa-1">
          <v-btn color="error" @click="reset">
            Reset
            <v-icon right>far fa-trash-alt</v-icon>
          </v-btn>
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
    ...mapGetters("search", ["getCheckboxes"]),

    filteredSearchFields() {
      let clonedSearchFields = cloneDeep(this.searchFields);
      return clonedSearchFields.filter(item => item.field !== "q");
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
    ...mapActions("search", [
      "updateSearchField",
      "updateSearchFieldCheckboxState",
      "resetSearch"
    ]),

    updateSearchFieldDebounced: debounce(function(value) {
      this.updateSearchField(value);
    }, 300),

    updateCheckbox(event) {
      if (event.bool) {
        if (event.item.value) event.item.value += `,${event.fieldName}`;
        else event.item.value = event.fieldName;
      } else {
        if (event.item.value) {
          let valueList = event.item.value.split(",");
          let filteredValues = valueList.filter(val => val !== event.fieldName);
          event.item.value = filteredValues.join(",");
        }
      }
      this.updateSearchField(event.item);
    },

    reset() {
      this.resetSearch();
    }
  }
};
</script>

<style scoped>
.advanced-search--checkbox-label {
  margin: 5px 4px 3px 0;
  font-weight: bold;
  color: black;
  white-space: nowrap;
}
</style>
