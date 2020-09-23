<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    :style="footerStyle"
    clipped
    fixed
    :right="isMdAndDown"
    width="350"
  >
    <!-- SEARCH FIELDS -->
    <v-row no-gutters class="pa-1">
      <v-col cols="12" v-for="item in searchFields" :key="item.field">
        <!-- TEXT FIELDS -->
        <v-row no-gutters v-if="item.fieldType === 'text'">
          <v-col cols="12" class="px-1" :class="{ 'pb-1': item.field !== 'q' }">
            <SelectWrapper
              v-if="item.field !== 'q'"
              :use-custom-prepend-inner="item.label"
              :items="lookUpTypes"
              :value="item.lookUpType"
              @input="updateSearchField({ ...item, lookUpType: $event })"
            />
            <div v-else class="font-weight-bold">Fast search</div>
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
            <div
              class="advanced-search--checkbox-label"
              @click="
                updateSearchFieldCheckboxState({
                  findField: item.field,
                  changeField: 'showCheckboxes'
                })
              "
            >
              {{ item.label }}
            </div>

            <v-btn
              icon
              @click="
                updateSearchFieldCheckboxState({
                  findField: item.field,
                  changeField: 'showCheckboxes'
                })
              "
            >
              <v-icon v-if="item.showCheckboxes">fas fa-angle-up</v-icon>
              <v-icon v-else>fas fa-angle-down</v-icon>
            </v-btn>
          </v-col>

          <v-col
            :class="{ 'd-none': !item.showMore && index > 3 }"
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
              :input-value="
                item.value && item.value.includes(`&quot;${entity}&quot;`)
              "
              @change="
                updateCheckbox({ item, bool: $event, fieldName: entity })
              "
              hide-details
              dense
            >
              <template v-slot:label>
                <div>
                  {{ entity }}
                  <span
                    class="font-italic font-weight-light"
                    style="font-size: 0.875rem;"
                    >({{ getCheckboxesCount(item.field)[index] }})</span
                  >
                </div>
              </template>
            </v-checkbox>
          </v-col>

          <v-btn
            v-if="getCheckboxes(item.field).length > 4"
            small
            text
            class="mx-4 mb-2 font-weight-bold"
            v-show="item.showCheckboxes"
            @click="
              updateSearchFieldCheckboxState({
                findField: item.field,
                changeField: 'showMore'
              })
            "
          >
            <span v-if="item.showMore">
              <v-icon x-small>fas fa-minus</v-icon> Less</span
            >
            <span v-else><v-icon x-small>fas fa-plus</v-icon> More</span>
          </v-btn>
        </v-row>

        <!-- SINGLE CHECKBOX -->
        <v-row no-gutters v-else-if="item.fieldType === 'single_checkbox'">
          <v-col cols="12" class="px-1 pb-1 d-flex justify-end">
            <v-checkbox
              class="mt-0 mb-2"
              :input-value="item.value"
              :label="item.label"
              true-value="true"
              :false-value="null"
              @change="updateSearchField({ ...item, value: $event })"
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
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import SearchField from "@/components/input_wrappers/TextFieldWrapper";
import SelectWrapper from "@/components/input_wrappers/SelectWrapper";
import queryMixin from "@/mixins/queryMixin";
import { cloneDeep, debounce } from "lodash";

export default {
  name: "AdvancedSearchDrawer",

  components: { SearchField, SelectWrapper },

  mixins: [queryMixin],

  computed: {
    ...mapState("settings", ["searchDrawer"]),
    ...mapState("search", ["lookUpTypes", "searchFields"]),
    ...mapGetters("search", [
      "getCheckboxes",
      "getCheckboxesCount",
      "filteredSearchFields"
    ]),

    isMdAndDown() {
      return this.$vuetify.breakpoint.mdAndDown;
    },

    footerStyle() {
      let style = `z-index: 2000; max-height: calc(100% - ${this.$vuetify.application.top}px);`;
      if (this.isMdAndDown)
        style += `margin-top: ${this.$vuetify.application.top}px; `;
      return style;
    },

    drawer: {
      get() {
        return this.searchDrawer;
      },

      set(value) {
        this.updateSearchDrawerState(value);
      }
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
    ...mapActions("settings", ["updateSearchDrawerState"]),
    ...mapActions("search", [
      "updateSearchField",
      "updateSearchFieldCheckboxState",
      "resetSearch"
    ]),

    updateSearchFieldDebounced: debounce(function(value) {
      this.updateSearchField(value);
    }, 300),

    updateCheckbox(event) {
      let e = cloneDeep(event);
      if (e.bool) {
        if (e.item.value) e.item.value += ` OR "${e.fieldName}"`;
        else e.item.value = `"${e.fieldName}"`;
      } else {
        if (e.item.value) {
          let valueList = e.item.value.split(" OR ");
          let filteredValues = valueList.filter(
            val => val !== `"${e.fieldName}"`
          );
          e.item.value = filteredValues.join(" OR ");
        }
      }
      this.updateSearchField(e.item);
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

.advanced-search--checkbox-label:hover {
  cursor: pointer;
  opacity: 0.7;
}
</style>
