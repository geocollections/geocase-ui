<script setup>
import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useSearchStore } from "@/stores/search";
import ImageWrapper from "@/components/image/ImageWrapper.vue";
import ImageOverflow from "@/components/image/ImageOverflow.vue";

const props = defineProps({
  responseResults: {
    type: Array,
    required: true,
  },
  responseResultsCount: {
    type: Number,
    required: true,
  },
});

const { t } = useI18n();
const searchStore = useSearchStore();
const gallery = reactive({ open: false, currentIndex: 0 });

const searchResultImages = computed(() => {
  if (props.responseResultsCount <= 0) return [];

  return props.responseResults
    .filter((result) => Array.isArray(result.images))
    .flatMap((result) =>
      result.images.map((image) => ({
        ...result,
        thumbnailImage: image
          ? `https://geocase.eu/thumbnails/${encodeURIComponent(image)}`
          : "",
        originalImage: image,
        altText: ["recordbasis", "fullscientificname", "locality", "datasetowner"]
          .filter((field) => result[field])
          .map((field) => `${t(`search.table.${field}`)}: ${result[field]}`)
          .join(", "),
      })),
    );
});

function openDialogUsingImage(image) {
  gallery.currentIndex = Math.max(
    searchResultImages.value.findIndex(
      (item) => item.originalImage === image,
    ),
    0,
  );
  gallery.open = true;
}

defineExpose({ openDialogUsingImage });
</script>

<template>
  <section
    class="tw:relative tw:min-h-32"
    :aria-busy="searchStore.isLoading"
    aria-live="polite"
  >
    <UProgress
      v-if="searchStore.isLoading"
      color="primary"
      size="xs"
      animation="carousel"
      class="tw:absolute tw:inset-x-0 tw:top-0 tw:z-10"
    />

    <div
      v-if="searchResultImages.length"
      class="tw:grid tw:grid-cols-2 tw:gap-3 tw:p-3 tw:sm:grid-cols-3 tw:sm:p-4 tw:md:grid-cols-4 tw:lg:grid-cols-6"
    >
      <UTooltip
        v-for="(image, index) in searchResultImages"
        :key="`${image.originalImage}-${index}`"
        :content="{ side: 'bottom' }"
        :ui="{ content: 'tw:z-[2100] tw:max-w-72' }"
      >
        <UButton
          color="neutral"
          variant="ghost"
          class="tw:bg-muted/30 tw:ring-default tw:group tw:aspect-square tw:h-auto tw:w-full tw:overflow-hidden tw:rounded-xl tw:p-0 tw:ring-1 tw:transition tw:duration-200 tw:hover:-translate-y-0.5 tw:hover:bg-muted tw:hover:shadow-lg tw:focus-visible:ring-2 tw:focus-visible:ring-primary tw:motion-reduce:transform-none tw:motion-reduce:transition-none"
          :aria-label="`${t('search.openGallery')}: ${image.unitid || image.id}`"
          @click="
            gallery.currentIndex = index;
            gallery.open = true;
          "
        >
          <ImageWrapper
            v-if="image.thumbnailImage"
            :image-src="image.thumbnailImage"
            :alt-text="image.altText"
            :contain="false"
            max-height="100%"
            width="100%"
            class="tw:h-full tw:w-full tw:transition tw:duration-300 tw:group-hover:scale-[1.03] tw:motion-reduce:transform-none tw:motion-reduce:transition-none"
          />

          <span
            v-else
            class="tw:text-dimmed tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center"
          >
            <UIcon name="i-lucide-image-off" class="tw:size-16" />
          </span>
        </UButton>

        <template #content>
          <dl
            class="tw:grid tw:grid-cols-[auto_minmax(0,1fr)] tw:gap-x-2 tw:gap-y-1"
          >
            <dt class="tw:font-bold">ID:</dt>
            <dd class="tw:min-w-0 tw:break-words">{{ image.id }}</dd>

            <template v-if="image.collectioncode">
              <dt class="tw:font-bold">
                {{ t("search.table.collectioncode") }}:
              </dt>
              <dd class="tw:min-w-0 tw:break-words">
                {{ image.collectioncode }}
              </dd>
            </template>

            <template v-if="image.unitid">
              <dt class="tw:font-bold">{{ t("search.table.unitid") }}:</dt>
              <dd class="tw:min-w-0 tw:break-words">{{ image.unitid }}</dd>
            </template>

            <template v-if="image.fullscientificname">
              <dt class="tw:font-bold">
                {{ t("search.table.fullscientificname") }}:
              </dt>
              <dd class="tw:min-w-0 tw:break-words">
                {{ image.fullscientificname }}
              </dd>
            </template>

            <template v-if="image.country">
              <dt class="tw:font-bold">{{ t("search.table.country") }}:</dt>
              <dd class="tw:min-w-0 tw:break-words">{{ image.country }}</dd>
            </template>

            <template v-if="image.locality">
              <dt class="tw:font-bold">{{ t("search.table.locality") }}:</dt>
              <dd class="tw:min-w-0 tw:break-words">{{ image.locality }}</dd>
            </template>

            <template v-if="image.stratigraphy">
              <dt class="tw:font-bold">
                {{ t("search.table.stratigraphy") }}:
              </dt>
              <dd class="tw:min-w-0 tw:break-words">
                {{ image.stratigraphy }}
              </dd>
            </template>
          </dl>
        </template>
      </UTooltip>
    </div>

    <div
      v-else-if="!searchStore.isLoading"
      class="tw:mx-auto tw:max-w-2xl tw:px-4 tw:py-10"
    >
      <UAlert
        color="neutral"
        variant="soft"
        icon="i-lucide-search-x"
        :title="t('search.imageNoResults')"
      >
        <template #description>
          <div
            v-if="!searchStore.search.has_image.value"
            class="tw:flex tw:flex-col tw:items-start tw:gap-3 tw:sm:flex-row tw:sm:items-center"
          >
            <span>{{ t("search.imageNoResultsFilterInfo") }}</span>
            <UButton
              size="sm"
              color="primary"
              variant="soft"
              icon="i-lucide-list-filter-plus"
              @click="
                searchStore.updateSearchField({
                  id: 'has_image',
                  value: 'true',
                })
              "
            >
              {{ t("search.addFilter") }}
            </UButton>
          </div>
        </template>
      </UAlert>
    </div>

    <ImageOverflow
      v-if="searchResultImages.length"
      :images="searchResultImages"
      :dialog="gallery.open"
      :current-index="gallery.currentIndex"
      @close:dialog="gallery.open = false"
      @update:index="gallery.currentIndex = $event"
    />
  </section>
</template>
