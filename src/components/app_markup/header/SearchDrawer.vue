<template>
  <v-navigation-drawer
    app
    :value="drawer"
    @input="$emit('update:drawer', $event)"
    :style="footerStyle"
    clipped
    fixed
    width="350"
    disable-route-watcher
    mobile-breakpoint="960"
    class="elevation-4"
    color="blue-grey lighten-4"
  >
    <v-list>
      <!-- FIND QUICKLY -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold text-center text-uppercase mb-2"
            style="font-size: 1.15rem;"
            >Find quickly</v-list-item-title
          >

          <TextFieldWrapper
            class="search-drawer-text-field"
            :value="search.q.value"
            @input="updateSearchFieldDebounced({ id: 'q', value: $event })"
            clearable
            solo
            :placeholder="search.q.label"
            clear-icon="fas fa-times"
          />
        </v-list-item-content>
      </v-list-item>

      <!-- ADDITIONAL FILTERS -->
      <v-list-group :value="showAdditionalFilters">
        <template v-slot:activator>
          <v-list-item-title
            class="font-weight-bold text-center text-uppercase"
            style="font-size: 1.15rem;"
            >Additional filters</v-list-item-title
          >
        </template>

        <!-- TEXT FIELDS -->
        <v-list-group :value="showTextFields" sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-bold text-uppercase"
                style="font-size: 0.875rem;"
                >Text fields</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item v-for="id in searchTextIds" :key="id + 20">
            <v-row no-gutters>
              <v-col cols="12" class="py-1">
                <SelectWrapper
                  :use-custom-prepend-inner="search[id].label"
                  :items="lookUpTypes"
                  :value="search[id].lookUpType"
                  @input="updateSearchField({ id: id, lookUpType: $event })"
                />
              </v-col>
              <v-col cols="12" class="py-1">
                <TextFieldWrapper
                  class="search-drawer-text-field"
                  :value="search[id].value"
                  @input="updateSearchFieldDebounced({ id: id, value: $event })"
                  dense
                  clearable
                  solo
                  :placeholder="search[id].label"
                  clear-icon="fas fa-times"
                />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list-group>

        <!-- CHECKBOXES -->
        <v-list-group :value="showCheckboxes" sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-bold text-uppercase"
                style="font-size: 0.875rem;"
                >Checkboxes</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item v-for="id in searchCheckboxIds" :key="id + 40">
            <v-row no-gutters>
              <v-col
                cols="12"
                class="px-1 pb-1 d-flex flex-row justify-space-between"
              >
                <div
                  class="search--checkbox-label"
                  :class="{
                    'search--checkbox-active font-weight-bold text-center':
                      search[id].value && search[id].value.length > 0
                  }"
                  @click="
                    updateSearchField({
                      id: id,
                      showCheckboxes: !search[id].showCheckboxes
                    })
                  "
                >
                  {{ search[id].label }}
                </div>

                <v-btn
                  icon
                  @click="
                    updateSearchField({
                      id: id,
                      showCheckboxes: !search[id].showCheckboxes
                    })
                  "
                >
                  <v-icon v-if="search[id].showCheckboxes"
                    >fas fa-angle-up</v-icon
                  >
                  <v-icon v-else>fas fa-angle-down</v-icon>
                </v-btn>
              </v-col>

              <v-col
                cols="12"
                class="px-1 pb-1"
                v-for="(entity, key) in getCheckboxes(
                  id,
                  search[id].showCheckboxes,
                  search[id].showMore
                )"
                :key="key"
              >
                <v-checkbox
                  class="mt-0 mb-2"
                  color="blue-grey darken-3"
                  :input-value="
                    search[id].value &&
                      search[id].value.includes(`&quot;${entity}&quot;`)
                  "
                  @change="
                    updateCheckbox({
                      id: id,
                      bool: $event,
                      value: search[id].value,
                      fieldName: entity
                    })
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
                        >({{ getCheckboxesCount(id)[key] }})</span
                      >
                    </div>
                  </template>
                </v-checkbox>
              </v-col>

              <v-btn
                v-if="getCheckboxesLength(id) > 4"
                small
                text
                class="mx-4 mb-2 font-weight-bold"
                v-show="search[id].showCheckboxes"
                @click="
                  updateSearchField({
                    id: id,
                    showMore: !search[id].showMore
                  })
                "
              >
                <span v-if="search[id].showMore">
                  <v-icon x-small>fas fa-minus</v-icon> Less</span
                >
                <span v-else><v-icon x-small>fas fa-plus</v-icon> More</span>
              </v-btn>
            </v-row>
          </v-list-item>
        </v-list-group>

        <!-- SINGLE CHECKBOXES -->
        <v-list-group :value="showSingleCheckboxes" sub-group>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title
                class="font-weight-bold text-uppercase"
                style="font-size: 0.875rem;"
                >Single checkboxes</v-list-item-title
              >
            </v-list-item-content>
          </template>

          <v-list-item v-for="id in searchSingleCheckboxIds" :key="id + 60">
            <v-checkbox
              color="blue-grey darken-3"
              class="mt-0 mb-2"
              :input-value="search[id].value"
              :label="search[id].label"
              true-value="true"
              :false-value="null"
              @change="updateSearchField({ id: id, value: $event })"
              hide-details
              dense
            />
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>

    <!-- SEARCH FIELDS -->
    <v-row no-gutters class="pa-3">
      <!-- TEXT FIELDS -->
      <v-col cols="12" v-for="id in searchTextIds" :key="id">
        <v-row no-gutters>
          <v-col cols="12" class="px-1" :class="{ 'pb-1': id !== 'q' }">
            <SelectWrapper
              v-if="id !== 'q'"
              :use-custom-prepend-inner="search[id].label"
              :items="lookUpTypes"
              :value="search[id].lookUpType"
              @input="updateSearchField({ id: id, lookUpType: $event })"
            />
            <div
              v-else
              class="font-weight-bold text-center text-uppercase"
              style="font-size: 1.15rem;"
            >
              Find quickly
            </div>
          </v-col>

          <v-col cols="12" class="pa-1">
            <TextFieldWrapper
              class="search-drawer-text-field"
              :value="search[id].value"
              @input="updateSearchFieldDebounced({ id: id, value: $event })"
              :dense="id !== 'q'"
              clearable
              solo
              :placeholder="search[id].label"
              clear-icon="fas fa-times"
            />
          </v-col>

          <v-col cols="12" class="mt-3" v-if="id === 'q'">
            <div
              class="font-weight-bold text-center text-uppercase"
              style="font-size: 1.15rem;"
            >
              Additional Filters
            </div>
          </v-col>
        </v-row>
      </v-col>

      <!-- CHECKBOXES -->
      <v-col
        cols="12"
        v-for="id in searchCheckboxIds"
        :key="id"
        class="px-1"
        :class="{
          'blue-grey lighten-3 rounded-lg pt-1 my-1':
            search[id].value && search[id].value.length > 0
        }"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            class="px-1 pb-1 d-flex flex-row justify-space-between"
          >
            <div
              class="search--checkbox-label"
              :class="{
                'search--checkbox-active font-weight-bold text-center':
                  search[id].value && search[id].value.length > 0
              }"
              @click="
                updateSearchField({
                  id: id,
                  showCheckboxes: !search[id].showCheckboxes
                })
              "
            >
              {{ search[id].label }}
            </div>

            <v-btn
              icon
              @click="
                updateSearchField({
                  id: id,
                  showCheckboxes: !search[id].showCheckboxes
                })
              "
            >
              <v-icon v-if="search[id].showCheckboxes">fas fa-angle-up</v-icon>
              <v-icon v-else>fas fa-angle-down</v-icon>
            </v-btn>
          </v-col>

          <v-col
            cols="12"
            class="px-1 pb-1"
            v-for="(entity, key) in getCheckboxes(
              id,
              search[id].showCheckboxes,
              search[id].showMore
            )"
            :key="key"
          >
            <v-checkbox
              class="mt-0 mb-2"
              color="blue-grey darken-3"
              :input-value="
                search[id].value &&
                  search[id].value.includes(`&quot;${entity}&quot;`)
              "
              @change="
                updateCheckbox({
                  id: id,
                  bool: $event,
                  value: search[id].value,
                  fieldName: entity
                })
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
                    >({{ getCheckboxesCount(id)[key] }})</span
                  >
                </div>
              </template>
            </v-checkbox>
          </v-col>

          <v-btn
            v-if="getCheckboxesLength(id) > 4"
            small
            text
            class="mx-4 mb-2 font-weight-bold"
            v-show="search[id].showCheckboxes"
            @click="
              updateSearchField({
                id: id,
                showMore: !search[id].showMore
              })
            "
          >
            <span v-if="search[id].showMore">
              <v-icon x-small>fas fa-minus</v-icon> Less</span
            >
            <span v-else><v-icon x-small>fas fa-plus</v-icon> More</span>
          </v-btn>
        </v-row>
      </v-col>

      <!-- SINGLE CHECKBOXES -->
      <v-col
        class="px-1"
        cols="12"
        v-for="id in searchSingleCheckboxIds"
        :key="id"
      >
        <v-row no-gutters>
          <v-col cols="12" class="px-1 pb-1 d-flex ">
            <v-checkbox
              color="blue-grey darken-3"
              class="mt-0 mb-2"
              :input-value="search[id].value"
              :label="search[id].label"
              true-value="true"
              :false-value="null"
              @change="updateSearchField({ id: id, value: $event })"
              hide-details
              dense
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row no-gutters class="px-3 pb-5">
      <v-col cols="12" class="d-flex justify-end">
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
import TextFieldWrapper from "@/components/partial/input_wrappers/TextFieldWrapper";
import SelectWrapper from "@/components/partial/input_wrappers/SelectWrapper";
import queryMixin from "@/mixins/queryMixin";
import { debounce } from "lodash";

