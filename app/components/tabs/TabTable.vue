<template>
  <v-card flat>
    <v-data-table-server
      :fixed-header="isTableHeaderFixed"
      :height="isTableHeaderFixed ? tableHeight : '100%'"
      class="table"
      id="table"
      mobile-breakpoint="0"
      density="compact"
      hide-default-footer
      :headers="getAllShownTableHeaders"
      :items="responseResults"
      :items-per-page="paginateBy"
      multi-sort
      :page="page"
      :sort-by="tableSort"
      @update:sort-by="updateTableSort"
      :items-length="responseResultsCount"
      :loading="isLoading"
      @update:options="updateTableOptions"
    >
      <template v-slot:no-data>
        <v-row no-gutters class="my-4" justify="center">
          <v-col cols="12" style="max-width: 500px">
            <v-alert
              class="mb-0"
              variant="tonal"
              border="start"
              icon="fa:fas fa-search"
              color="secondary"
            >
              <div>
                {{ $t("search.tableNoResults") }}
              </div>

              <div>
                <v-btn size="x-small" color="error" @click="resetSearch">
                  {{ $t("search.drawer.resetSearch") }}
                  <v-icon size="x-small" end>fa:far fa-trash-alt</v-icon>
                </v-btn>
              </div>
            </v-alert>
          </v-col>
        </v-row>
      </template>

      <template #top>
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
                :sort-by="sortBy"
                :is-table-header-fixed="isTableHeaderFixed"
                @change="handleHeadersChange"
                @reset="resetTableHeaders"
                @toggle="updateTableHeaderFixedState(!$event)"
              />
            </v-col>
            <v-col>
              <pagination-controls
                :options="tableOptions"
                :pagination="tablePagination"
                :items-per-page-options="footerProps['items-per-page-options']"
                :items-per-page-text="footerProps['items-per-page-text']"
                :page-select-text="
                  $t('search.table.pageSelect', {
                    current: page,
                    count: tablePagination.pageCount,
                  })
                "
                :go-to-text="$t('search.table.goTo')"
                :go-to-button-text="$t('search.table.goToBtn')"
                select-page-id="header-select-btn"
                @update:options="updateTableOptions"
              />
            </v-col>
          </v-row>
        </div>
      </template>

      <template #bottom>
        <div class="table-footer">
          <pagination-controls
            class="py-3"
            :options="tableOptions"
            :pagination="tablePagination"
            :items-per-page-options="footerProps['items-per-page-options']"
            :items-per-page-text="footerProps['items-per-page-text']"
            :page-select-text="
              $t('search.table.pageSelect', {
                current: page,
                count: tablePagination.pageCount,
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
        <NuxtLink
          class="icon-link"
          style="text-decoration: unset"
          :to="{ path: `specimen/${encodeURIComponent(item.geocase_id)}` }"
          :title="$t('search.goToDetailView')"
        >
          <v-icon
            size="small"
            color="primary"
            v-if="getItemType(item) === 'fossil'"
            >fa:fas fa-fish</v-icon
          >
          <v-icon
            size="small"
            color="primary"
            v-else-if="getItemType(item) === 'mineral'"
            >fa:far fa-gem</v-icon
          >
          <v-icon
            size="small"
            color="primary"
            v-else-if="getItemType(item) === 'rock'"
            >fa:fas fa-mountain</v-icon
          >
          <v-icon
            size="small"
            color="primary"
            v-else-if="getItemType(item) === 'meteorite'"
            >fa:fas fa-meteor</v-icon
          >
        </NuxtLink>
      </template>

      <template v-slot:item.unitid="{ item }">
        <NuxtLink
          style="text-decoration: unset"
          :to="{ path: `specimen/${encodeURIComponent(item.geocase_id)}` }"
          :title="$t('search.goToDetailView')"
        >
          {{ item.unitid }}
        </NuxtLink>
      </template>

      <template v-slot:item.fullscientificname="{ item }">
        <div v-if="item.mindat_id">
          <a
            style="text-decoration: unset; white-space: nowrap"
            target="MindatWindow"
            :title="$t('search.mindatLink')"
            @click="openUrlInNewWindow(item.mindat_url)"
            >{{ item.fullscientificname }}
            <v-icon size="small" color="primary"
              >fa:fas fa-external-link-square-alt</v-icon
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
                `https://www.lpi.usra.edu/meteor/metbull.php?code=${item.meteorite_id}`,
              )
            "
            >{{ item.fullscientificname }}
            <v-icon size="small" color="primary"
              >fa:fas fa-external-link-square-alt</v-icon
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
          size="small"
        >
          <v-icon size="small">fa:fas fa-external-link-alt</v-icon>
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
          size="small"
          color="primary"
          @click="$emit('open:gallery', item.images[0])"
        >
          <v-icon size="small">fa:far fa-image</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script>
import { useSearchStore } from "@/stores/search";

import { throttle } from "lodash";
import { mapActions, mapState } from "pinia";
import HeaderControls from "@/components/tables/HeaderControls.vue";
import PaginationControls from "@/components/tables/PaginationControls.vue";
import ExportControls from "@/components/tables/ExportControls.vue";

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
        "items-per-page-text": this.$t("frontPage.map.itemsPerPageText"),
      },
    };
  },

  beforeUnmount() {
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
    tableSort() {
      return this.sortBy.map((key, index) => ({
        key,
        order: this.sortDesc[index] ? "desc" : "asc",
      }));
    },
    tableOptions() {
      return { page: this.page, itemsPerPage: this.paginateBy };
    },
    tablePagination() {
      return {
        page: this.page,
        itemsLength: this.responseResultsCount,
        pageCount: Math.max(
          1,
          Math.ceil(this.responseResultsCount / this.paginateBy),
        ),
        pageStart: (this.page - 1) * this.paginateBy,
        pageStop: Math.min(
          this.page * this.paginateBy,
          this.responseResultsCount,
        ),
      };
    },
    ...mapState(useSearchStore, ["isTableHeaderFixed"]),
    ...mapState(useSearchStore, [
      "getAllShownTableHeaders",
      "translatedTableHeaders",
    ]),
  },

  methods: {
    updateTableSort(sort) {
      this.$emit(
        "sortBy:changed",
        sort.map((item) => item.key),
      );
      this.$emit(
        "sortDesc:changed",
        sort.map((item) => item.order === "desc"),
      );
    },
    ...mapActions(useSearchStore, [
      "resetSearch",
      "updateTableHeaders",
      "resetTableHeaders",
      "updateTableHeaderFixedState",
    ]),

    calculateTableHeight: throttle(function () {
      let innerHeight = window?.innerHeight;
      let paddingTotal = 24;
      const appTop = 64;
      const appBottom = 192;
      let recordsFoundHeight =
        document.getElementsByClassName("records-found")?.[0]?.clientHeight;
      let tabsHeight =
        document.getElementsByClassName("v-tabs")?.[0]?.clientHeight;
      let tableTop =
        document.getElementsByClassName("table-top")?.[0]?.clientHeight;
      let tableFooter =
        document.getElementsByClassName("table-footer")?.[0]?.clientHeight;

      if (!recordsFoundHeight) recordsFoundHeight = 48;
      if (!tabsHeight) tabsHeight = 42;
      if (!tableTop) tableTop = 60;
      if (!tableFooter) tableFooter = 68;
      if (this.$vuetify.display.mdAndUp) {
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
      } else return "none";
    },

    handleHeadersChange(event) {
      let listOfAllShownTableHeaders = this.getAllShownTableHeaders.map(
        (item) => item.value,
      );

      if (listOfAllShownTableHeaders.includes(event.value))
        listOfAllShownTableHeaders = listOfAllShownTableHeaders.filter(
          (item) => item !== event.value,
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

.table :deep(tbody tr:nth-child(even)) {
  background-color: #eceff1;
}

.table :deep(th.sortable) {
  white-space: nowrap;
}
.table :deep(th.sortable > span:after) {
  content: "\00a0";
}

.table :deep(tbody > tr > td:first-child) {
  padding: 4px;
}

.table :deep(tbody > tr > td:first-child),
.table :deep(thead > tr > th:first-child) {
  padding: 0 8px;
}

.table :deep(.sorting-disabled) {
  background-color: #eceff1 !important;
}
</style>
