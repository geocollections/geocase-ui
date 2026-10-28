<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "#imports";

const route = useRoute();
const searchPath = computed(() =>
  route.params.locale ? `/${route.params.locale}/search` : "/search",
);
const returnPath = computed(() => {
  if (typeof window === "undefined") return searchPath.value;
  const savedPath = window.sessionStorage.getItem("geocase:last-search-path");
  return savedPath?.split(/[?#]/)[0] === searchPath.value
    ? savedPath
    : searchPath.value;
});
</script>

<template>
  <NuxtLink
    :to="returnPath"
    class="tw:bg-muted tw:text-highlighted tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:rounded-lg tw:px-3 tw:py-2 tw:text-sm tw:font-semibold tw:no-underline tw:transition-colors tw:hover:bg-elevated tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-primary"
  >
    <UIcon name="i-lucide-arrow-left" class="tw:size-4" aria-hidden="true" />
    {{ $t("detail.goBack") }}
  </NuxtLink>
</template>
