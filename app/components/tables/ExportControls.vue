<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { utils, writeFile } from "xlsx";
import SearchService from "@/services/SearchService";
import { useSearchStore } from "@/stores/search";
import { exportRows } from "@/utils/exportRecords";
import type { ExportColumn } from "@/utils/exportRecords";

const { t } = useI18n();
const store = useSearchStore();
const busy = ref(false);
const error = ref(false);
const loaded = ref(0);
const total = ref(0);
let controller: AbortController | undefined;
const disabled = computed(() => store.isLoading || store.resultsError || !store.responseResults.length || busy.value);

function columns(): ExportColumn[] {
  const headers: ExportColumn[] = store.getAllShownTableHeaders.map(({ value, text }: ExportColumn) => ({ value: value === "url" ? "images" : value, text }));
  if (!headers.some(({ value }) => value === "geocase_id")) {
    headers.unshift({ value: "geocase_id", text: "GeoCASe ID" });
  }
  return headers;
}

async function exportPage(format: "csv" | "xlsx" | "clipboard") {
  error.value = false;
  try {
    const headers = columns();
    const sheet = utils.aoa_to_sheet([
      headers.map(({ text }) => text),
      ...exportRows(store.responseResults, headers),
    ]);
    if (format === "clipboard") {
      await navigator.clipboard.writeText(utils.sheet_to_csv(sheet, { FS: "\t" }));
    } else {
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, sheet, "GeoCASe");
      writeFile(workbook, `GeoCASe-page-${store.page}.${format}`, { bookType: format });
    }
  } catch {
    error.value = true;
  }
}

async function exportAll() {
  busy.value = true;
  error.value = false;
  loaded.value = 0;
  total.value = store.responseResultsCount;
  const headers = columns();
  const params = {
    page: 1, paginateBy: 1000,
    sortBy: [...store.sortBy], sortDesc: [...store.sortDesc],
    searchIds: [...store.searchIds],
    search: JSON.parse(JSON.stringify(store.search)),
  };
  const activeController = new AbortController();
  controller = activeController;
  try {
    const chunks: string[] = ["\uFEFF"];
    const heading = utils.aoa_to_sheet([headers.map(({ text }) => text)]);
    chunks.push(utils.sheet_to_csv(heading), "\r\n");
    const fields = [...new Set([
      ...headers.map(({ value }) => value),
      ...(headers.some(({ value }) => value === "stratigraphy") ? ["stratigraphies", "stratigraphytexts"] : []),
    ])];
    for await (const batch of SearchService.exportRecords(params, fields, activeController.signal)) {
      total.value = batch.total;
      if (batch.docs.length) {
        const sheet = utils.aoa_to_sheet(exportRows(batch.docs, headers));
        chunks.push(utils.sheet_to_csv(sheet), "\r\n");
        loaded.value += batch.docs.length;
      }
    }
    activeController.signal.throwIfAborted();
    const url = URL.createObjectURL(new Blob(chunks, { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "GeoCASe-all-results.csv";
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch {
    if (!activeController.signal.aborted) error.value = true;
  } finally {
    busy.value = false;
    controller = undefined;
  }
}

onBeforeUnmount(() => controller?.abort());

const exportItems = computed(() => [
  {
    label: t("search.export.currentPage"),
    children: [
      { label: "CSV", onSelect: () => exportPage("csv") },
      { label: "XLSX (Excel)", onSelect: () => exportPage("xlsx") },
      { label: t("search.table.clipboard"), onSelect: () => exportPage("clipboard") },
    ],
  },
  { label: t("search.export.allResults"), onSelect: exportAll },
]);
</script>

<template>
  <div class="tw:flex tw:max-w-full tw:flex-wrap tw:items-center tw:gap-2">
    <UDropdownMenu
      :items="exportItems"
      :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
      :ui="{ content: 'tw:z-[5000]' }"
    >
      <UButton
        icon="i-lucide-file-output"
        color="primary"
        variant="solid"
        size="lg"
        :disabled="disabled"
        :loading="busy"
        :aria-label="t('search.export.export')"
        :title="t('search.table.tooltipExport')"
      />
    </UDropdownMenu>
    <span v-if="busy" role="status" class="tw:text-sm">
      {{ t('search.export.progress', { loaded: loaded.toLocaleString(), total: total.toLocaleString() }) }}
    </span>
    <UButton
      v-if="busy"
      :label="t('search.export.cancel')"
      variant="ghost"
      color="neutral"
      @click="controller?.abort()"
    />
    <span v-if="error" role="alert" class="tw:text-sm tw:text-error">
      {{ t('search.export.downloadFailed') }}
    </span>
  </div>
</template>
