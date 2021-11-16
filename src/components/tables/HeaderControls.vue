<template>
  <!-- NOTE: Using activator now for v-menu.
    Using the #id based implementation broke HeaderControls when switching between tabs.
    Right now the button does not appear immediately when page is loading.
    This is something to do with transitions. https://github.com/vuetifyjs/vuetify/issues/10578
  -->
  <v-menu
    transition="slide-y-transition"
    offset-y
    :close-on-content-click="false"
    z-index="5000"
  >
    <template #activator="menu">
      <v-tooltip bottom open-delay="500" z-index="5000">
        <template #activator="tooltip">
          <v-btn
            icon
            color="primary"
            v-bind="{ ...menu.attrs, ...tooltip.attrs }"
            v-on="{ ...menu.on, ...tooltip.on }"
          >
            <v-icon>mdi-table-cog</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("search.table.tooltipConfig") }}</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-list flat class="">
        <v-list-item-title class="px-2 montserrat align-center">
          {{ $t("search.table.headers") }}
          <v-tooltip bottom open-delay="500" z-index="5000">
            <template #activator="{ on, attrs }">
              <v-btn
                color="red"
                v-bind="attrs"
                icon
                v-on="on"
                @click="$emit('reset')"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            {{ $t("search.table.tooltipResetHeaders") }}
          </v-tooltip>

          <v-tooltip open-delay="500" bottom z-index="5000">
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                color="blue"
                v-on="on"
                @click="onlyVisible = !onlyVisible"
              >
                <v-icon v-if="!onlyVisible">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
              </v-btn>
            </template>
            <span v-if="!onlyVisible">
              {{ $t("search.table.tooltipShowActiveHeaders") }}
            </span>
            <span v-else>{{ $t("search.table.tooltipShowAllHeaders") }}</span>
          </v-tooltip>

          <v-tooltip bottom open-delay="500" z-index="50000">
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                v-on="on"
                @click="$emit('toggle', isTableHeaderFixed)"
              >
                <v-icon v-if="isTableHeaderFixed">mdi-table-off</v-icon>
                <v-icon v-else>mdi-table-border</v-icon>
              </v-btn>
            </template>
            <span v-if="isTableHeaderFixed">{{
              $t("search.table.tooltipRemoveFixedHeaders")
            }}</span>
            <span v-else>{{ $t("search.table.tooltipAddFixedHeaders") }}</span>
          </v-tooltip>

          <v-text-field
            v-model="filter"
            class="py-2"
            dense
            hide-details
            :label="$t('search.table.filter')"
          />
        </v-list-item-title>
        <v-list-item-group :value="visibleHeaders" multiple>
          <v-virtual-scroll
            :items="
              (onlyVisible ? visibleHeaders : headers) | filterHeaders(filter)
            "
            height="500"
            item-height="35"
            width="300"
            :bench="20"
            multiple
          >
            <template #default="{ item }">
              <v-tooltip
                left
                :disabled="!sortBy.includes(item.value)"
                z-index="5000"
              >
                <template #activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-list-item
                      dense
                      :disabled="sortBy.includes(item.value)"
                      :value="item"
                      @click="$emit('change', item)"
                    >
                      <v-list-item-action class="my-2 mr-2">
                        <v-checkbox
                          dense
                          :disabled="sortBy.includes(item.value)"
                          :input-value="item.show"
                        />
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title
                          v-if="item.text !== ''"
                          v-text="item.text"
                        />
                        <v-list-item-title v-else>Icon</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </div>
                </template>
                {{ $t("search.table.headerSelectDisabled") }}
              </v-tooltip>
            </template>
          </v-virtual-scroll>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "HeaderControls",
  filters: {
    filterHeaders(headers, filter) {
      return headers.filter((header) =>
        header.text.toLowerCase().includes(filter.toLowerCase())
      );
    },
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    visibleHeaders: {
      type: Array,
      default: () => [],
    },
    sortBy: {
      type: Array,
      default: () => [],
    },
    isTableHeaderFixed: Boolean,
  },
  data() {
    return {
      onlyVisible: false,
      filter: "",
    };
  },
};
</script>
