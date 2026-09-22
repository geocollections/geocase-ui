<template>
  <section class="tw:relative tw:min-h-64" aria-live="polite">
    <UProgress
      v-if="isLoading"
      animation="carousel"
      color="primary"
      size="sm"
      class="tw:absolute tw:inset-x-0 tw:top-0 tw:z-10"
    />

    <div
      v-if="searchResultImages.length > 0"
      class="tw:grid tw:grid-cols-2 tw:gap-3 tw:p-3 tw:sm:grid-cols-3 tw:sm:p-4 tw:md:grid-cols-4 tw:lg:grid-cols-6"
    >
      <UTooltip
        v-for="(image, index) in searchResultImages"
        :key="index"
        :delay-duration="250"
        :ui="{ content: 'tw:z-[5100] tw:max-w-64 tw:p-3' }"
      >
        <UButton
          color="neutral"
          variant="outline"
          class="image-hover tw:aspect-square tw:h-auto tw:w-full tw:overflow-hidden tw:rounded-lg tw:p-0"
          :aria-label="
            image.altText || `${$t('search.openGallery')} ${index + 1}`
          "
          @click="openDialog(index)"
        >
          <ImageWrapper
            v-if="image.thumbnailImage"
            :image-src="image.thumbnailImage"
            :alt-text="image.altText"
            :contain="false"
            width="100%"
          />
          <span
            v-else
            class="tw:bg-muted tw:text-muted tw:flex tw:h-full tw:w-full tw:items-center tw:justify-center"
          >
            <UIcon name="i-lucide-image" class="tw:size-16" />
          </span>
        </UButton>

        <template #content>
          <dl class="tw:grid tw:grid-cols-[auto_1fr] tw:gap-x-2 tw:gap-y-1">
            <template v-for="detail in imageDetails(image)" :key="detail.label">
              <dt class="tw:font-semibold">{{ detail.label }}:</dt>
              <dd>{{ detail.value }}</dd>
            </template>
          </dl>
        </template>
      </UTooltip>

      <ImageOverflow
        :images="searchResultImages"
        :dialog="dialog"
        :current-index="currentIndex"
        @close:dialog="dialog = false"
        @update:index="currentIndex = $event"
      />
    </div>

    <div v-else class="tw:flex tw:justify-center tw:p-4 tw:sm:p-8">
      <UCard variant="subtle" class="tw:w-full tw:max-w-xl tw:text-center">
        <div class="tw:flex tw:flex-col tw:items-center tw:gap-3">
          <span
            class="tw:bg-muted tw:text-highlighted tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-full"
            aria-hidden="true"
          >
            <UIcon name="i-lucide-image-off" class="tw:size-6" />
          </span>
          <p class="tw:text-highlighted tw:text-base tw:font-semibold">
            {{ $t("search.imageNoResults") }}
          </p>
          <p v-if="!search.has_image.value" class="tw:text-muted tw:text-sm">
            {{ $t("search.imageNoResultsFilterInfo") }}
          </p>
          <UButton
            v-if="!search.has_image.value"
            icon="i-lucide-filter-plus"
            color="neutral"
            variant="solid"
            @click="updateSearchField({ id: 'has_image', value: 'true' })"
          >
            {{ $t("search.addFilter") }}
          </UButton>
        </div>
      </UCard>
    </div>
  </section>
</template>

<script>
import { useSearchStore } from "@/stores/search";
import { useSettingsStore } from "@/stores/settings";

import helperMixin from "@/mixins/helperMixin";
import ImageWrapper from "@/components/image/ImageWrapper.vue";
import ImageOverflow from "../image/ImageOverflow";
import { mapActions, mapState } from "pinia";

export default {
  name: "TabImages",
  components: { ImageOverflow, ImageWrapper },
  mixins: [helperMixin],

  props: {
    responseResults: {
      type: Array,
      required: true,
    },
    responseResultsCount: {
      type: Number,
      required: true,
    },
  },

  data: () => ({
    dialog: false,
    currentIndex: 0,
  }),

  computed: {
    ...mapState(useSearchStore, ["search", "isLoading"]),
    ...mapState(useSettingsStore, ["searchDrawer"]),
  },

  methods: {
    ...mapActions(useSearchStore, ["updateSearchField"]),

    imageDetails(image) {
      return [
        { label: "ID", value: image.id },
        {
          label: this.$t("search.table.collectioncode"),
          value: image.collectioncode,
        },
        { label: this.$t("search.table.unitid"), value: image.unitid },
        {
          label: this.$t("search.table.fullscientificname"),
          value: image.fullscientificname,
        },
        { label: this.$t("search.table.country"), value: image.country },
        { label: this.$t("search.table.locality"), value: image.locality },
        {
          label: this.$t("search.table.stratigraphy"),
          value: image.stratigraphy,
        },
      ].filter((detail) => detail.value);
    },

    openDialog(imageIndex) {
      this.dialog = true;
      this.currentIndex = imageIndex;
    },

    openDialogUsingImage(image) {
      this.dialog = true;
      let index = this.searchResultImages.findIndex(
        (item) => item.originalImage === image,
      );
      this.currentIndex = index ? index : 0;
    },
  },
};
</script>

<style scoped>
.image-hover:hover {
  transform: translateY(-2px);
}

.image-hover {
  transition:
    transform 150ms ease-in-out,
    box-shadow 150ms ease-in-out;
}
</style>
