<template>
  <v-card flat>
    <v-data-table
      :fixed-header="isTableHeaderFixed"
      :height="isTableHeaderFixed ? tableHeight : '100%'"
      class="table"
      mobile-breakpoint="0"
      dense
      hide-default-footer
      :headers="getAllShownTableHeaders"
      :items="responseResults"
      :items-per-page="paginateBy"
      multi-sort
      :page="page"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      @update:sort-by="$emit('sortBy:changed', $event)"
      @update:sort-desc="$emit('sortDesc:changed', $event)"
      :server-items-length="responseResultsCount"
      :loading="isLoading"
    >
      <template v-slot:no-data>
        <v-row class="mx-0" justify="center">
          <v-col cols="12" style="max-width: 500px;">
            <v-alert
              class="mb-0"
              text
              border="left"
              icon="fas fa-search"
              color="secondary"
            >
              Couldn't find any records with these search parameters.
            </v-alert>
          </v-col>
        </v-row>
      </template>

      <template v-slot:item.icon="{ item }">
        <router-link
          class="icon-link"
          style="text-decoration: unset;"
          :to="{ path: `specimen/${item.id}` }"
          title="Go to detail view"
        >
          <v-icon small color="primary" v-if="getItemType(item) === 'fossil'"
            >fas fa-fish</v-icon
          >
          <v-icon
            small
            color="primary"
            v-else-if="getItemType(item) === 'mineral'"
            >far fa-gem</v-icon
          >
          <v-icon small color="primary" v-else-if="getItemType(item) === 'rock'"
            >fas fa-mountain</v-icon
          >
          <v-icon
            small
            color="primary"
            v-else-if="getItemType(item) === 'meteorite'"
            >fas fa-meteor</v-icon
          >
        </router-link>
      </template>

      <template v-slot:item.unitid="{ item }">
        <router-link
          style="text-decoration: unset;"
          :to="{ path: `specimen/${item.id}` }"
          title="Go to detail view"
        >
          {{ item.unitid }}
        </router-link>
      </template>

      <template v-slot:item.fullscientificname="{ item }">
        <div v-if="item.mindat_id">
          <a
            style="text-decoration: unset; white-space: nowrap;"
            target="MindatWindow"
            title="Link to Mindat.org"
            @click="openMindatInNewWindow(item.mindat_url)"
            >{{ item.fullscientificname }}
            <v-icon small color="primary"
              >fas fa-external-link-square-alt</v-icon
            >
          </a>
        </div>
        <div v-else>{{ item.fullscientificname }}</div>
      </template>

      <template v-slot:item.recordURI="{ item }">
        <v-btn
          v-if="item.recordURI"
          icon
          :title="item.recordURI"
          :href="item.recordURI"
          target="RecordWindow"
          color="primary"
          small
        >
          <v-icon small>fas fa-external-link-alt</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.url="{ item }">
        <v-btn
          v-if="item.has_image"
          icon
          title="Open gallery"
          small
          @click="$emit('open:gallery', item.images[0])"
        >
          <v-icon small>far fa-image</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { throttle } from "lodash";
import { mapGetters, mapState } from "vuex";

export default {
  name: "TabTable",
  props: {
    responseResults: {
      type: Array,
      required: true
    },
    responseResultsCount: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    },
    paginateBy: {
      type: Number,
      required: true
    },
    sortBy: {
      type: Array,
      required: true
    },
    sortDesc: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      type: Number
    }
  },

  data: () => ({
    tableHeight: "100%"
  }),

  beforeDestroy() {
    window.removeEventListener("resize", this.calculateTableHeight);
  },

  watch: {
    tabIndex: {
      handler(newVal) {
        if (newVal === 0) {
          window.addEventListener("resize", this.calculateTableHeight);
          this.calculateTableHeight();
        } else window.removeEventListener("resize", this.calculateTableHeight);
      },
      immediate: true
    }
  },

  computed: {
    ...mapState("search", ["isTableHeaderFixed"]),
    ...mapGetters("search", ["getAllShownTableHeaders"])
  },

  methods: {
    calculateTableHeight: throttle(function() {
      let innerHeight = window?.innerHeight;
      let paddingTotal = 24;
      let appTop =
        this.$vuetify.application.top !== 0
          ? this.$vuetify.application.top
          : 64;
      let appBottom =
        this.$vuetify.application.footer !== 0
          ? this.$vuetify.application.footer
          : 192;
      let recordsFoundHeight = document.getElementsByClassName(
        "records-found"
      )?.[0]?.clientHeight;
      let tabsHeight = document.getElementsByClassName("v-tabs")?.[0]
        ?.clientHeight;
      let paginationHeight = document.getElementsByClassName("pagination")?.[0]
        ?.clientHeight;

      // Defaults
      if (!recordsFoundHeight) recordsFoundHeight = 48;
      if (!tabsHeight) tabsHeight = 42;
      if (!paginationHeight) {
        if (this.$vuetify.breakpoint.lgAndUp) paginationHeight = 60;
        else paginationHeight = 142;
      }

      if (this.$vuetify.breakpoint.mdAndUp) {
        // 2 is for any rounding errors
        let height =
          innerHeight -
          appTop -
          paddingTotal -
          recordsFoundHeight -
          tabsHeight -
          paginationHeight -
          appBottom -
          2;

        if (height < 500) this.tableHeight = "100%";
        else this.tableHeight = height;
      } else this.tableHeight = "100%";
    }, 400),

    openMindatInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
    },

    /* Currently unused types aka unspecified
     * OtherSpecimen
     * Unspecified
     * specimen
     */
    getItemType(item) {
      let type = item.recordbasis;
      if (
        type === "FossileSpecimen" ||
        type === "FossilSpecimen" ||
        type === "RecentPreservedSpecimen" ||
        type === "fossil"
      ) {
        return "fossil";
      } else if (type === "MineralSpecimen") {
        return "mineral";
      } else if (
        type === "RockSpecimen" ||
        type === "SedimentSample" ||
        type === "TechnologicalSample"
      ) {
        return "rock";
      } else if (type === "MeteoriteSpecimen") {
        return "meteorite";
      } else "none";
    }
  }
};
</script>

<style scoped>
.image-link {
  border-radius: 4px;
}
.image-link:hover {
  cursor: pointer;
  opacity: 0.8;
}

.icon-link:hover {
  opacity: 0.7;
}

.table >>> tbody tr:nth-child(even) {
  background-color: #eceff1;
}

.table >>> th.sortable {
  white-space: nowrap;
}
.table >>> th.sortable > span:after {
  content: "\00a0";
}

.table >>> tbody > tr > td:first-child {
  padding: 4px;
}

.table >>> tbody > tr > td:first-child,
.table >>> thead > tr > th:first-child {
  padding: 0 8px;
}
</style>
