<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useDesktopLayout } from "@/composables/useDesktopLayout";
import SearchFilters from "./SearchFilters.vue";
const drawer = defineModel<boolean>("drawer", { required: true });
const { isDesktop } = useDesktopLayout();
const { t } = useI18n();
</script>

<template>
  <aside
    v-if="isDesktop"
    v-show="drawer"
    :aria-label="t('search.drawer.filters')"
    class="tw:bg-default tw:border-default tw:fixed tw:bottom-0 tw:left-0 tw:top-16 tw:z-2010 tw:flex tw:w-87.5 tw:flex-col tw:border-r tw:shadow-xl"
  >
    <header
      class="tw:bg-default/95 tw:border-default tw:flex tw:items-center tw:gap-3 tw:border-b tw:px-4 tw:py-4 tw:backdrop-blur"
    >
      <span
        class="tw:bg-primary/10 tw:text-primary tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-lg"
      >
        <UIcon
          name="i-lucide-list-filter"
          class="tw:size-5"
          aria-hidden="true"
        />
      </span>
      <h2 class="tw:text-highlighted tw:text-base tw:font-semibold">
        {{ t("search.drawer.additionalFilters") }}
      </h2>
    </header>
    <div class="tw:flex-1 tw:overflow-y-auto tw:p-4">
      <SearchFilters />
    </div>
  </aside>
  <USlideover
    v-else
    v-model:open="drawer"
    side="left"
    :title="t('search.drawer.additionalFilters')"
    :ui="{
      overlay: 'tw:z-[3290]',
      content: 'tw:z-[3300] tw:max-w-87.5',
      header: 'tw:bg-default/95 tw:backdrop-blur',
      body: 'tw:bg-default tw:p-4 tw:sm:p-4',
    }"
  >
    <template #body><SearchFilters /></template>
  </USlideover>
</template>
