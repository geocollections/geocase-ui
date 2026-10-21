<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  images: { type: Array, required: true },
  overflowY: { type: Boolean, default: true },
  overflowX: { type: Boolean, default: false },
  dialog: { type: Boolean, default: false },
  currentIndex: { type: Number, default: 0 },
});

const { localePath } = useAppNavigation();
const { t } = useI18n();

const emit = defineEmits(["close:dialog", "update:index"]);
let galleryTrigger = null;
function restoreGalleryFocus(event) {
  event.preventDefault();
  if (galleryTrigger?.isConnected) galleryTrigger.focus();
}
const showGallery = ref(true);
const previewColumns = ref(2);

const currentImage = computed(() => props.images[props.currentIndex]);
const metadataGroups = computed(() => {
  const image = currentImage.value;
  if (!image) return [];
  const groups = [
    {
      title: "imageDetails",
      fields: ["image_author", "image_date"],
    },
    {
      title: "specimenDetails",
      fields: [
        "unitid",
        "recordbasis",
        "collectioncode",
        "datasetowner",
        "geocase_id",
      ],
    },
    {
      title: "collectionContext",
      fields: [
        "country",
        "locality",
        "area_name",
        "collectorname",
        "stratigraphy",
        "stratigraphytext",
      ],
    },
  ];
  return groups
    .map((group) => ({
      title: t(`imageGallery.${group.title}`),
      fields: group.fields.flatMap((key) => {
        const value = image[key];
        const text = (
          Array.isArray(value)
            ? value
                .filter((item) => item != null && String(item).trim())
                .join(" · ")
            : String(value ?? "")
        ).trim();
        return text
          ? [{ key, label: t(`search.table.${key}`), value: text }]
          : [];
      }),
    }))
    .filter((group) => group.fields.length);
});
const summaryKeys = new Set(["locality", "country", "image_author"]);
const summaryFields = computed(() =>
  metadataGroups.value
    .flatMap((group) => group.fields)
    .filter((field) => summaryKeys.has(field.key)),
);
const additionalGroups = computed(() =>
  metadataGroups.value
    .map((group) => ({
      ...group,
      fields: group.fields.filter(
        (field) => !summaryKeys.has(field.key) && field.key !== "unitid",
      ),
    }))
    .filter((group) => group.fields.length),
);

function externalUrl(value) {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
const sourceRecordUrl = computed(
  () =>
    externalUrl(currentImage.value?.relatedResource) ||
    externalUrl(currentImage.value?.recordURI),
);

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
    if (open) {
      galleryTrigger = document.activeElement;
      window.addEventListener("keyup", handleKeyup);
    } else window.removeEventListener("keyup", handleKeyup);
  },
  { immediate: true },
);

onBeforeUnmount(() => window.removeEventListener("keyup", handleKeyup));
</script>

