<template>
  <v-card flat>
    <v-data-table
      :fixed-header="isTableHeaderFixed"
      :height="isTableHeaderFixed ? tableHeight : '100%'"
      class="table"
      id="table"
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
      @update:options="updateTableOptions"
    >
      <template v-slot:no-data>
        <v-row no-gutters class="my-4" justify="center">
          <v-col cols="12" style="max-width: 500px">
            <v-alert
              class="mb-0"
              text
              border="left"
              icon="fas fa-search"
              color="secondary"
            >
              <div>
                {{ $t("search.tableNoResults") }}
              </div>

              <div>
                <v-btn x-small color="error" @click="resetSearch">
                  {{ $t("search.drawer.resetSearch") }}
                  <v-icon x-small right>far fa-trash-alt</v-icon>
                </v-btn>
              </div>
            </v-alert>
          </v-col>
        </v-row>
      </template>

      <template #top="{ pagination, updateOptions, options }">
        <div class="table-top">
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="auto"
              class="px-3 my-1 my-sm-3"
              align-self="center"
            >
              <export-controls />
              <header-controls
                :headers="translatedTableHeaders"
                :visible-headers="getAllShownTableHeaders"
                :sort-by="options.sortBy"
                :is-table-header-fixed="isTableHeaderFixed"
                @change="handleHeadersChange"
                @reset="resetTableHeaders"
                @toggle="updateTableHeaderFixedState(!$event)"
              />
            </v-col>
            <v-col>
              <pagination-controls
                :options="options"
                :pagination="pagination"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="footerProps['items-per-page-text']"
                :page-select-text="
                  $t('search.table.pageSelect', {
                    current: options.page,
                    count: pagination.pageCount,
                  })
                "
                :go-to-text="$t('search.table.goTo')"
                :go-to-button-text="$t('search.table.goToBtn')"
                select-page-id="header-select-btn"
                @update:options="updateOptions"
              />
            </v-col>
          </v-row>
        </div>
      </template>

      <template #footer="{ props }">
        <div class="table-footer">
          <pagination-controls
            class="py-3"
            :options="props.options"
            :pagination="props.pagination"
            :items-per-page-options="footerProps['items-per-page-options']"
            :items-per-page-text="footerProps['items-per-page-text']"
            :page-select-text="
              $t('search.table.pageSelect', {
                current: props.options.page,
                count: props.pagination.pageCount,
              })
            "
            :go-to-text="$t('search.table.goTo')"
            :go-to-button-text="$t('search.table.goToBtn')"
            select-page-id="footer-select-btn"
            @update:options="updateTableOptions($event)"
          />
        </div>
      </template>

      <template v-slot:item.icon="{ item }">
        <router-link
          class="icon-link"
          style="text-decoration: unset"
          :to="{ path: `specimen/${item.id}` }"
          :title="$t('search.goToDetailView')"
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
          style="text-decoration: unset"
          :to="{ path: `specimen/${item.id}` }"
          :title="$t('search.goToDetailView')"
        >
          {{ item.unitid }}
        </router-link>
      </template>

      <template v-slot:item.fullscientificname="{ item }">
        <div v-if="item.mindat_id">
          <a
            style="text-decoration: unset; white-space: nowrap"
            target="MindatWindow"
            :title="$t('search.mindatLink')"
            @click="openUrlInNewWindow(item.mindat_url)"
            >{{ item.fullscientificname }}
            <v-icon small color="primary"
              >fas fa-external-link-square-alt</v-icon
            >
          </a>
        </div>
        <div v-else-if="item.meteorite_id">
          <a
            style="text-decoration: unset; white-space: nowrap"
            target="MeteoriteWindow"
            :title="$t('search.mindatLink')"
            @click="
              openUrlInNewWindow(
                `https://www.lpi.usra.edu/meteor/metbull.php?code=${item.meteorite_id}`
              )
            "
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

      <template v-slot:item.stratigraphy="{ item }">
        <div v-if="item.stratigraphies">
          <ul style="list-style-type: circle">
            <li v-for="(item, index) in item.stratigraphies" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div v-else-if="item.stratigraphytexts">
          <ul style="list-style-type: circle">
            <li v-for="(item, index) in item.stratigraphytexts" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </template>

      <template v-slot:item.url="{ item }">
        <v-btn
          v-if="item.has_image"
          icon
          :title="$t('search.openGallery')"
          small
          color="primary"
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
import { mapActions, mapGetters, mapState } from "vuex";
import HeaderControls from "@/components/tables/HeaderControls";
import PaginationControls from "@/components/tables/PaginationControls";
import ExportControls from "@/components/tables/ExportControls";

