<template>
  <section>
    <div
      class="table-top tw:border-default tw:bg-default tw:flex tw:flex-col tw:gap-3 tw:border-b tw:p-3 tw:lg:flex-row tw:lg:items-center"
    >
      <div class="tw:flex tw:items-center tw:gap-2">
        <ExportControls />
        <HeaderControls
          :headers="translatedTableHeaders"
          :visible-headers="getAllShownTableHeaders"
          :sort-by="sortBy"
          :is-table-header-fixed="isTableHeaderFixed"
          @change="handleHeadersChange"
          @reset="resetTableHeaders"
          @toggle="updateTableHeaderFixedState(!$event)"
        />
      </div>

      <PaginationControls
        class="tw:flex-1"
        :options="tableOptions"
        :pagination="tablePagination"
        :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
        :items-per-page-text="$t('frontPage.map.itemsPerPageText')"
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
    </div>

    <div
      class="tw:border-default tw:overflow-hidden tw:rounded-lg tw:border tw:shadow-sm"
    >
      <div
        v-if="responseResults.length"
        class="tw:space-y-3 tw:p-3 tw:lg:hidden"
      >
        <article
          v-for="item in responseResults"
          :key="item.geocase_id || item.id"
          class="tw:flex tw:gap-3 tw:rounded-xl tw:border tw:border-default tw:bg-default tw:p-3 tw:shadow-sm"
        >
          <UButton
            v-if="item.images?.[0]"
            color="neutral"
            variant="ghost"
            class="tw:size-16 tw:shrink-0 tw:overflow-hidden tw:rounded-lg tw:p-0"
            :aria-label="`${$t('search.openGallery')}: ${item.unitid || item.id}`"
            @click="$emit('open:gallery', item.images[0])"
          >
            <ImageWrapper
              :image-src="`https://geocase.eu/thumbnails/${encodeURIComponent(item.images[0])}`"
              :alt-text="item.fullscientificname || item.unitid || ''"
              width="64px"
              max-height="64px"
              :contain="false"
            />
          </UButton>
          <span
            v-else
            class="tw:flex tw:size-16 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg tw:bg-muted/40 tw:text-dimmed"
            aria-hidden="true"
          >
            <UIcon name="i-lucide-image-off" class="tw:size-5" />
          </span>

          <div class="tw:min-w-0 tw:flex-1">
            <div
              class="tw:flex tw:flex-wrap tw:items-center tw:gap-x-2 tw:gap-y-1"
            >
              <NuxtLink
                :to="{
                  path: `specimen/${encodeURIComponent(item.geocase_id)}`,
                }"
                :title="$t('search.goToDetailView')"
                class="tw:text-primary tw:font-semibold tw:break-words tw:no-underline tw:hover:underline"
              >
                {{ item.unitid || item.id }}
              </NuxtLink>
              <UBadge
                v-if="item.recordbasis"
                color="neutral"
                variant="soft"
                size="sm"
              >
                {{ item.recordbasis }}
              </UBadge>
            </div>
            <p
              v-if="item.fullscientificname"
              class="tw:mt-1 tw:break-words tw:text-sm tw:font-medium"
            >
              {{ item.fullscientificname }}
            </p>
            <p
              v-if="item.country || item.locality"
              class="tw:mt-1 tw:break-words tw:text-sm tw:text-muted"
            >
              {{ [item.locality, item.country].filter(Boolean).join(", ") }}
            </p>
          </div>
        </article>
      </div>
      <div
        v-else-if="isLoading"
        class="tw:space-y-3 tw:p-3 tw:lg:hidden"
        aria-live="polite"
        aria-busy="true"
      >
        <USkeleton
          v-for="index in 3"
          :key="index"
          class="tw:h-24 tw:w-full tw:rounded-xl"
        />
      </div>
      <div v-else class="tw:p-3 tw:lg:hidden">
        <UAlert
          color="neutral"
          variant="soft"
          icon="i-lucide-search-x"
          :title="$t('search.tableNoResults')"
        >
          <template #actions>
            <UButton
              color="error"
              variant="soft"
              size="sm"
              icon="i-lucide-trash-2"
              @click="resetSearch"
            >
              {{ $t("search.drawer.resetSearch") }}
            </UButton>
          </template>
        </UAlert>
      </div>

      <div class="tw:hidden tw:overflow-x-auto tw:lg:block">
        <UTable
          id="table"
          class="table tw:w-full"
          :class="
            isTableHeaderFixed
              ? 'tw:min-h-80 tw:max-h-[calc(100vh-22rem)]'
              : undefined
          "
          :data="responseResults"
          :columns="tableColumns"
          :sorting="tableSort"
          :sorting-options="{ manualSorting: true }"
          :sticky="isTableHeaderFixed ? 'header' : false"
          :loading="isLoading"
          loading-color="primary"
          loading-animation="carousel"
          :ui="{
            base:
              tableDensity === 0
                ? 'tw:w-full tw:min-w-[32rem] tw:table-fixed'
                : tableDensity === 1
                  ? 'tw:w-full tw:min-w-[48rem] tw:table-fixed'
                  : 'tw:w-full tw:min-w-[52rem] tw:table-fixed',
            th: 'tw:px-3 tw:py-2',
            td: 'tw:px-3 tw:py-2 tw:align-top',
            tbody: 'tw:[&>tr:nth-child(even)]:bg-muted/40',
            empty: 'tw:p-0',
          }"
          @update:sorting="updateTableSort"
        >
          <template
            v-for="header in tableColumns"
            :key="header.accessorKey"
            #[`${header.accessorKey}-header`]="{ column }"
          >
            <UButton
              v-if="column.getCanSort()"
              :trailing-icon="
                column.getIsSorted() === 'asc'
                  ? 'i-lucide-arrow-up'
                  : column.getIsSorted() === 'desc'
                    ? 'i-lucide-arrow-down'
                    : 'i-lucide-chevrons-up-down'
              "
              :color="column.getIsSorted() ? 'primary' : 'neutral'"
              variant="ghost"
              size="sm"
              :title="header.header"
              :aria-label="header.header"
              class="tw:-mx-2 tw:w-full tw:min-w-0 tw:justify-between tw:whitespace-nowrap tw:text-left tw:font-semibold"
              @click="column.toggleSorting(undefined, true)"
            >
              <span
                class="tw:min-w-0 tw:flex-1 tw:overflow-hidden tw:text-ellipsis tw:whitespace-nowrap"
              >
                {{ header.header }}
              </span>
            </UButton>
            <span
              v-else
              :title="header.header"
              class="tw:block tw:overflow-hidden tw:text-ellipsis tw:whitespace-nowrap"
            >
              {{ header.header }}
            </span>
          </template>

          <template #preview-cell="{ row: { original: item } }">
            <UButton
              v-if="item.images?.[0]"
              color="neutral"
              variant="ghost"
              class="tw:size-14 tw:overflow-hidden tw:rounded-lg tw:p-0"
              :aria-label="`${$t('search.openGallery')}: ${item.unitid || item.id}`"
              @click="$emit('open:gallery', item.images[0])"
            >
              <ImageWrapper
                :image-src="`https://geocase.eu/thumbnails/${encodeURIComponent(item.images[0])}`"
                :alt-text="item.fullscientificname || item.unitid || ''"
                width="56px"
                max-height="56px"
                :contain="false"
              />
            </UButton>
            <span
              v-else
              class="tw:flex tw:size-14 tw:items-center tw:justify-center tw:rounded-lg tw:bg-muted/40 tw:text-dimmed"
              :aria-label="$t('search.imageNoResults')"
              ><UIcon name="i-lucide-image-off" aria-hidden="true"
            /></span>
          </template>

          <template #unitid-cell="{ row: { original: item } }">
            <NuxtLink
              :to="{ path: `specimen/${encodeURIComponent(item.geocase_id)}` }"
              :title="$t('search.goToDetailView')"
              class="tw:text-primary tw:font-semibold tw:no-underline tw:hover:underline"
            >
              {{ item.unitid }}
            </NuxtLink>
          </template>

          <template #fullscientificname-cell="{ row: { original: item } }">
            <UButton
              v-if="item.mindat_id"
              :href="item.mindat_url"
              target="MindatWindow"
              color="primary"
              variant="link"
              size="sm"
              trailing-icon="i-lucide-external-link"
              class="tw:max-w-56 tw:p-0 tw:whitespace-normal tw:break-words"
              :title="$t('search.mindatLink')"
            >
              {{ item.fullscientificname }}
            </UButton>
            <UButton
              v-else-if="item.meteorite_id"
              :href="`https://www.lpi.usra.edu/meteor/metbull.php?code=${item.meteorite_id}`"
              target="MeteoriteWindow"
              color="primary"
              variant="link"
              size="sm"
              trailing-icon="i-lucide-external-link"
              class="tw:max-w-56 tw:p-0 tw:whitespace-normal tw:break-words"
              :title="$t('search.mindatLink')"
            >
              {{ item.fullscientificname }}
            </UButton>
            <span v-else>{{ item.fullscientificname }}</span>
          </template>

          <template #recordURI-cell="{ row: { original: item } }">
            <UButton
              v-if="item.recordURI"
              :href="item.recordURI"
              target="RecordWindow"
              icon="i-lucide-external-link"
              color="primary"
              variant="ghost"
              size="sm"
              :aria-label="$t('search.table.recordURI')"
              :title="item.recordURI"
            />
          </template>

          <template #stratigraphy-cell="{ row: { original: item } }">
            <ul
              v-if="item.stratigraphies"
              class="tw:list-disc tw:space-y-1 tw:pl-4"
            >
              <li v-for="value in item.stratigraphies" :key="value">
                {{ value }}
              </li>
            </ul>
            <ul
              v-else-if="item.stratigraphytexts"
              class="tw:list-disc tw:space-y-1 tw:pl-4"
            >
              <li v-for="value in item.stratigraphytexts" :key="value">
                {{ value }}
              </li>
            </ul>
          </template>

          <template #url-cell="{ row: { original: item } }">
            <UButton
              v-if="item.has_image"
              icon="i-lucide-image"
              color="primary"
              variant="ghost"
              size="sm"
              :aria-label="$t('search.openGallery')"
              :title="$t('search.openGallery')"
              @click="$emit('open:gallery', item.images[0])"
            />
          </template>

          <template #loading>
            <div class="tw:space-y-2 tw:p-4">
              <USkeleton
                v-for="index in 3"
                :key="index"
                class="tw:h-8 tw:w-full"
              />
            </div>
          </template>

          <template #empty>
            <div class="tw:mx-auto tw:max-w-2xl tw:p-6">
              <UAlert
                color="neutral"
                variant="soft"
                icon="i-lucide-search-x"
                :title="$t('search.tableNoResults')"
              >
                <template #actions>
                  <UButton
                    color="error"
                    variant="soft"
                    size="sm"
                    icon="i-lucide-trash-2"
                    @click="resetSearch"
                  >
                    {{ $t("search.drawer.resetSearch") }}
                  </UButton>
                </template>
              </UAlert>
            </div>
          </template>
        </UTable>
      </div>
    </div>

    <div class="table-footer tw:border-default tw:border-t tw:py-3">
      <PaginationControls
        :options="tableOptions"
        :pagination="tablePagination"
        :items-per-page-options="[10, 25, 50, 100, 250, 500, 1000]"
        :items-per-page-text="$t('frontPage.map.itemsPerPageText')"
        :page-select-text="
          $t('search.table.pageSelect', {
            current: page,
            count: tablePagination.pageCount,
          })
        "
        :go-to-text="$t('search.table.goTo')"
        :go-to-button-text="$t('search.table.goToBtn')"
        select-page-id="footer-select-btn"
        @update:options="updateTableOptions"
      />
    </div>
  </section>
