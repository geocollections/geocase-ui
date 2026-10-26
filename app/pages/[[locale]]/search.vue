<script setup>
import { ref, watch } from "vue";
import { useRoute } from "#imports";
import { useI18n } from "vue-i18n";
import SearchResultsMap from "@/components/search/SearchResultsMap.vue";
import ImageOverflow from "@/components/image/ImageOverflow.vue";
import SearchFiltersToolbar from "@/components/search/SearchFiltersToolbar.vue";
import ActiveSearchFilters from "@/components/search/ActiveSearchFilters.vue";

definePageMeta({ name: "Search", path: "/:locale(en|ee|de)?/search" });
const { t } = useI18n();
const route = useRoute();
const copyLinkStatus = ref("");
const copyingLink = ref(false);
async function copySearchLink() {
  copyingLink.value = true;
  copyLinkStatus.value = "";
  try {
    await navigator.clipboard.writeText(window.location.href);
    copyLinkStatus.value = "search.linkCopied";
  } catch {
    copyLinkStatus.value = "search.linkCopyFailed";
  } finally {
    copyingLink.value = false;
  }
}
watch(
  () => route.fullPath,
  () => {
    copyLinkStatus.value = "";
  },
);
watch(
  () => route.fullPath,
  (path) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("geocase:last-search-path", path);
    }
  },
  { immediate: true },
);
useHead(() => ({ title: t("header.search") }));
</script>

<template>
  <div class="mobile-touch-controls tw:bg-muted/30 tw:min-h-full tw:p-3 tw:sm:p-5">
    <ScrollToTop />
    <SearchFiltersToolbar />

    <UCard
      variant="outline"
      class="tw:overflow-hidden"
      :ui="{ body: 'tw:p-0 tw:sm:p-0' }"
    >
      <header
        class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-2 tw:px-3 tw:py-3 tw:sm:gap-4 tw:sm:px-6 tw:sm:py-5"
      >
        <div aria-live="polite">
          <h1
            class="tw:text-highlighted tw:text-lg tw:font-bold tw:tracking-tight tw:sm:text-3xl"
          >
            {{ responseResultsCount.toLocaleString() }}
            {{ $t("search.recordsFound", responseResultsCount) }}
          </h1>
          <p
            v-if="tab === 1"
            class="tw:mt-2 tw:flex tw:items-center tw:gap-2 tw:text-sm tw:text-muted"
          >
            <UIcon
              name="i-lucide-images"
              class="tw:size-4 tw:shrink-0"
              aria-hidden="true"
            />
            {{ $t("search.imagesOnlyNotice") }}
          </p>
        </div>
        <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
          <div>
            <UButton
              icon="i-lucide-link"
              color="neutral"
              variant="outline"
              :aria-label="t('search.copySearchLink')"
              :loading="copyingLink"
              @click="copySearchLink"
            ><span class="tw:hidden tw:sm:inline">{{ t("search.copySearchLink") }}</span></UButton>
            <p
              v-if="copyLinkStatus"
              role="status"
              aria-live="polite"
              class="tw:mt-1 tw:text-xs tw:text-muted"
            >
              {{ copyLinkStatus ? t(copyLinkStatus) : "" }}
            </p>
          </div>

        </div>
      </header>

      <ActiveSearchFilters />

      <SearchResultsMap />

      <div
        class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:border-t tw:border-default tw:px-4 tw:py-3 tw:sm:px-6"
      >
        <h2 class="tw:sr-only tw:text-base tw:font-semibold tw:sm:not-sr-only">
          {{ $t("search.layout.results") }}
        </h2>
        <UTabs
          v-model="tab"
          :items="viewTabs"
          :content="false"
          size="sm"
          color="neutral"
          variant="pill"
          :ui="{ trigger: 'tw:min-h-11 tw:data-[state=active]:text-white! tw:lg:min-h-0' }"
        />
      </div>

      <UAlert
        v-if="resultsError"
        role="alert"
        color="error"
        variant="soft"
        icon="i-lucide-circle-alert"
        class="tw:mx-4 tw:mb-4 tw:sm:mx-6"
        :title="$t('search.loadError')"
        :description="
          responseResults.length ? $t('search.staleResults') : undefined
        "
      >
        <template #actions>
          <UButton
            :label="$t('search.retry')"
            :loading="isLoading"
            color="error"
            variant="soft"
            @click="fetchResults()"
          />
        </template>
      </UAlert>

      <div
        v-show="tab === 0"
        role="tabpanel"
        :aria-label="$t('search.tab.table')"
      >
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
      </div>

      <div
        v-show="tab === 1"
        role="tabpanel"
        :aria-label="$t('search.tab.images')"
      >
        <TabImages
          ref="imageTab"
          :response-results="responseResults"
          :response-results-count="responseResultsCount"
        />
      </div>
      <ImageOverflow
        v-if="tableGalleryOpen"
        :images="tableGalleryImages"
        :dialog="tableGalleryOpen"
        :current-index="tableGalleryIndex"
        @close:dialog="tableGalleryOpen = false"
        @update:index="tableGalleryIndex = $event"
      />

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
import TabTable from "@/components/tabs/TabTable.vue";
import { debounce } from "lodash";

export default {
  name: "SearchPage",

  components: {
    TabTable,
    TabImages,
    Pagination,
    ScrollToTop,
  },

  mixins: [queryMixin],

  data: () => ({
    tab: 0,
    tableGalleryOpen: false,
    tableGalleryIndex: 0,
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
      "resultsError",
    ]),
    ...mapState(useSearchStore, ["paginateByItemsTranslated"]),
    tableGalleryImages() {
      return this.responseResults.flatMap((item) =>
        (item.images || []).filter(Boolean).map((image) => ({
          ...item,
          originalImage: image,
          thumbnailImage: `https://geocase.eu/thumbnails/${encodeURIComponent(image)}`,
          altText: item.fullscientificname || item.unitid || "",
        })),
      );
    },
    viewTabs() {
      return [
        {
          label: this.$t("search.tab.table"),
          icon: "i-lucide-table-2",
          value: 0,
          slot: "table",
        },
        {
          label: this.$t("search.imageRecords"),
          icon: "i-lucide-images",
          value: 1,
          slot: "images",
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
        if (this.tab === 1 && newVal.has_image !== "true") {
          this.imageFilterAddedByTab = false;
          this.tab = 0;
        }
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
        this.$router.push({
          path: this.$route.path,
          query,
          hash: this.$route.hash,
        });
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

    openGallery(image) {
      this.tableGalleryIndex = Math.max(
        0,
        this.tableGalleryImages.findIndex(
          (item) => item.originalImage === image,
        ),
      );
      this.tableGalleryOpen = true;
    },

    updateSearchParamDebounced: debounce(function (action, value) {
      action(value);
    }, 300),
  },
};
</script>
