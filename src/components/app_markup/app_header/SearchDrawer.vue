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
    <v-list expand>
      <!-- QUICK SEARCH -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="font-weight-bold text-center text-uppercase mb-2"
            style="font-size: 1.15rem;"
            >{{ $t("frontPage.quickSearch") }}</v-list-item-title
          >

          <TextFieldWrapper
            class="search-drawer-text-field"
            :value="search.q.value"
            @input="updateSearchFieldDebounced({ id: 'q', value: $event })"
            clearable
            solo
            :placeholder="$t('frontPage.quickSearch')"
            clear-icon="fas fa-times"
          />
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <!-- ADDITIONAL FILTERS -->
      <v-list-group
        :value="showAdditionalFilters"
        active-class="blue-grey lighten-3"
        color="black"
      >
        <template v-slot:activator>
          <v-list-item-title
            class="font-weight-bold text-center text-uppercase"
            style="font-size: 1.15rem;"
            >{{ $t("search.drawer.additionalFilters") }}</v-list-item-title
          >
        </template>

        <v-divider />

        <!-- TEXT FIELDS -->
        <v-list-item v-for="id in searchTextIds" :key="id">
          <v-row no-gutters>
            <v-col cols="12" class="py-1">
              <SelectWrapper
                :use-custom-prepend-inner="$t(`search.table.${id}`)"
                :items="lookUpTypes"
                :value="search[id].lookUpType"
                @input="updateSearchField({ id: id, lookUpType: $event })"
                :readonly="id === 'coordinates'"
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
                :readonly="id === 'coordinates'"
                :placeholder="
                  $t(
                    `search.table.${id}${
                      id === 'coordinates' ? 'ReadOnly' : ''
                    }`
                  )
                "
                clear-icon="fas fa-times"
              />
            </v-col>
          </v-row>
        </v-list-item>

        <div class="my-2"></div>

        <v-divider />

        <!-- MAP -->
        <v-card class="checkboxes" flat tile color="transparent" hover>
          <v-hover v-slot:default="{ hover }">
            <v-card-title
              class="checkboxes--title font-weight-bold text-uppercase py-2 px-6"
              style="font-size: 0.875rem;"
              :class="{
                'blue-grey lighten-3': search.map.showCheckboxes,
                'blue-grey lighten-2': search.map.showCheckboxes && hover
              }"
              @click="
                updateSearchField({
                  id: 'map',
                  showCheckboxes: !search.map.showCheckboxes
                })
              "
            >
              {{ $t(`search.table.map`) }}
              <v-spacer />

              <v-tooltip v-if="search.map.value" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mr-6"
                    v-bind="attrs"
                    v-on="on"
                    small
                    color="error"
                    icon
                    @click.stop="resetFacet('map')"
                  >
                    <v-badge color="transparent" bottom overlap
                      ><v-icon small>fas fa-trash</v-icon>
                    </v-badge>
                  </v-btn>
                </template>
                <span>{{
                  $t("search.drawer.clearFilters", {
                    field: $t(`search.table.map`)
                  })
                }}</span>
              </v-tooltip>

              <v-icon v-if="search.map.showCheckboxes">fas fa-angle-up</v-icon>
              <v-icon v-else>fas fa-angle-down</v-icon>
            </v-card-title>
          </v-hover>
          <v-divider />

          <v-expand-transition>
            <v-card-text
              class="transition-fast-in-fast-out pa-0"
              :class="{ 'blue-grey lighten-5': search.map.showCheckboxes }"
              v-show="search.map.showCheckboxes"
            >
              <search-map
                :open="search.map.showCheckboxes"
                :response-results="responseResults"
                :response-results-count="responseResultsCount"
              />
            </v-card-text>
          </v-expand-transition>
        </v-card>

        <!-- CHECKBOXES -->
        <v-card
          class="checkboxes"
          flat
          tile
          color="transparent"
          v-for="id in searchCheckboxIds"
          :key="id"
          hover
        >
          <v-hover v-slot:default="{ hover }">
            <v-card-title
              class="checkboxes--title font-weight-bold text-uppercase py-2 px-6"
              style="font-size: 0.875rem;"
              :class="{
                'blue-grey lighten-3': search[id].showCheckboxes,
                'blue-grey lighten-2': search[id].showCheckboxes && hover
              }"
              @click="
                updateSearchField({
                  id: id,
                  showCheckboxes: !search[id].showCheckboxes
                })
              "
            >
              {{ $t(`search.table.${id}`) }}
              <v-spacer />

              <v-tooltip v-if="getActiveCheckboxesCount(id) > 0" top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mr-6"
                    v-bind="attrs"
                    v-on="on"
                    small
                    color="error"
                    icon
                    @click.stop="resetFacet(id)"
                  >
                    <v-badge color="transparent" bottom overlap
                      ><v-icon small>fas fa-trash</v-icon>
                      <template v-slot:badge>
                        <span class="black--text font-weight-bold">{{
                          getActiveCheckboxesCount(id)
                        }}</span>
                      </template>
                    </v-badge>
                  </v-btn>
                </template>
                <span>{{
                  $t("search.drawer.clearFilters", {
                    field: $t(`search.table.${id}`)
                  })
                }}</span>
              </v-tooltip>

              <v-icon v-if="search[id].showCheckboxes">fas fa-angle-up</v-icon>
              <v-icon v-else>fas fa-angle-down</v-icon>
            </v-card-title>
          </v-hover>
          <v-divider />

          <v-expand-transition>
            <v-card-text
              class="transition-fast-in-fast-out pb-0"
              :class="{ 'blue-grey lighten-5': search[id].showCheckboxes }"
              v-if="search[id].showCheckboxes"
            >
              <v-row no-gutters>
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

                <v-col cols="12">
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
                      <v-icon x-small>fas fa-minus</v-icon>
                      {{ $t("search.drawer.less") }}</span
                    >
                    <span v-else
                      ><v-icon x-small>fas fa-plus</v-icon>
                      {{ $t("search.drawer.more") }}</span
                    >
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-expand-transition>
        </v-card>

        <!-- SINGLE CHECKBOXES -->
        <v-list-item v-for="id in searchSingleCheckboxIds" :key="id">
          <v-checkbox
            color="blue-grey darken-3"
            class="mt-0 mb-2"
            :input-value="search[id].value"
            :label="$t(`search.drawer.${id}`)"
            true-value="true"
            :false-value="null"
            @change="updateSearchFieldDebounced({ id: id, value: $event })"
            hide-details
            dense
          />
        </v-list-item>
      </v-list-group>

      <v-divider />

      <!-- EXTRA OPTIONS -->
      <v-list-group
        :value="showExtraOptions"
        active-class="blue-grey lighten-3"
        color="black"
      >
        <template v-slot:activator>
          <v-list-item-title
            class="font-weight-bold text-center text-uppercase"
            style="font-size: 1.15rem;"
            >{{ $t("search.drawer.extraOptions") }}</v-list-item-title
          >
        </template>

        <v-divider />

        <!-- TABLE HEADERS -->
        <!-- Todo: Debounce it! -->
        <v-list-item class="py-2 px-4">
          <v-row no-gutters>
            <v-col cols="12" class="py-1 mb-2">
              <v-checkbox
                color="blue-grey darken-3"
                class="mt-0 mb-2"
                :input-value="isTableHeaderFixed"
                :label="$t('search.drawer.fixedHeaders')"
                @change="updateTableHeaderFixedState($event)"
                hide-details
                dense
              />
            </v-col>

            <v-col cols="12" class="py-1">
              <SelectWrapper
                :items="getAllNonFixedTableHeaders"
                :value="getAllShownTableHeaders"
                chips
                small-chips
                deletable-chips
                multiple
                :label="$t('search.drawer.tableHeaders')"
                @change="updateTableHeaders($event)"
                class="chips-select"
              />
            </v-col>
          </v-row>
        </v-list-item>
      </v-list-group>
      <v-divider />
    </v-list>

    <v-row no-gutters class="px-3 pb-5 mt-1">
      <v-col cols="12" class="d-flex justify-end">
        <v-btn color="error" @click="reset">
          {{ $t("search.drawer.resetSearch") }}
          <v-icon right>far fa-trash-alt</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import TextFieldWrapper from "@/components/input_wrappers/TextFieldWrapper";
