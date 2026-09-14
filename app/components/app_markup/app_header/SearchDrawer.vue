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
    aria-label="Search filters"
    class="tw:fixed tw:bottom-0 tw:left-0 tw:top-16 tw:z-2010 tw:w-87.5 tw:overflow-y-auto tw:bg-slate-100 tw:p-4 tw:shadow-lg"
  >
    <SearchFilters />
  </aside>
  <USlideover
    v-else
    v-model:open="drawer"
    side="left"
    :title="t('search.drawer.additionalFilters')"
    :ui="{
      overlay: 'tw:z-[3290]',
      content: 'tw:z-[3300] tw:max-w-[350px]',
      body: 'tw:bg-slate-100',
    }"
  >
    <template #body><SearchFilters /></template>
  </USlideover>
</template>
