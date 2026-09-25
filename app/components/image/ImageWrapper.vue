<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  imageSrc: { type: String, required: true },
  fallbackSrc: { type: String, default: "" },
  maxHeight: { type: String, default: "400" },
  width: { type: String, default: "unset" },
  aspectRatio: { type: String, default: "1" },
  contain: { type: Boolean, default: true },
  backgroundSizeUnset: { type: Boolean, default: false },
  altText: { type: String, default: "" },
});

const isLoading = ref(true);
const hasError = ref(false);
const useFallback = ref(false);

const computedImageSrc = computed(() => {
  const source = useFallback.value ? props.fallbackSrc : props.imageSrc;

  if (source && !source.startsWith("http")) {
    return `https://${source}`;
  }
  return source;
});

const imageProvider = computed(() =>
  computedImageSrc.value.startsWith("https://geocase.eu/thumbnails/")
    ? "none"
    : undefined,
);

const wrapperStyle = computed(() => ({
  maxHeight: normalizeSize(props.maxHeight),
  width: props.width === "unset" ? "100%" : normalizeSize(props.width),
  aspectRatio: props.aspectRatio,
}));

function normalizeSize(value) {
  return /^\d+$/.test(value) ? `${value}px` : value;
}

function handleImageError() {
  if (!useFallback.value && props.fallbackSrc) {
    useFallback.value = true;
    return;
  }

  isLoading.value = false;
  hasError.value = true;
}

watch([() => props.imageSrc, () => props.fallbackSrc], () => {
  useFallback.value = false;
  isLoading.value = true;
  hasError.value = false;
});
</script>

<template>
  <div
    v-if="computedImageSrc"
    class="tw:relative tw:flex tw:min-h-0 tw:min-w-18 tw:max-w-full tw:items-center tw:justify-center tw:overflow-hidden"
    :style="wrapperStyle"
  >
    <USkeleton
      v-if="isLoading && !hasError"
      class="tw:absolute tw:inset-0 tw:h-full tw:w-full tw:rounded-none"
    />
    <NuxtImg
      v-if="!hasError"
      :src="computedImageSrc"
      :provider="imageProvider"
      :alt="altText"
      loading="lazy"
      class="tw:block tw:h-full tw:max-h-full tw:w-full tw:max-w-full tw:transition-opacity tw:duration-200"
      :class="[
        backgroundSizeUnset
          ? 'tw:object-none'
          : contain
            ? 'tw:object-contain'
            : 'tw:object-cover',
        { 'tw:opacity-0': isLoading },
      ]"
      @load="isLoading = false"
      @error="handleImageError"
    />
    <span
      v-else
      class="tw:bg-muted tw:text-muted tw:flex tw:h-full tw:min-h-24 tw:w-full tw:items-center tw:justify-center"
    >
      <UIcon name="i-lucide-image-off" class="tw:size-10" />
    </span>
  </div>
</template>
