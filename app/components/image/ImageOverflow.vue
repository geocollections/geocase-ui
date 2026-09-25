<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  images: { type: Array, required: true },
  overflowY: { type: Boolean, default: true },
  overflowX: { type: Boolean, default: false },
  dialog: { type: Boolean, default: false },
  currentIndex: { type: Number, default: 0 },
});

const emit = defineEmits(["close:dialog", "update:index"]);
const showGallery = ref(true);
const previewColumns = ref(2);

const currentImage = computed(() => props.images[props.currentIndex]);

useHead(() => ({
  htmlAttrs: {
    style: props.dialog ? "overflow: hidden;" : undefined,
  },
}));

function showPrevious() {
  const previousIndex =
    props.currentIndex > 0 ? props.currentIndex - 1 : props.images.length - 1;
  emit("update:index", previousIndex);
}

function showNext() {
  const nextIndex =
    props.currentIndex < props.images.length - 1 ? props.currentIndex + 1 : 0;
  emit("update:index", nextIndex);
}

function handleKeyup(event) {
  if (event.key === "ArrowRight") showNext();
  if (event.key === "ArrowLeft") showPrevious();
  if (event.key === "Escape") emit("close:dialog");
}

function handleOpenChange(open) {
  if (!open) emit("close:dialog");
}

watch(
  () => props.dialog,
  (open) => {
    if (typeof window === "undefined") return;
    if (open) window.addEventListener("keyup", handleKeyup);
    else window.removeEventListener("keyup", handleKeyup);
  },
  { immediate: true },
);

onBeforeUnmount(() => window.removeEventListener("keyup", handleKeyup));
</script>

