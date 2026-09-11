<script setup lang="ts">
import { computed } from "vue";
import { useNuxtApp } from "#imports";
import { useI18n } from "vue-i18n";
import { utils, writeFile } from "xlsx";

const { t } = useI18n();
const { $toast } = useNuxtApp();

function getTable() {
  const table = document.querySelector<HTMLTableElement>("#table table");
  if (!table) throw new Error("Results table not found");
  return table;
}

function createWorkbook() {
  const table = getTable().cloneNode(true) as HTMLTableElement;
  table
    .querySelectorAll(".v-data-table-header__sort-badge")
    .forEach((indicator) => indicator.remove());
  return utils.table_to_book(table);
}

function toastSuccess(text: string) {
  $toast.success?.(text, "OK", {
    position: "topCenter",
    timeout: 5000,
    pauseOnHover: false,
  });
}

function toastError(error: unknown) {
  console.error(error);
  $toast.error?.(t("search.export.downloadFailed"), "Error", {
    position: "topCenter",
    timeout: 5000,
    closeOnEscape: true,
    pauseOnHover: false,
    displayMode: "replace",
  });
}

function handleExportCsv() {
  try {
    writeFile(createWorkbook(), "GeoCASe.csv", { bookType: "csv" });
    toastSuccess(t("search.export.exportSuccessful", { type: "CSV" }));
  } catch (error) {
    toastError(error);
  }
}

function handleExportExcel() {
  try {
    writeFile(createWorkbook(), "GeoCASe.xlsx", { bookType: "xlsx" });
    toastSuccess(t("search.export.exportSuccessful", { type: "XLSX" }));
  } catch (error) {
    toastError(error);
  }
}

async function handleClipboard() {
  try {
    await navigator.clipboard.writeText(getTable().innerText);
    toastSuccess(t("search.export.copySuccessful"));
  } catch (error) {
    toastError(error);
  }
}

const exportItems = computed(() => [
  { label: "CSV", onSelect: handleExportCsv },
  { label: "XLSX (Excel)", onSelect: handleExportExcel },
  { label: t("search.table.clipboard"), onSelect: handleClipboard },
]);
</script>

<template>
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
      aria-label="export table"
      :title="t('search.table.tooltipExport')"
    />
  </UDropdownMenu>
</template>
