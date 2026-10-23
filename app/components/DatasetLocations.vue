<script setup>
import { useRouter } from "#imports";
import MapWrapper from "@/components/MapWrapper.vue";
import { $fetch } from "ofetch";
const router = useRouter();
const { localePath } = useAppNavigation();
const props = defineProps({ owner: { type: String, required: true }, source: { type: String, required: true } });
const { t } = useI18n();
const points = ref([]);
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
    const escape = (value) => value.replace(/["\\]/g, "\\$&");
    const grouping = "concat(latitude,',',longitude)";
    const result = await $fetch("/api", {
      query: {
        q: "*:*",
        fq: [`datasetowner:"${escape(props.owner)}"`, `datasourceurl:"${escape(props.source)}"`, "latitude:[-90 TO 90]", "longitude:[-180 TO 180]"],
        rows: 1000, start: 0, group: true, "group.func": grouping,
        "group.limit": 1, sort: "geocase_id asc",
        fl: "geocase_id,latitude,longitude,locality,country",
      },
      timeout: 15000,
    });
    if (disposed) return;
    points.value = (result.grouped?.[grouping]?.groups ?? []).flatMap((group) => {
      const record = group.doclist?.docs?.[0];
      if (!record?.geocase_id || record.latitude == null || record.longitude == null) return [];
      const latitude = Number(record.latitude), longitude = Number(record.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return [];
      return [{ ...record, latitude, longitude, has_map: true, mapCount: group.doclist.numFound }];
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
        <h2 class="tw:flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold"><UIcon name="i-lucide-map" aria-hidden="true" />{{ t("datasetDetail.map") }}</h2>
        <p class="tw:mt-1 tw:text-xs tw:text-muted">{{ t("datasetDetail.mapNote") }}</p>
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