</template>

<script>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { mapActions, mapState } from "pinia";
import { useSearchStore } from "@/stores/search";
import ImageWrapper from "@/components/image/ImageWrapper.vue";
import HeaderControls from "@/components/tables/HeaderControls.vue";
import PaginationControls from "@/components/tables/PaginationControls.vue";
import ExportControls from "@/components/tables/ExportControls.vue";

export default {
  name: "TabTable",
  setup() {
    const tableDensity = ref(2);
    const updateTableDensity = () => {
      const width = window.innerWidth;
      tableDensity.value =
        width >= 1920
          ? 4
          : width >= 1536
            ? 3
            : width >= 1280
              ? 2
              : width >= 1024
                ? 1
                : 0;
    };

    onMounted(() => {
      updateTableDensity();
      window.addEventListener("resize", updateTableDensity);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateTableDensity);
    });

    return { tableDensity };
  },
  components: {
    ImageWrapper,
    ExportControls,
    PaginationControls,
    HeaderControls,
  },
  emits: [
    "sortBy:changed",
    "sortDesc:changed",
    "update:page",
    "update:paginateBy",
    "open:gallery",
  ],
  props: {
    responseResults: { type: Array, required: true },
    responseResultsCount: { type: Number, required: true },
    page: { type: Number, required: true },
    paginateBy: { type: Number, required: true },
    sortBy: { type: Array, required: true },
    sortDesc: { type: Array, required: true },
    isLoading: { type: Boolean, default: false },
    tabIndex: { type: Number, default: 0 },
  },
  computed: {
    responsiveHeaders() {
      const headers = this.getAllShownTableHeaders.filter(
        (header) => !["icon", "url"].includes(header.value),
      );
      if (this.tableDensity >= 2) {
        const additionalPriorities =
          this.tableDensity === 2
            ? []
            : this.tableDensity === 3
              ? ["recordbasis", "collectorname", "datasetowner", "providername"]
              : [
                  "recordbasis",
                  "collectorname",
                  "datasetowner",
                  "providername",
                  "gatheringareas",
                  "country_code",
                  "coordinates",
                  "highertaxa",
                ];
        const shownValues = new Set(headers.map((header) => header.value));
        const additionalHeaders = this.translatedTableHeaders.filter(
          (header) =>
            additionalPriorities.includes(header.value) &&
            !shownValues.has(header.value),
        );
        const priority = [
          "unitid",
          "fullscientificname",
          "country",
          "locality",
          "collectioncode",
          "highertaxon",
          "stratigraphy",
          "recordURI",
          ...additionalPriorities,
        ];
        const priorityOrder = new Map(
          priority.map((value, index) => [value, index]),
        );
        const responsiveHeaders = [
          ...headers,
          ...additionalHeaders.sort(
            (left, right) =>
              (priorityOrder.get(left.value) ?? priority.length) -
              (priorityOrder.get(right.value) ?? priority.length),
          ),
        ].sort(
          (left, right) =>
            (priorityOrder.get(left.value) ?? priority.length) -
            (priorityOrder.get(right.value) ?? priority.length),
        );

        return responsiveHeaders.slice(
          0,
          this.tableDensity === 2 ? 6 : this.tableDensity === 3 ? 8 : 10,
        );
      }

      const priority =
        this.tableDensity === 0
          ? ["unitid", "fullscientificname", "country", "locality"]
          : [
              "unitid",
              "fullscientificname",
              "country",
              "locality",
              "collectioncode",
              "highertaxon",
              "stratigraphy",
              "recordURI",
            ];
      const priorityOrder = new Map(
        priority.map((value, index) => [value, index]),
      );

      return headers
        .sort(
          (left, right) =>
            (priorityOrder.get(left.value) ?? priority.length) -
            (priorityOrder.get(right.value) ?? priority.length),
        )
        .slice(0, this.tableDensity === 0 ? 2 : 4);
    },
    tableColumns() {
      const columns = this.responsiveHeaders.map((header) => ({
        accessorKey: header.value,
        header: header.text,
        enableSorting: header.sortable !== false,
        meta: {
          class: {
            th: [
              header.align === "center" ? "tw:text-center" : "",
              header.value === "unitid"
                ? "tw:sticky tw:left-0 tw:z-20 tw:bg-default tw:shadow-[4px_0_6px_-4px_rgba(0,0,0,0.18)]"
                : "",
            ].join(" "),
            td: [
              header.align === "center" ? "tw:text-center" : "",
              header.value === "unitid"
                ? "tw:sticky tw:left-0 tw:z-10 tw:bg-default tw:shadow-[4px_0_6px_-4px_rgba(0,0,0,0.18)]"
                : "",
              "tw:whitespace-normal tw:break-words",
            ].join(" "),
          },
        },
      }));
      return [
        ...columns.filter((column) => column.accessorKey === "unitid"),
        ...(this.tableDensity > 0
          ? [
              {
                accessorKey: "preview",
                header: this.$t("search.tab.images"),
                enableSorting: false,
              },
            ]
          : []),
        ...columns.filter((column) => column.accessorKey !== "unitid"),
      ];
    },
    tableSort() {
      return this.sortBy.map((id, index) => ({
        id,
        desc: Boolean(this.sortDesc[index]),
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
    ...mapState(useSearchStore, [
      "isTableHeaderFixed",
      "getAllShownTableHeaders",
      "translatedTableHeaders",
    ]),
  },
  methods: {
    ...mapActions(useSearchStore, [
      "resetSearch",
      "updateTableHeaders",
      "resetTableHeaders",
      "updateTableHeaderFixedState",
    ]),
    updateTableSort(sort = []) {
      this.$emit(
        "sortBy:changed",
        sort.map((item) => item.id),
      );
      this.$emit(
        "sortDesc:changed",
        sort.map((item) => item.desc),
      );
    },
    handleHeadersChange(header) {
      let visibleHeaders = this.getAllShownTableHeaders.map(
        (item) => item.value,
      );

      visibleHeaders = visibleHeaders.includes(header.value)
        ? visibleHeaders.filter((value) => value !== header.value)
        : [...visibleHeaders, header.value];

      this.updateTableHeaders(visibleHeaders);
    },
    updateTableOptions(options) {
      if (this.page !== options.page) this.$emit("update:page", options.page);
      if (this.paginateBy !== options.itemsPerPage)
        this.$emit("update:paginateBy", options.itemsPerPage);
    },
  },
};
</script>