import SelectWrapper from "@/components/input_wrappers/SelectWrapper";
import queryMixin from "@/mixins/queryMixin";
import { debounce } from "lodash";
import SearchMap from "@/components/SearchMap";

export default {
  name: "SearchDrawer",

  components: { TextFieldWrapper, SelectWrapper, SearchMap },

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
    showSingleCheckboxes: true,
    showExtraOptions: false
  }),

  computed: {
    ...mapState("search", [
      "lookUpTypes",
      "search",
      "searchTextIds",
      "searchCheckboxIds",
      "searchSingleCheckboxIds",
      "isTableHeaderFixed",
      "responseResults",
      "responseResultsCount"
    ]),
    ...mapGetters("search", [
      "getCheckboxes",
      "getCheckboxesCount",
      "getCheckboxesLength",
      "getActiveCheckboxesCount",
      "getAllNonFixedTableHeaders",
      "getAllShownTableHeaders"
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
    ...mapActions("search", [
      "updateSearchField",
      "resetSearch",
      "updateTableHeaders",
      "updateTableHeaderFixedState",
      "updatePage",
      "updateSortBy",
      "updateSortDesc"
    ]),

    updateSearchFieldDebounced: debounce(function(value) {
      this.updateSearchField(value);
      // #113 removing sorting
      if (value?.id === "q") {
        this.updateSortBy([]);
        this.updateSortDesc([]);
      }
      // #112
      if (this.search.page !== 1) this.updatePage(1);
    }, 300),

    updateCheckbox(event) {
      let e = { ...event };
      if (e.bool) {
        if (e.value) e.value += ` "${e.fieldName}"`;
        else e.value = `"${e.fieldName}"`;
      } else {
        if (e.value) {
          let valueList = e.value.replaceAll('" "', '"|-|"').split("|-|");
          let filteredValues = valueList.filter(
            val => val !== `"${e.fieldName}"`
          );
          e.value = filteredValues.join(" ");
        }
      }
      this.updateSearchField({ id: e.id, value: e.value });
      // #112
      if (this.search.page !== 1) this.updatePage(1);
    },

    reset() {
      this.resetSearch();
    },

    resetFacet(id) {
      this.updateSearchField({
        id: id,
        value: null
      });
      // #112
      if (this.search.page !== 1) this.updatePage(1);
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

.checkboxes > .checkboxes--title:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transition: background-color 100ms ease-in;
}

.checkboxes > .checkboxes--title {
  background-color: unset;
  transition: background-color 100ms ease-out;
}
</style>
