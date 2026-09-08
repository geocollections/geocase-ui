<template>
  <v-menu transition="slide-y-transition" offset="8" location="bottom end">
    <template #activator="menu">
      <v-tooltip location="bottom" open-delay="500" z-index="5000">
        <template #activator="tooltip">
          <v-btn
            color="primary"
            aria-label="export table"
            class="montserrat"
            v-bind="mergeProps(menu.props, tooltip.props)"
            icon
          >
            <v-icon>mdi-file-export-outline</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("search.table.tooltipExport") }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item @click="handleExportCsv()">
        <v-list-item-title>CSV</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleExportExcel()">
        <v-list-item-title>XLSX (Excel)</v-list-item-title>
      </v-list-item>
      <v-list-item @click="handleClipboard()">
        <v-list-item-title>
          {{ $t("search.table.clipboard") }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mergeProps } from "vue";
import exportMixin from "@/mixins/exportMixin";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "ExportControls",
  methods: { mergeProps },
  mixins: [exportMixin, toastMixin],
};
</script>
