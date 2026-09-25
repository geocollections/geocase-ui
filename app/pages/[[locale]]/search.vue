<script setup>
import { useI18n } from "vue-i18n";
import ActiveSearchFilters from "@/components/search/ActiveSearchFilters.vue";

definePageMeta({ name: "Search", path: "/:locale(en|ee|de)?/search" });
const { t } = useI18n();
useHead(() => ({ title: t("header.search") }));
</script>

<template>
  <div class="tw:bg-muted/30 tw:min-h-full tw:p-3 tw:sm:p-5">
    <ScrollToTop />

    <UCard
      variant="outline"
      class="tw:overflow-hidden"
      :ui="{ body: 'tw:p-0 tw:sm:p-0' }"
    >
      <header
        class="tw:flex tw:items-center tw:justify-between tw:gap-4 tw:px-4 tw:py-5 tw:sm:px-6"
      >
        <div aria-live="polite">
          <h1
            class="tw:text-highlighted tw:text-2xl tw:font-bold tw:tracking-tight tw:sm:text-3xl"
          >
            {{ responseResultsCount.toLocaleString() }}
            {{ $t("search.recordsFound", responseResultsCount) }}
          </h1>
          <p v-if="tab === 1" class="tw:mt-2 tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-muted">
            <UIcon name="i-lucide-images" class="tw:size-4 tw:shrink-0" aria-hidden="true" />
            {{ $t("search.imagesOnlyNotice") }}
          </p>
        </div>
        <UBadge
          color="neutral"
          variant="soft"
          size="lg"
          class="tw:sm:hidden"
        >
          {{ `${$t("search.page")} ${page}` }}
        </UBadge>
      </header>

      <ActiveSearchFilters />

      <USeparator />

      <UTabs
        v-model="tab"
        :items="viewTabs"
        :unmount-on-hide="false"
        color="primary"
        variant="link"
        size="lg"
        :ui="{
          root: 'tw:gap-0',
          list: 'tw:overflow-x-auto tw:border-b tw:border-default tw:px-2 tw:sm:px-4',
          trigger: 'tw:min-w-32 tw:flex-none tw:sm:flex-1',
          content: 'tw:rounded-none tw:p-0',
        }"
      >
        <template #table>
          <TabTable
            :response-results="responseResults"
            :response-results-count="responseResultsCount"
            :page="page"
            :paginate-by="paginateBy"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            :is-loading="isLoading"
            :tab-index="tab"
            @sort-by:changed="updateSortBy($event)"
            @sort-desc:changed="updateSortDesc($event)"
            @update:page="updatePage($event)"
            @update:paginate-by="updatePaginateBy($event)"
            @open:gallery="openGallery"
          />
        </template>

        <template #images>
          <TabImages
            ref="imageTab"
            :response-results="responseResults"
            :response-results-count="responseResultsCount"
          />
        </template>

        <template #map>
          <TabMap
            ref="map"
            :response-results="responseResults"
            :response-results-count="responseResultsCount"
          />
        </template>
      </UTabs>

      <Pagination
        v-if="tab === 1 && responseResultsCount > 10"
        :paginate-by="paginateBy"
        :paginate-by-items="paginateByItemsTranslated"
        :results="responseResults"
        :page="page"
        :number-of-results="responseResultsCount"
        class="tw:border-t tw:border-default tw:px-4 tw:py-3"
        @update:paginate-by="updatePaginateBy($event)"
        @update:page="updatePage($event)"
      />
    </UCard>
  </div>
</template>

<script>
import { useSearchStore } from "@/stores/search";

import ScrollToTop from "@/components/ScrollToTop.vue";
import { mapActions, mapState } from "pinia";
import queryMixin from "@/mixins/queryMixin";
import Pagination from "@/components/search/Pagination.vue";
import TabImages from "@/components/tabs/TabImages.vue";
import TabMap from "@/components/tabs/TabMap.vue";
import TabTable from "@/components/tabs/TabTable.vue";
import { debounce } from "lodash";

export default {
  name: "SearchPage",

  components: {
    TabTable,
    TabMap,
    TabImages,
    Pagination,
    ScrollToTop,
  },

  mixins: [queryMixin],

  data: () => ({
    tab: 0,
    previousImageFilter: undefined,
    imageFilterAddedByTab: false,
  }),

  computed: {
    ...mapState(useSearchStore, [
      "responseResults",
      "responseResultsCount",
      "page",
      "paginateBy",
      "sortBy",
      "sortDesc",
      "isLoading",
    ]),
    ...mapState(useSearchStore, ["paginateByItemsTranslated"]),
    viewTabs() {
      return [
        {
          label: this.$t("search.tab.table"),
          icon: "i-lucide-table-2",
          value: 0,
          slot: "table",
        },
        {
          label: this.$t("search.tab.images"),
          icon: "i-lucide-images",
          value: 1,
          slot: "images",
        },
        {
          label: this.$t("search.tab.map"),
          icon: "i-lucide-map",
          value: 2,
          slot: "map",
        },
      ];
    },
  },

  created() {
    if (this.$route.query) {
      this.deconstructQueryParams(this.$route.query);
      this.fetchResults();
    }
  },

  watch: {
    "$route.query"(newVal, oldVal) {
      if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        const store = useSearchStore();
        const geometry = store.search.map.value;
        store.resetSearch();
        store.updateSearchField({ id: "map", value: geometry });
        this.deconstructQueryParams(newVal);
        this.fetchResults();
      }
    },
    page: debounce(function (newVal) {
      this.constructQueryParams(null, { page: newVal.toString() });
    }, 300),
    paginateBy: debounce(function (newVal) {
      this.constructQueryParams(null, { paginate_by: newVal.toString() });
    }, 300),
    sortDesc: debounce(function (newVal) {
      this.constructQueryParams(null, {
        sort_desc: newVal,
        sort_by: this.sortBy,
      });
    }, 300),
    tab(newVal, oldVal) {
      if (newVal === 1) {
        this.previousImageFilter = this.$route.query.has_image;
        this.imageFilterAddedByTab = this.previousImageFilter !== "true";
        if (this.imageFilterAddedByTab) {
          this.$router.push({
            path: this.$route.path,
            query: { ...this.$route.query, has_image: "true", page: "1" },
            hash: this.$route.hash,
          });
        }
      } else if (oldVal === 1 && this.imageFilterAddedByTab) {
        const query = { ...this.$route.query, page: "1" };
        if (this.previousImageFilter === undefined) delete query.has_image;
        else query.has_image = this.previousImageFilter;
        this.imageFilterAddedByTab = false;
        this.$router.push({ path: this.$route.path, query, hash: this.$route.hash });
      }
      if (newVal === 2 && this.$refs?.map?.map) {
        setTimeout(() => {
          this.$refs.map.map.invalidateSize();
        }, 100);
      }
    },
  },

  methods: {
    ...mapActions(useSearchStore, [
      "updatePage",
      "updatePaginateBy",
      "updateSortBy",
      "updateSortDesc",
      "fetchResults",
    ]),


    async openGallery(image) {
      this.tab = 1;
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.$refs.imageTab.openDialogUsingImage(image);
    },

    updateSearchParamDebounced: debounce(function (action, value) {
      action(value);
    }, 300),
  },
};
</script>
