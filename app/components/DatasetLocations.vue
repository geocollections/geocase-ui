<script setup>
import { useRouter } from "#imports";
import MapWrapper from "@/components/MapWrapper.vue";
import { $fetch } from "ofetch";
const router = useRouter();
const { localePath } = useAppNavigation();
const props = defineProps({ source: { type: String, required: true } });
const { t, n } = useI18n();
const points = ref([]);
const loadedRecords = ref([]);
const coordinateRecords = ref(null);
const shownRecords = computed(() => points.value.reduce((sum, point) => sum + point.mapCount, 0));
const escapeFilter = (value) => value.replace(/["\\]/g, "\\$&");
const datasetFilters = () => [
  `datasourceurl:"${escapeFilter(props.source)}"`,
];
async function loadLocationRecords(latitude, longitude, page) {
  const records = loadedRecords.value.filter((record) => record.latitude === latitude && record.longitude === longitude);
  return { numFound: records.length, docs: records.slice((page - 1) * 20, page * 20) };
}
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
        fl: "geocase_id,unitid,fullscientificname,latitude,longitude,locality,country",
      },
      timeout: 15000,
    });
    if (disposed) return;
    const matches = result.response?.numFound;
    coordinateRecords.value = Number.isInteger(matches) && matches >= 0 ? matches : null;
    loadedRecords.value = (result.response?.docs ?? []).flatMap((record) => {
      if (!record?.geocase_id || record.latitude == null || record.longitude == null) return [];
      const latitude = Number(record.latitude), longitude = Number(record.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
      return [{ ...record, latitude, longitude }];
    });
    const locations = new Map();
    for (const record of loadedRecords.value) {
      const key = `${record.latitude},${record.longitude}`;
      const location = locations.get(key);
      if (location) location.mapCount += 1;
      else locations.set(key, { ...record, has_map: true, mapCount: 1 });
    }
    points.value = [...locations.values()];
  } catch { if (!disposed) failed.value = true; }
  finally { if (!disposed) loading.value = false; }
});
onBeforeUnmount(() => { disposed = true; });
</script>
<template>
  <section :aria-label="t('datasetDetail.map')" class="tw:overflow-hidden tw:rounded-xl tw:border tw:border-default">
    <div class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:bg-muted/30 tw:px-4 tw:py-3">
      <div>
        <h2 class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold"><UIcon name="i-lucide-map" aria-hidden="true" />{{ t("datasetDetail.map") }}</h2>
        <div v-if="!loading && !failed && coordinateRecords !== null" role="status" class="tw:mt-3 tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-2 tw:text-sm tw:font-semibold">
          <p>{{ t("datasetDetail.mapPointsCount", { shown: n(shownRecords), total: n(coordinateRecords ?? shownRecords) }) }}</p>
          <p>{{ t("datasetDetail.mapLoadedLocations", { count: n(points.length) }) }}</p>
        </div>
        <div v-if="!loading && !failed && coordinateRecords !== null" class="tw:mt-2 tw:max-w-2xl tw:space-y-2 tw:text-sm tw:leading-6 tw:text-muted">
          <p>{{ t(coordinateRecords === 0 ? "datasetDetail.mapNoLocations" : "datasetDetail.mapRecordLimit") }}</p>
          <p v-if="coordinateRecords > 0">{{ t("datasetDetail.mapLoadedSummary", { records: n(shownRecords), locations: n(points.length) }) }}</p>
          <p v-if="coordinateRecords > 0">{{ t("datasetDetail.mapInteraction") }}</p>
        </div>
      </div>
      <div class="tw:flex tw:gap-1">
        <UButton v-if="open" color="neutral" variant="ghost" size="sm" :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'" :aria-label="t(expanded ? 'search.layout.reduceMap' : 'search.layout.expandMap')" :aria-pressed="expanded" @click="expanded = !expanded" />
        <UButton color="neutral" variant="ghost" size="sm" :icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" :label="t(open ? 'search.layout.hideMap' : 'search.layout.showMap')" :aria-expanded="open" aria-controls="dataset-map-content" @click="open = !open" />
      </div>
    </div>
    <p v-if="failed" role="status" class="tw:p-4">{{ t("datasetDetail.mapError") }}</p>
    <div id="dataset-map-content" v-show="open" class="tw:relative">
      <UProgress v-if="loading" class="tw:absolute tw:inset-x-0 tw:top-0 tw:z-1000" size="xs" />
      <MapWrapper :load-location-records="loadLocationRecords" selectable-locations @select-location="selectLocation" map-id="dataset-map" :open="open" :height="expanded ? '65vh' : '450px'" :response-results="points" :response-results-count="points.length" />
    </div>
  </section>
</template>
