<script setup>
import { useRouter } from "#imports";
import MapWrapper from "@/components/MapWrapper.vue";
import { $fetch } from "ofetch";
const router = useRouter();
const { localePath } = useAppNavigation();
const props = defineProps({ source: { type: String, required: true } });
const { t, n } = useI18n();
const points = ref([]);
const coordinateRecords = ref(null);
const locationGrouping = "concat(latitude,',',longitude)";
const escapeFilter = (value) => value.replace(/["\\]/g, "\\$&");
const datasetFilters = () => [
  `datasourceurl:"${escapeFilter(props.source)}"`,
];
const loading = ref(true);
const open = ref(true);
const expanded = ref(false);
const failed = ref(false);
function selectLocation(item) {
  if (!item.geocase_id) return;
  void router.push(localePath("/specimen/" + encodeURIComponent(String(item.geocase_id))));
}
let disposed = false;
onMounted(async () => {
  try {
    const result = await $fetch("/api", {
      query: {
        q: "*:*",
        fq: [...datasetFilters(), "latitude:[-90 TO 90]", "longitude:[-180 TO 180]"],
        rows: 1000, start: 0, sort: "geocase_id asc",
        group: true, "group.func": locationGrouping, "group.limit": 1,
        fl: "geocase_id,unitid,fullscientificname,latitude,longitude,locality,country",
      },
      timeout: 15000,
    });
    if (disposed) return;
    const grouped = result.grouped?.[locationGrouping];
    const matches = grouped?.matches;
    coordinateRecords.value = Number.isInteger(matches) && matches >= 0 ? matches : null;
    points.value = (grouped?.groups ?? []).flatMap((group) => {
      const record = group.doclist?.docs?.[0];
      if (!record?.geocase_id || record.latitude == null || record.longitude == null) return [];
      const latitude = Number(record.latitude), longitude = Number(record.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
      return [{ ...record, latitude, longitude, has_map: true, mapCount: 1 }];
    });

  } catch { if (!disposed) failed.value = true; }
  finally { if (!disposed) loading.value = false; }
});
onBeforeUnmount(() => { disposed = true; });
</script>
<template>
  <section :aria-label="t('datasetDetail.map')" class="tw:overflow-hidden tw:rounded-xl tw:border tw:border-default">
    <div class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:bg-muted/30 tw:px-4 tw:py-3">
      <div>
        <div class="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
          <h2 class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold"><UIcon name="i-lucide-map" aria-hidden="true" />{{ t("datasetDetail.map") }}</h2>
          <UPopover v-if="!loading && !failed && coordinateRecords > 0">
            <UButton color="primary" variant="soft" size="sm" icon="i-lucide-info" :label="t('datasetDetail.mapHelp')" />
            <template #content>
              <div class="tw:w-80 tw:max-w-[calc(100vw-2rem)] tw:space-y-2 tw:p-4 tw:text-sm tw:leading-6">
                <p>{{ t("datasetDetail.mapRecordLimit") }}</p>
                <p>{{ t("datasetDetail.mapNote") }}</p>
              </div>
            </template>
          </UPopover>
        </div>
        <div v-if="!loading && !failed && coordinateRecords !== null" role="status" class="tw:mt-3 tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-2 tw:text-sm tw:font-semibold">
          <p>{{ t("datasetDetail.mapLoadedLocations", { count: n(points.length) }) }}</p>
        </div>
        <p v-if="!loading && !failed && coordinateRecords === 0" role="status" class="tw:mt-2 tw:text-sm tw:text-muted">{{ t("datasetDetail.mapNoLocations") }}</p>
      </div>
      <div class="tw:flex tw:gap-1">
        <UButton v-if="open" color="neutral" variant="ghost" size="sm" :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'" :aria-label="t(expanded ? 'search.layout.reduceMap' : 'search.layout.expandMap')" :aria-pressed="expanded" @click="expanded = !expanded" />
        <UButton color="neutral" variant="ghost" size="sm" :icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" :label="t(open ? 'search.layout.hideMap' : 'search.layout.showMap')" :aria-expanded="open" aria-controls="dataset-map-content" @click="open = !open" />
      </div>
    </div>
    <p v-if="failed" role="status" class="tw:p-4">{{ t("datasetDetail.mapError") }}</p>
    <div id="dataset-map-content" v-show="open" class="tw:relative">
      <UProgress v-if="loading" class="tw:absolute tw:inset-x-0 tw:top-0 tw:z-1000" size="xs" />
      <MapWrapper selectable-locations @select-location="selectLocation" map-id="dataset-map" :open="open" :height="expanded ? '65vh' : '450px'" :response-results="points" :response-results-count="points.length" />
    </div>
  </section>
</template>