<template>
  <UModal
    :open="dialog"
    fullscreen
    :modal="true"
    :overlay="false"
    :dismissible="false"
    :close="false"
    :title="$t('imageGallery.imageGallery')"
    :content="{
      onCloseAutoFocus: restoreGalleryFocus,
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
            <nav
              v-if="currentImage"
              :aria-label="$t('imageGallery.imageActions')"
              class="tw:flex tw:shrink-0 tw:flex-wrap tw:items-center tw:gap-2 tw:border-b tw:border-default tw:bg-default tw:px-3 tw:py-2 tw:sm:px-6"
            >
              <UButton
                v-if="currentImage.geocase_id"
                :to="
                  localePath(
                    `/specimen/${encodeURIComponent(currentImage.geocase_id)}`,
                  )
                "
                color="neutral"
                variant="soft"
                icon="i-lucide-microscope"
                size="sm"
                >{{ $t("imageGallery.goToSpecimenView") }}</UButton
              >
              <UButton
                v-if="externalUrl(currentImage.originalImage)"
                :href="externalUrl(currentImage.originalImage)"
                target="_blank"
                rel="noopener noreferrer"
                color="neutral"
                variant="outline"
                trailing-icon="i-lucide-external-link"
                size="sm"
                >{{ $t("imageGallery.linkToImage") }}</UButton
              >
              <UButton
                v-if="sourceRecordUrl"
                :href="sourceRecordUrl"
                target="_blank"
                rel="noopener noreferrer"
                color="neutral"
                variant="ghost"
                trailing-icon="i-lucide-external-link"
                size="sm"
                >{{ $t("imageGallery.sourceRecord") }}</UButton
              >
            </nav>
            <div
              class="tw:bg-muted/40 tw:relative tw:flex tw:min-h-0 tw:flex-1 tw:items-center tw:justify-center tw:overflow-hidden tw:p-3 tw:sm:p-6"
            >
              <ZoomableImage
                v-if="currentImage"
                :key="currentImage.originalImage"
                :src="currentImage.originalImage"
                :fallback-src="currentImage.thumbnailImage"
                :alt="currentImage.altText"
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

            <section
              v-if="currentImage"
              :aria-label="$t('imageGallery.imageInformation')"
              class="tw:max-h-[40%] tw:shrink-0 tw:overflow-y-auto tw:overscroll-contain tw:border-t tw:border-default tw:bg-default tw:px-4 tw:py-2 tw:sm:px-6"
              tabindex="0"
            >
              <div
                class="tw:flex tw:flex-wrap tw:items-baseline tw:gap-x-3 tw:gap-y-1"
              >
                <h3
                  class="tw:break-words tw:text-sm tw:font-bold tw:text-highlighted"
                >
                  {{
                    currentImage.fullscientificname ||
                    currentImage.unitid ||
                    $t("imageGallery.imageInformation")
                  }}
                </h3>
                <span
                  v-if="currentImage.fullscientificname && currentImage.unitid"
                  class="tw:break-all tw:text-sm tw:text-muted"
                  >{{ currentImage.unitid }}</span
                >
              </div>
              <dl
                class="tw:mt-1 tw:flex tw:flex-wrap tw:gap-x-4 tw:gap-y-1 tw:text-xs tw:text-muted"
              >
                <div
                  v-for="field in summaryFields"
                  :key="field.key"
                  class="tw:flex tw:min-w-0 tw:gap-1"
                >
                  <dt>{{ field.label }}:</dt>
                  <dd
                    class="tw:break-words tw:text-toned tw:[overflow-wrap:anywhere]"
                  >
                    {{ field.value }}
                  </dd>
                </div>
              </dl>
              <details
                v-if="additionalGroups.length"
                :key="currentImage.originalImage"
                class="tw:mt-2"
              >
                <summary
                  class="tw:w-fit tw:cursor-pointer tw:text-xs tw:font-medium tw:text-primary tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2"
                >
                  {{ $t("imageGallery.moreInformation") }}
                </summary>
                <div
                  class="tw:mt-3 tw:grid tw:gap-5 tw:md:grid-cols-2 tw:xl:grid-cols-3"
                >
                  <div
                    v-for="group in additionalGroups"
                    :key="group.title"
                    class="tw:min-w-0"
                  >
                    <h4
                      class="tw:mb-3 tw:text-xs tw:font-bold tw:tracking-wide tw:text-muted tw:uppercase"
                    >
                      {{ group.title }}
                    </h4>
                    <dl class="tw:grid tw:gap-3">
                      <div
                        v-for="field in group.fields"
                        :key="field.key"
                        class="tw:min-w-0"
                      >
                        <dt class="tw:text-xs tw:text-muted">
                          {{ field.label }}
                        </dt>
                        <dd
                          class="tw:mt-0.5 tw:break-words tw:whitespace-pre-line tw:text-sm tw:font-medium tw:text-highlighted tw:[overflow-wrap:anywhere]"
                        >
                          {{ field.value }}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </details>
            </section>
          </main>

          <aside
            v-if="showGallery"
            class="tw:border-default tw:bg-muted/30 tw:flex tw:min-h-0 tw:flex-col tw:border-l tw:p-2 tw:sm:p-3"
            :aria-label="$t('imageGallery.thumbnails')"
          >
            <USelect
              v-model="previewColumns"
              name="gallery-preview-columns"
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
