<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";

const props = withDefaults(
  defineProps<{
    text?: string | null;
    threshold?: number;
  }>(),
  { threshold: 280 },
);

const expanded = ref(false);
const contentId = useId();
const content = computed(() => String(props.text ?? ""));
const isLong = computed(() => content.value.length > props.threshold);
const preview = computed(() => {
  const beginning = content.value.slice(0, props.threshold);
  const lastSpace = beginning.lastIndexOf(" ");
  const end = lastSpace > props.threshold * 0.7 ? lastSpace : beginning.length;
  return `${beginning.slice(0, end).trimEnd()}…`;
});

watch(
  () => props.text,
  () => {
    expanded.value = false;
  },
);
</script>

<template>
  <div class="tw:max-w-[80ch]">
    <p
      :id="contentId"
      class="tw:m-0 tw:leading-[1.65] tw:whitespace-pre-line tw:wrap-anywhere"
      :class="{ 'tw:line-clamp-4': isLong && !expanded }"
    >
      {{ isLong && !expanded ? preview : content }}
    </p>
    <UButton
      v-if="isLong"
      :label="$t(expanded ? 'detail.showLess' : 'detail.showMore')"
      :trailing-icon="
        expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'
      "
      :aria-expanded="expanded"
      :aria-controls="contentId"
      color="primary"
      variant="link"
      size="sm"
      class="tw:mt-2 tw:p-0 tw:font-semibold"
      @click="expanded = !expanded"
    />
  </div>
</template>