export default {
  name: "TabTable",
  components: { ExportControls, PaginationControls, HeaderControls },
  props: {
    responseResults: {
      type: Array,
      required: true,
    },
    responseResultsCount: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    paginateBy: {
      type: Number,
      required: true,
    },
    sortBy: {
      type: Array,
      required: true,
    },
    sortDesc: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: Number,
    },
  },

  data() {
    return {
      tableHeight: "100%",
      footerProps: {
        showFirstLastPage: true,
        "items-per-page-options": [10, 25, 50, 100, 250, 500, 1000],
        // Todo: Translation is updated only on reload, fix that, add it to computed or sth
        "items-per-page-text": this.$t("frontPage.map.itemsPerPageText"),
      },
    };
  },

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
      immediate: true,
    },
  },

  computed: {
    ...mapState("search", ["isTableHeaderFixed"]),
    ...mapGetters("search", [
      "getAllShownTableHeaders",
      "translatedTableHeaders",
    ]),
  },

  methods: {
    ...mapActions("search", [
      "resetSearch",
      "updateTableHeaders",
      "resetTableHeaders",
      "updateTableHeaderFixedState",
    ]),

    calculateTableHeight: throttle(function () {
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
      let recordsFoundHeight =
        document.getElementsByClassName("records-found")?.[0]?.clientHeight;
      let tabsHeight =
        document.getElementsByClassName("v-tabs")?.[0]?.clientHeight;
      let tableTop =
        document.getElementsByClassName("table-top")?.[0]?.clientHeight;
      let tableFooter =
          document.getElementsByClassName("table-footer")?.[0]?.clientHeight;

      // Defaults
      if (!recordsFoundHeight) recordsFoundHeight = 48;
      if (!tabsHeight) tabsHeight = 42;
      if (!tableTop) tableTop = 60;
      if (!tableFooter) tableFooter = 68;
      if (this.$vuetify.breakpoint.mdAndUp) {
        // 2 is for any rounding errors
        let height =
          innerHeight -
          appTop -
          paddingTotal -
          recordsFoundHeight -
          tabsHeight -
          tableTop -
          tableFooter -
          appBottom -
          2;

        if (height < 500) this.tableHeight = "100%";
        else this.tableHeight = height;
      } else this.tableHeight = "100%";
    }, 400),

    openUrlInNewWindow(url) {
      window.open(url, "MindatWindow", "width=800,height=750");
    },

    /* Currently unused types aka unspecified
     * OtherSpecimen
     * Unspecified
     * specimen
     */
    getItemType(item) {
      let type = item.recordbasis;
      if (type === "Fossil") {
        return "fossil";
      } else if (type === "Mineral") {
        return "mineral";
      } else if (type === "Rock") {
        return "rock";
      } else if (type === "Meteorite") {
        return "meteorite";
      } else "none";
    },

    handleHeadersChange(event) {
      let listOfAllShownTableHeaders = this.getAllShownTableHeaders.map(
        (item) => item.value
      );

      if (listOfAllShownTableHeaders.includes(event.value))
        listOfAllShownTableHeaders = listOfAllShownTableHeaders.filter(
          (item) => item !== event.value
        );
      else listOfAllShownTableHeaders.push(event.value);

      this.updateTableHeaders(listOfAllShownTableHeaders);
    },

    updateTableOptions(options) {
      if (this.page !== options.page) this.$emit("update:page", options.page);
      if (this.paginateBy !== options.itemsPerPage)
        this.$emit("update:paginateBy", options.itemsPerPage);
    },
  },
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

.table >>> .sorting-disabled {
  background-color: #eceff1 !important;
}
</style>