<template>
  <UModal
    :open="dialog"
    fullscreen
    :modal="false"
    :overlay="false"
    :dismissible="false"
    :close="false"
    :title="$t('imageGallery.imageGallery')"
    :content="{
      style: {
        inset: '4rem 0 0',
        height: 'auto',
        maxHeight: 'none',
      },
    }"
    :ui="{
      content: 'tw:overflow-hidden tw:rounded-none tw:ring-0',
    }"
    @update:open="handleOpenChange"
  >
    <template #content>
      <div
        class="tw:grid tw:h-full tw:min-h-0 tw:grid-rows-[4rem_minmax(0,1fr)] tw:overflow-hidden"
      >
        <header
          class="tw:border-default tw:bg-default tw:flex tw:min-h-16 tw:items-center tw:border-b tw:px-3 tw:sm:px-5"
        >
          <div
            class="tw:flex tw:w-full tw:items-center tw:justify-between tw:gap-3"
          >
            <div class="tw:flex tw:min-w-0 tw:items-center tw:gap-3">
              <h2
                class="tw:text-highlighted tw:truncate tw:text-lg tw:font-bold"
              >
                {{ $t("imageGallery.imageGallery") }}
              </h2>
              <UBadge v-if="images.length" color="neutral" variant="soft">
                {{ currentIndex + 1 }} / {{ images.length }}
              </UBadge>
            </div>

            <div class="tw:flex tw:shrink-0 tw:items-center tw:gap-1">
              <UTooltip
                :text="
                  $t(
                    showGallery
                      ? 'imageGallery.hideThumbnails'
                      : 'imageGallery.showThumbnails',
                  )
                "
              >
                <UButton
                  :icon="
                    showGallery
                      ? 'i-lucide-panel-right-close'
                      : 'i-lucide-images'
                  "
                  color="neutral"
                  variant="ghost"
                  :aria-label="
                    $t(
                      showGallery
                        ? 'imageGallery.hideThumbnails'
                        : 'imageGallery.showThumbnails',
                    )
                  "
                  @click="showGallery = !showGallery"
                />
              </UTooltip>
              <UTooltip :text="$t('imageGallery.closeGallery')">
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  :aria-label="$t('imageGallery.closeGallery')"
                  @click="emit('close:dialog')"
                />
              </UTooltip>
            </div>
          </div>
        </header>

        <div
          class="tw:grid tw:min-h-0 tw:overflow-hidden tw:bg-default"
          :class="
            showGallery
              ? 'tw:grid-cols-[minmax(0,1fr)_7rem] tw:sm:grid-cols-[minmax(0,1fr)_14rem] tw:xl:grid-cols-[minmax(0,1fr)_18rem]'
              : 'tw:grid-cols-1'
          "
        >
          <main
            class="tw:flex tw:min-h-0 tw:min-w-0 tw:overflow-hidden tw:flex-col"
          >
            <div
              class="tw:bg-muted/40 tw:relative tw:flex tw:min-h-0 tw:flex-1 tw:items-center tw:justify-center tw:overflow-hidden tw:p-3 tw:sm:p-6"
            >
              <ImageWrapper
                v-if="currentImage"
                class="tw:h-full tw:w-full"
                max-height="100%"
                width="100%"
                aspect-ratio="auto"
                :image-src="currentImage.originalImage"
                :fallback-src="currentImage.thumbnailImage"
                :alt-text="currentImage.altText"
              />

              <UTooltip :text="$t('imageGallery.previousImage')">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xl"
                  class="tw:bg-default/95 tw:text-highlighted tw:ring-default tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:rounded-full tw:shadow-xl tw:ring-1 tw:backdrop-blur-sm tw:hover:bg-muted"
                  :aria-label="$t('imageGallery.previousImage')"
                  @click="showPrevious"
                >
                  <UIcon name="i-lucide-chevron-left" class="tw:size-7" />
                </UButton>
              </UTooltip>

              <UTooltip :text="$t('imageGallery.nextImage')">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xl"
                  class="tw:bg-default/95 tw:text-highlighted tw:ring-default tw:absolute tw:right-3 tw:top-1/2 tw:-translate-y-1/2 tw:rounded-full tw:shadow-xl tw:ring-1 tw:backdrop-blur-sm tw:hover:bg-muted"
                  :aria-label="$t('imageGallery.nextImage')"
                  @click="showNext"
                >
                  <UIcon name="i-lucide-chevron-right" class="tw:size-7" />
                </UButton>
              </UTooltip>
            </div>

            <footer
              v-if="currentImage"
              class="tw:border-default tw:bg-default tw:flex tw:flex-wrap tw:items-center tw:gap-x-5 tw:gap-y-2 tw:border-t tw:px-4 tw:py-3 tw:text-sm tw:sm:px-6"
            >
              <span v-if="currentImage.image_date" class="tw:text-toned">
                <strong class="tw:text-highlighted">
                  {{ $t("imageGallery.date") }}:
                </strong>
                {{ currentImage.image_date }}
              </span>
              <span v-if="currentImage.image_licence" class="tw:text-toned">
                <strong class="tw:text-highlighted">
                  {{ $t("imageGallery.licence") }}:
                </strong>
                {{ currentImage.image_licence }}
              </span>
              <UButton
                :to="{ path: `specimen/${currentImage.geocase_id}` }"
                variant="link"
                trailing-icon="i-lucide-arrow-right"
                class="tw:p-0"
              >
                {{ $t("imageGallery.goToSpecimenView") }}
              </UButton>
              <UButton
                v-if="currentImage.originalImage"
                :href="currentImage.originalImage"
                target="_blank"
                variant="link"
                trailing-icon="i-lucide-external-link"
                class="tw:p-0"
              >
                {{ $t("imageGallery.linkToImage") }}
              </UButton>
            </footer>
          </main>

          <aside
            v-if="showGallery"
            class="tw:border-default tw:bg-muted/30 tw:flex tw:min-h-0 tw:flex-col tw:border-l tw:p-2 tw:sm:p-3"
            :aria-label="$t('imageGallery.thumbnails')"
          >
            <USelect
              v-model="previewColumns"
              :items="[1, 2, 3]"
              icon="i-lucide-grid-2x-2"
              color="neutral"
              size="sm"
              class="tw:mb-2 tw:w-full tw:shrink-0"
              :aria-label="$t('imageGallery.previewsPerRow')"
              :ui="{ content: 'tw:z-[4000]' }"
            />

            <UScrollArea
              orientation="vertical"
              shadow
              class="thumbnail-scroll tw:border-default tw:bg-default tw:min-h-0 tw:flex-1 tw:rounded-xl tw:border tw:shadow-sm"
              :ui="{ viewport: 'tw:p-2' }"
            >
              <div
                class="tw:grid tw:gap-2"
                :class="{
                  'tw:grid-cols-1': previewColumns === 1,
                  'tw:grid-cols-2': previewColumns === 2,
                  'tw:grid-cols-3': previewColumns === 3,
                }"
              >
                <UButton
                  v-for="(image, index) in images"
                  :key="`${image.originalImage}-${index}`"
                  color="neutral"
                  variant="ghost"
                  class="tw:aspect-square tw:h-auto tw:w-full tw:overflow-hidden tw:rounded-lg tw:p-0 tw:transition tw:duration-150 tw:hover:-translate-y-0.5 tw:hover:shadow-md"
                  :class="{
                    'tw:ring-primary tw:ring-2 tw:ring-offset-2':
                      currentIndex === index,
                  }"
                  :aria-label="
                    image.altText || `${index + 1} / ${images.length}`
                  "
                  :aria-current="currentIndex === index ? 'true' : undefined"
                  @click="emit('update:index', index)"
                >
                  <ImageWrapper
                    :contain="false"
                    max-height="100%"
                    width="100%"
                    :image-src="image.thumbnailImage"
                    :alt-text="image.altText"
                  />
                </UButton>
              </div>
            </UScrollArea>
          </aside>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.thumbnail-scroll {
  scrollbar-color: var(--ui-border-accented) transparent;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
}

.thumbnail-scroll::-webkit-scrollbar {
  width: 0.5rem;
}

.thumbnail-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.thumbnail-scroll::-webkit-scrollbar-thumb {
  background: var(--ui-border-accented);
  border: 2px solid var(--ui-bg);
  border-radius: 999px;
}

.thumbnail-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--ui-text-muted);
}
</style>
