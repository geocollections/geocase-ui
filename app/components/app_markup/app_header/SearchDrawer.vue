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
    class="tw:bg-default tw:border-accented tw:sticky tw:top-16 tw:z-10 tw:flex tw:h-[calc(100dvh-4rem)] tw:w-87.5 tw:shrink-0 tw:flex-col tw:self-start tw:border-r tw:shadow-xl"
  >
    <header
      class="tw:bg-default/95 tw:border-accented tw:border-b tw:px-5 tw:py-5 tw:backdrop-blur"
    >
      <h2
        class="tw:text-highlighted tw:text-xl tw:font-extrabold tw:tracking-tight"
      >
        {{ t("search.drawer.filters") }}
      </h2>
    </header>
    <div class="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:p-4">
      <SearchFilters />
    </div>
  </aside>
  <USlideover
    v-else
    v-model:open="drawer"
    side="left"
    :title="t('search.drawer.filters')"
    :ui="{
      overlay: 'tw:z-[3290]',
      content: 'tw:z-[3300] tw:max-w-87.5',
      header: 'tw:bg-default/95 tw:backdrop-blur',
      title:
        'tw:text-highlighted tw:text-xl tw:font-extrabold tw:tracking-tight',
      body: 'tw:bg-default tw:p-4 tw:sm:p-4',
    }"
  >
    <template #body><SearchFilters /></template>
  </USlideover>
</template>
