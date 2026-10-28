<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
const props = defineProps({
  src: { type: String, required: true },
  fallbackSrc: { type: String, default: "" },
  alt: { type: String, default: "" },
});
const stage = ref(null);
const source = ref(props.src);
const loaded = ref(false);
const failed = ref(false);
const natural = reactive({ width: 0, height: 0 });
const size = reactive({ width: 0, height: 0 });
const pan = reactive({ x: 0, y: 0 });
const zoom = ref(1);
const pointers = new Map();
let pinch;
let observer;
const fit = computed(() =>
  natural.width && natural.height
    ? Math.min(size.width / natural.width, size.height / natural.height, 1)
    : 1,
);
const maximum = computed(() => Math.max(8, 1 / (fit.value || 1)));
const imageStyle = computed(() => ({
  width: `${natural.width * fit.value}px`,
  height: `${natural.height * fit.value}px`,
  transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom.value})`,
}));
const percentage = computed(() => Math.round(fit.value * zoom.value * 100));
function constrainPan() {
  const x = Math.max(
    0,
    (natural.width * fit.value * zoom.value - size.width) / 2,
  );
  const y = Math.max(
    0,
    (natural.height * fit.value * zoom.value - size.height) / 2,
  );
  pan.x = Math.max(-x, Math.min(x, pan.x));
  pan.y = Math.max(-y, Math.min(y, pan.y));
}
function setZoom(value) {
  zoom.value = Math.max(1, Math.min(maximum.value, value));
  constrainPan();
}
function reset() {
  zoom.value = 1;
  pan.x = 0;
  pan.y = 0;
}
function imageLoaded(event) {
  natural.width = event.target.naturalWidth;
  natural.height = event.target.naturalHeight;
  loaded.value = true;
  reset();
}
function imageError() {
  if (
    source.value === props.src &&
    props.fallbackSrc &&
    props.fallbackSrc !== props.src
  )
    source.value = props.fallbackSrc;
  else {
    failed.value = true;
    loaded.value = false;
  }
}
function distance() {
  const [a, b] = [...pointers.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function pointerDown(event) {
  if (event.pointerType === "mouse" && (event.button !== 0 || zoom.value === 1))
    return;
  stage.value.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) pinch = { distance: distance(), zoom: zoom.value };
}
function pointerMove(event) {
  const previous = pointers.get(event.pointerId);
  if (!previous) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2 && pinch?.distance)
    setZoom((pinch.zoom * distance()) / pinch.distance);
  else if (pointers.size === 1) {
    pan.x += event.clientX - previous.x;
    pan.y += event.clientY - previous.y;
    constrainPan();
  }
}
function pointerUp(event) {
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinch = undefined;
}
function wheel(event) {
  if (loaded.value) setZoom(zoom.value * (event.deltaY < 0 ? 1.2 : 1 / 1.2));
}
function keydown(event) {
  if (!loaded.value) return;
  if (event.key === "+" || event.key === "=") setZoom(zoom.value * 1.5);
  else if (event.key === "-") setZoom(zoom.value / 1.5);
  else if (event.key === "0") reset();
  else return;
  event.preventDefault();
  event.stopPropagation();
}
watch(
  () => props.src,
  (value) => {
    source.value = value;
    loaded.value = false;
    failed.value = false;
    reset();
  },
);
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    size.width = entry.contentRect.width;
    size.height = entry.contentRect.height;
    constrainPan();
  });
  observer.observe(stage.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  pointers.clear();
});
</script>

<template>
  <div class="tw:relative tw:h-full tw:w-full tw:min-h-0">
    <div
      ref="stage"
      tabindex="0"
      role="region"
      :aria-label="$t('imageGallery.zoomViewer')"
      class="tw:relative tw:h-full tw:w-full tw:overflow-hidden tw:touch-none tw:select-none tw:focus-visible:outline-2 tw:focus-visible:outline-primary"
      :class="
        zoom > 1
          ? 'tw:cursor-grab tw:active:cursor-grabbing'
          : 'tw:cursor-zoom-in'
      "
      @wheel.prevent="wheel"
      @dblclick="setZoom(zoom === 1 ? 2 : 1)"
      @pointerdown="pointerDown"
      @pointermove="pointerMove"
      @pointerup="pointerUp"
      @pointercancel="pointerUp"
      @lostpointercapture="pointerUp"
      @keydown="keydown"
    >
      <img
        v-if="!failed"
        :src="source"
        :alt="alt"
        draggable="false"
        class="tw:absolute tw:top-1/2 tw:left-1/2 tw:max-h-none tw:max-w-none tw:object-contain"
        :class="loaded ? 'tw:opacity-100' : 'tw:opacity-0'"
        :style="imageStyle"
        @load="imageLoaded"
        @error="imageError"
      />
      <span
        v-if="!loaded"
        role="status"
        class="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:text-muted"
        >{{
          $t(
            failed
              ? "imageGallery.imageUnavailable"
              : "imageGallery.loadingImage",
          )
        }}</span
      >
    </div>
    <div
      class="tw:absolute tw:bottom-3 tw:left-1/2 tw:flex tw:-translate-x-1/2 tw:items-center tw:gap-1 tw:rounded-xl tw:border tw:border-default tw:bg-default/95 tw:p-1 tw:shadow-lg"
      role="toolbar"
      :aria-label="$t('imageGallery.zoomControls')"
    >
      <UButton
        icon="i-lucide-zoom-out"
        color="neutral"
        variant="ghost"
        :aria-label="$t('imageGallery.zoomOut')"
        :disabled="!loaded || zoom <= 1"
        @click="setZoom(zoom / 1.5)"
      />
      <span
        class="tw:min-w-12 tw:text-center tw:text-xs tw:tabular-nums"
        aria-live="polite"
        >{{ loaded ? `${percentage}%` : "—" }}</span
      >
      <UButton
        icon="i-lucide-zoom-in"
        color="neutral"
        variant="ghost"
        :aria-label="$t('imageGallery.zoomIn')"
        :disabled="!loaded || zoom >= maximum"
        @click="setZoom(zoom * 1.5)"
      />
      <UButton
        icon="i-lucide-maximize"
        color="neutral"
        variant="ghost"
        :aria-label="$t('imageGallery.fitImage')"
        :disabled="!loaded"
        @click="reset"
      />
      <UButton
        color="neutral"
        variant="ghost"
        :aria-label="$t('imageGallery.actualSize')"
        :disabled="!loaded"
        @click="setZoom(1 / fit)"
        >1:1</UButton
      >
    </div>
  </div>
</template>