export default {
  name: "SearchDrawer",

  components: { TextFieldWrapper, SelectWrapper },

  mixins: [queryMixin],

  props: {
    drawer: {
      type: Boolean,
      required: true
    }
  },

  data: () => ({
    showAdditionalFilters: true,
    showTextFields: true,
    showCheckboxes: true,
    showSingleCheckboxes: true
  }),

  computed: {
    ...mapState("search", [
      "lookUpTypes",
      "search",
      "searchTextIds",
      "searchCheckboxIds",
      "searchSingleCheckboxIds"
    ]),
    ...mapGetters("search", [
      "getCheckboxes",
      "getCheckboxesCount",
      "getCheckboxesLength"
    ]),

    isSmAndDown() {
      return this.$vuetify.breakpoint.smAndDown;
    },

    footerStyle() {
      let style = `z-index: 2010; max-height: calc(100% - ${this.$vuetify.application.top}px);`;
      if (this.isSmAndDown)
        style += `margin-top: ${this.$vuetify.application.top}px; `;
      return style;
    }
  },

  watch: {
    search: {
      handler(newVal) {
        this.constructQueryParams(newVal);
      },
      deep: true
    }
  },

  methods: {
    ...mapActions("search", ["updateSearchField", "resetSearch"]),

    updateSearchFieldDebounced: debounce(function(value) {
      this.updateSearchField(value);
    }, 300),

    updateCheckbox(event) {
      // let e = clone(event);
      let e = { ...event };
      if (e.bool) {
        if (e.value) e.value += ` OR "${e.fieldName}"`;
        else e.value = `"${e.fieldName}"`;
      } else {
        if (e.value) {
          let valueList = e.value.split(" OR ");
          let filteredValues = valueList.filter(
            val => val !== `"${e.fieldName}"`
          );
          e.value = filteredValues.join(" OR ");
        }
      }
      this.updateSearchField({ id: e.id, value: e.value });
    },

    reset() {
      this.resetSearch();
    }
  }
};
</script>

<style scoped>
.search--checkbox-label {
  margin: 5px 4px 3px 0;
  /*font-weight: bold;*/
  color: black;
  white-space: nowrap;
}

.search--checkbox-label:hover {
  cursor: pointer;
  opacity: 0.7;
}

.search--checkbox-active {
  width: 100%;
}

/* solo-inverted override */
.search-drawer-text-field >>> .v-input__slot {
  background: #eceff1 !important;
}

.add-transition {
  transition: all 200ms ease-out;
}
</style>
