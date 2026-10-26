<script setup lang="ts">
import { watch } from "vue";
import { useSearchStore } from "@/stores/search";
import { useI18n } from "vue-i18n";
import { useDesktopLayout } from "@/composables/useDesktopLayout";
import SearchFilters from "./SearchFilters.vue";
const drawer = defineModel<boolean>("drawer", { required: true });
const { isDesktop } = useDesktopLayout();
const { t } = useI18n();
const search = useSearchStore();
let trigger: HTMLElement | null = null;
watch(drawer, (open) => {
  if (open && typeof document !== "undefined")
    trigger = document.activeElement as HTMLElement;
});
function restoreFocus(event: Event) {
  event.preventDefault();
  const target = trigger?.isConnected
    ? trigger
    : document.getElementById("search-filters-toggle");
  target?.focus();
}
</script>

<template>
  <aside
    id="search-filters-panel"
    v-if="isDesktop"
    v-show="drawer"
    :aria-label="t('search.drawer.filters')"
    class="tw:bg-default tw:sticky tw:top-16 tw:z-10 tw:flex tw:h-[calc(100dvh-4rem)] tw:w-87.5 tw:shrink-0 tw:flex-col tw:self-start tw:shadow-lg"
  >
    <div class="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:p-4">
      <SearchFilters />
    </div>
  </aside>
  <USlideover
    v-else
    v-model:open="drawer"
    side="left"
    :title="t('search.drawer.filters')"
    :content="{ onCloseAutoFocus: restoreFocus }"
    :ui="{
      overlay: 'tw:z-[3290]',
      content: 'mobile-touch-controls tw:z-[3300] tw:max-w-87.5',
      header: 'tw:bg-default/95 tw:backdrop-blur',
      title:
        'tw:text-highlighted tw:text-xl tw:font-extrabold tw:tracking-tight',
      body: 'tw:bg-default tw:p-4 tw:sm:p-4',
    }"
  >
    <template #body
      ><div id="search-filters-panel"><SearchFilters /></div
    ></template>
    <template #footer>
      <UButton
        block
        size="lg"
        color="primary"
        icon="i-lucide-search"
        class="tw:min-h-11"
        :label="
          search.isLoading
            ? t('search.backToResults')
            : t('search.showResults', {
                count: search.responseResultsCount.toLocaleString(),
              })
        "
        @click="drawer = false"
      />
    </template>
  </USlideover>
</template>
