<script setup lang="ts">
import ProviderDataTree from "@/components/ProviderDataTree.vue";
defineProps<{ data: unknown }>();
const { t } = useI18n();
</script>
<template>
  <details v-if="data" class="tw:group tw:mt-8 tw:min-w-0 tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-default tw:bg-default tw:shadow-sm">
    <summary class="tw:flex tw:cursor-pointer tw:list-none tw:items-center tw:justify-between tw:gap-3 tw:px-6 tw:py-5 tw:font-semibold tw:text-highlighted tw:marker:hidden">
      {{ t("detail.dataFromProvider") }}
      <UIcon name="i-lucide-chevron-down" class="tw:size-5 tw:shrink-0 tw:transition-transform tw:group-open:rotate-180" aria-hidden="true" />
    </summary>
    <div class="tw:max-h-125 tw:overflow-auto tw:border-t tw:border-default tw:p-5">
      <ProviderDataTree :data="data" />
    </div>
  </details>
</template>
