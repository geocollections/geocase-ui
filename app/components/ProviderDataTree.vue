<script setup lang="ts">
import { computed } from "vue";

defineOptions({ name: "ProviderDataTree" });
const props = withDefaults(
  defineProps<{
    data: unknown;
    depth?: number;
  }>(),
  { depth: 0 },
);

const entries = computed(() =>
  props.data !== null && typeof props.data === "object"
    ? Object.entries(props.data)
    : [],
);
</script>

<template>
  <ul
    class="tw:space-y-1 tw:pl-3 tw:text-sm tw:leading-relaxed tw:text-highlighted"
  >
    <li v-for="[key, value] in entries" :key="key" class="tw:min-w-0">
      <details
        v-if="value !== null && typeof value === 'object'"
        :open="depth < 2"
        class="tw:group"
      >
        <summary
          class="tw:cursor-pointer tw:rounded-md tw:px-2 tw:py-1 tw:font-semibold tw:hover:bg-muted tw:focus-visible:outline-2 tw:focus-visible:outline-primary"
        >
          {{ key }}
        </summary>
        <ProviderDataTree :data="value" :depth="depth + 1" />
      </details>
      <div v-else class="tw:rounded-md tw:px-2 tw:py-1 tw:wrap-anywhere">
        <span class="tw:font-semibold">{{ key }}:</span>
        {{ value }}
      </div>
    </li>
  </ul>
</template>
