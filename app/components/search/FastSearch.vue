<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useRoute, useRouter } from "#imports";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useSearchStore } from "@/stores/search";
import HelpButton from "@/components/search/fast_search/HelpButton.vue";

withDefaults(
  defineProps<{
    inAppHeader?: boolean;
  }>(),
  { inAppHeader: false },
);

const route = useRoute();
const router = useRouter();
const { locale, t } = useI18n();
const searchStore = useSearchStore();
const { search } = storeToRefs(searchStore);
const showHelp = ref(false);
const fastSearch = ref(String(search.value.q.value ?? ""));
let updateTimer: ReturnType<typeof setTimeout> | undefined;

function updateStore(value: string) {
  searchStore.updateSearchField({ id: "q", value });
  searchStore.updateSortBy([]);
  searchStore.updateSortDesc([]);
  if (searchStore.page !== 1) searchStore.updatePage(1);
}

function scheduleStoreUpdate(value: string) {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(() => updateStore(value), 250);
}

function cancelStoreUpdate() {
  clearTimeout(updateTimer);
  updateTimer = undefined;
}

watch(fastSearch, scheduleStoreUpdate);
watch(
  () => search.value.q.value,
  (value) => {
    const normalizedValue = String(value ?? "");
    if (normalizedValue !== fastSearch.value) fastSearch.value = normalizedValue;
  },
);

onBeforeUnmount(cancelStoreUpdate);

const searchRoute = computed(() => ({
  name: "Search",
  params: locale.value !== "en" ? { locale: locale.value } : {},
  query: { ...route.query, q: fastSearch.value || undefined, page: 1 },
}));

async function submitSearch() {
  cancelStoreUpdate();
  updateStore(fastSearch.value);
  await router.push(searchRoute.value);
}
</script>

<template>
  <div
    class="tw:flex tw:w-full tw:justify-center"
    :class="inAppHeader ? 'tw:px-4' : 'tw:py-6'"
  >
    <form
      class="tw:w-full"
      :class="
        inAppHeader
          ? 'tw:max-w-none'
          : 'tw:px-2 tw:sm:max-w-3/4 tw:md:max-w-5/12 tw:lg:max-w-1/3'
      "
      role="search"
      @submit.prevent="submitSearch"
    >
      <UInput
        v-model="fastSearch"
        :placeholder="t('frontPage.quickSearch')"
        :aria-label="t('frontPage.quickSearch')"
        :autofocus="route.name === 'FrontPage'"
        autocomplete="off"
        color="neutral"
        variant="outline"
        :size="inAppHeader ? 'md' : 'xl'"
        class="tw:w-full tw:font-semibold"
        :ui="{
          base: inAppHeader
            ? 'tw:bg-white tw:text-base tw:text-slate-950'
            : 'tw:min-h-15 tw:bg-white tw:text-xl tw:text-slate-950',
          trailing: 'tw:pe-1',
        }"
      >
        <template #trailing>
          <div class="tw:flex tw:items-center tw:gap-1">
            <UButton
              v-if="!inAppHeader"
              type="button"
              icon="i-lucide-circle-help"
              color="neutral"
              variant="ghost"
              size="lg"
              :aria-label="t('searchHelp.title')"
              @click="showHelp = true"
            />
            <UButton
              type="submit"
              icon="i-lucide-search"
              color="primary"
              variant="ghost"
              :size="inAppHeader ? 'md' : 'lg'"
              :aria-label="t('frontPage.quickSearch')"
            />
          </div>
        </template>
      </UInput>
    </form>

    <HelpButton :show-help="showHelp" @close="showHelp = false" />
  </div>
</template>
