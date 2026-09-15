<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useAppNavigation } from "@/composables/useAppNavigation";

type PopupData = {
  id: string | number | null;
  locality: string;
  lat: string | number | null;
  lng: string | number | null;
};

type Specimen = {
  geocase_id: string;
  unitid?: string;
  fullscientificname?: string;
  recordbasis?: string;
  mindat_id?: string | number;
  mindat_url?: string;
};

type MapResult = {
  numFound: number;
  docs: Specimen[];
};

const props = withDefaults(
  defineProps<{
    activePopupData: PopupData;
    mapResults: Record<string | number, MapResult>;
    popupMaxWidth?: string;
  }>(),
  { popupMaxWidth: "400px" },
);

defineEmits<{ "clicked:searchButton": [] }>();

const { t } = useI18n();
const { localePath } = useAppNavigation();
const page = ref(1);
const pageSize = 10;
const activeResult = computed(() =>
  props.activePopupData.id == null
    ? undefined
    : props.mapResults[props.activePopupData.id],
);
const activeNumFound = computed(() => activeResult.value?.numFound ?? 0);
const activeDocs = computed(() => activeResult.value?.docs ?? []);
const visibleDocs = computed(() =>
  activeDocs.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);

watch(
  () => props.activePopupData.id,
  () => {
    page.value = 1;
  },
);

function specimenIcon(recordbasis?: string) {
  return (
    {
      Fossil: "i-lucide-fish",
      Mineral: "i-lucide-gem",
      Rock: "i-lucide-mountain",
      Meteorite: "i-lucide-orbit",
    }[recordbasis ?? ""] ?? "i-lucide-circle"
  );
}

function openMindat(url?: string) {
  if (url) window.open(url, "MindatWindow", "width=800,height=750");
}
</script>

<template>
  <UCard
    class="tw:text-home-ink tw:overflow-hidden tw:rounded-2xl"
    :style="{ width: popupMaxWidth, maxWidth: 'calc(100vw - 48px)' }"
    :ui="{ body: 'tw:p-0 tw:sm:p-0' }"
  >
    <div class="tw:border-b tw:border-slate-200 tw:p-4">
      <h3 class="tw:text-lg tw:font-extrabold">
        {{ activePopupData.locality }}
      </h3>
      <p class="tw:mt-1 tw:text-xs tw:text-slate-600">
        Lat: {{ activePopupData.lat }} · Long: {{ activePopupData.lng }}
      </p>
    </div>

    <template v-if="activeNumFound">
      <div class="tw:flex tw:items-center tw:justify-between tw:px-4 tw:py-3">
        <span class="tw:text-sm tw:font-semibold">
          {{ t("frontPage.map.numFound") }}
        </span>
        <UBadge color="neutral" variant="soft">{{ activeNumFound }}</UBadge>
      </div>
      <div class="tw:max-h-56 tw:overflow-auto tw:border-y tw:border-slate-200">
        <table class="tw:w-full tw:border-collapse tw:text-left tw:text-xs">
          <thead class="tw:sticky tw:top-0 tw:bg-white">
            <tr class="tw:border-b tw:border-slate-200">
              <th class="tw:w-8 tw:p-2">
                <span class="tw:sr-only">Type</span>
              </th>
              <th class="tw:p-2 tw:font-bold">
                {{ t("search.table.unitid") }}
              </th>
              <th class="tw:p-2 tw:font-bold">
                {{ t("search.table.fullscientificname") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in visibleDocs"
              :key="item.geocase_id"
              class="tw:border-b tw:border-slate-100 tw:last:border-0"
            >
              <td class="tw:p-2">
                <NuxtLink
                  :to="
                    localePath(
                      `/specimen/${encodeURIComponent(item.geocase_id)}`,
                    )
                  "
                  :title="t('search.goToDetailView')"
                  class="tw:text-primary"
                >
                  <UIcon
                    :name="specimenIcon(item.recordbasis)"
                    aria-hidden="true"
                  />
                </NuxtLink>
              </td>
              <td class="tw:p-2">
                <NuxtLink
                  :to="
                    localePath(
                      `/specimen/${encodeURIComponent(item.geocase_id)}`,
                    )
                  "
                  :title="t('search.goToDetailView')"
                  class="tw:font-semibold tw:text-primary tw:no-underline tw:hover:underline"
                >
                  {{ item.unitid }}
                </NuxtLink>
              </td>
              <td class="tw:p-2">
                <button
                  v-if="item.mindat_id"
                  type="button"
                  class="tw:inline-flex tw:items-center tw:gap-1 tw:text-left tw:text-primary tw:hover:underline"
                  :title="t('search.mindatLink')"
                  @click="openMindat(item.mindat_url)"
                >
                  {{ item.fullscientificname }}
                  <UIcon name="i-lucide-external-link" aria-hidden="true" />
                </button>
                <span v-else>{{ item.fullscientificname }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-if="activeNumFound > pageSize"
        class="tw:flex tw:justify-center tw:p-2"
      >
        <UPagination
          v-model:page="page"
          :total="activeNumFound"
          :items-per-page="pageSize"
          size="xs"
        />
      </div>
    </template>

    <div v-else class="tw:flex tw:justify-end tw:p-3">
      <UButton
        size="sm"
        variant="ghost"
        icon="i-lucide-search"
        :label="t('frontPage.map.search')"
        @click="$emit('clicked:searchButton')"
      />
    </div>
  </UCard>
</template>
