<template>
  <v-menu
    transition="slide-y-transition"
    offset="8"
    :close-on-content-click="false"
    z-index="5000"
  >
    <template #activator="menu">
      <v-tooltip location="bottom" open-delay="500" z-index="5000">
        <template #activator="tooltip">
          <v-btn
            icon
            color="primary"
            v-bind="mergeProps(menu.props, tooltip.props)"
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
          <v-tooltip location="bottom" open-delay="500" z-index="5000">
            <template #activator="{ props }">
              <v-btn color="red" v-bind="props" icon @click="$emit('reset')">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            {{ $t("search.table.tooltipResetHeaders") }}
          </v-tooltip>

          <v-tooltip open-delay="500" location="bottom" z-index="5000">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                color="blue"
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

          <v-tooltip location="bottom" open-delay="500" z-index="50000">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon
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
            density="compact"
            hide-details
            :label="$t('search.table.filter')"
          />
        </v-list-item-title>
        <div>
          <v-virtual-scroll
            :items="
              filterHeaders(onlyVisible ? visibleHeaders : headers, filter)
            "
            height="500"
            item-height="35"
            width="300"
            :bench="20"
            multiple
          >
            <template #default="{ item }">
              <v-tooltip
                location="left"
                :disabled="!sortBy.includes(item.value)"
                z-index="5000"
              >
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-list-item
                      density="compact"
                      :disabled="sortBy.includes(item.value)"
                      :value="item"
                      @click="$emit('change', item)"
                    >
                      <v-list-item-action class="my-2 mr-2">
                        <v-checkbox
                          density="compact"
                          :disabled="sortBy.includes(item.value)"
                          :model-value="item.show"
                        />
                      </v-list-item-action>
                      <div>
                        <v-list-item-title v-if="item.text !== ''">{{
                          item.text
                        }}</v-list-item-title>
                        <v-list-item-title v-else>Icon</v-list-item-title>
                      </div>
                    </v-list-item>
                  </div>
                </template>
                {{ $t("search.table.headerSelectDisabled") }}
              </v-tooltip>
            </template>
          </v-virtual-scroll>
        </div>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { mergeProps } from "vue";
export default {
  name: "HeaderControls",
  methods: {
    mergeProps,
    filterHeaders(headers, filter) {
      return headers.filter((header) =>
        header.text.toLowerCase().includes(filter.toLowerCase()),
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
