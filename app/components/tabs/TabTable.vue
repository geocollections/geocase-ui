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
            :label="header.header"
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
            class="tw:-mx-2 tw:font-semibold"
            @click="column.toggleSorting(undefined, true)"
          />
          <span v-else>{{ header.header }}</span>
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

        <template #icon-cell="{ row: { original: item } }">
          <NuxtLink
            :to="{ path: `specimen/${encodeURIComponent(item.geocase_id)}` }"
            :title="$t('search.goToDetailView')"
            class="tw:text-primary tw:inline-flex tw:rounded-md tw:p-1 tw:transition-opacity tw:hover:opacity-70 tw:focus-visible:outline-2 tw:focus-visible:outline-primary"
          >
            <UIcon
              v-if="item.recordbasis === 'Fossil'"
              name="i-lucide-fish"
              class="tw:size-5"
            />
            <UIcon
              v-else-if="item.recordbasis === 'Mineral'"
              name="i-lucide-gem"
              class="tw:size-5"
            />
            <UIcon
              v-else-if="item.recordbasis === 'Rock'"
              name="i-lucide-mountain"
              class="tw:size-5"
            />
            <UIcon
              v-else-if="item.recordbasis === 'Meteorite'"
              name="i-lucide-meteor"
              class="tw:size-5"
            />
          </NuxtLink>
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
            class="tw:p-0 tw:whitespace-nowrap"
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
            class="tw:p-0 tw:whitespace-nowrap"
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
import { mapActions, mapState } from "pinia";
import { useSearchStore } from "@/stores/search";
import ImageWrapper from "@/components/image/ImageWrapper.vue";
import HeaderControls from "@/components/tables/HeaderControls.vue";
import PaginationControls from "@/components/tables/PaginationControls.vue";
import ExportControls from "@/components/tables/ExportControls.vue";

export default {
  name: "TabTable",
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
    tableColumns() {
      return [
        {
          accessorKey: "preview",
          header: this.$t("search.tab.images"),
          enableSorting: false,
        },
        ...this.getAllShownTableHeaders
          .filter((header) => header.value !== "url")
          .map((header) => ({
            accessorKey: header.value,
            header: header.text,
            enableSorting: header.sortable !== false,
            meta: {
              class: {
                th: header.align === "center" ? "tw:text-center" : "",
                td: [
                  header.align === "center" ? "tw:text-center" : "",
                  header.value === "stratigraphy"
                    ? "tw:min-w-56 tw:whitespace-normal"
                    : "tw:whitespace-nowrap",
                ].join(" "),
              },
            },
          })),
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
