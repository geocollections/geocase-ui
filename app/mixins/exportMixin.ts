import { utils, writeFile } from "xlsx";

type ToastData = { text: string };

interface ExportMixinThis {
  removeSortIndicators(table: HTMLTableElement): HTMLTableElement;
  createWorkbook(table: HTMLTableElement): ReturnType<typeof utils.table_to_book>;
  toastSuccess(data: ToastData): void;
  toastError(data: ToastData): void;
  $t(key: string, params?: Record<string, string>): string;
}

export default {
  methods: {
    filterItemsByKeys(
      this: ExportMixinThis,
      items: Record<string, unknown>[],
      keys: string[],
    ) {
      const filteredItems = items.map((item) => {
        const res: Record<string, unknown> = {};

        Object.keys(item).forEach((key) => {
          if (keys.includes(key)) {
            res[key] = item[key];
          }
        });
        return res;
      });
      return filteredItems;
    },
    removeSortIndicators(this: ExportMixinThis, table: HTMLTableElement) {
      const tableCopy = table.cloneNode(true) as HTMLTableElement;
      const sortIndicators = tableCopy.querySelectorAll(
        "thead > tr > th > .v-data-table-header__sort-badge",
      );
      sortIndicators.forEach((indicator) => {
        indicator.parentElement!.removeChild(indicator);
      });
      return tableCopy;
    },
    createWorkbook(this: ExportMixinThis, table: HTMLTableElement) {
      const tableCopy = this.removeSortIndicators(table);
      const wb = utils.table_to_book(tableCopy);
      return wb;
    },
    handleExportCsv(this: ExportMixinThis) {
      try {
        const wb = this.createWorkbook(
          document.querySelector<HTMLTableElement>("#table table")!,
        );

        writeFile(wb, "GeoCASe.csv", { bookType: "csv" });
        this.toastSuccess({
          text: this.$t("search.export.exportSuccessful", { type: "CSV" }),
        });
      } catch (err) {
        console.error(err);
        this.toastError({ text: this.$t("search.export.downloadFailed") });
      }
    },
    handleExportExcel(this: ExportMixinThis) {
      try {
        const wb = this.createWorkbook(
          document.querySelector<HTMLTableElement>("#table table")!,
        );

        writeFile(wb, "GeoCASe.xlsx", { bookType: "xlsx" });
        this.toastSuccess({
          text: this.$t("search.export.exportSuccessful", { type: "XLSX" }),
        });
      } catch (err) {
        console.error(err);
        this.toastError({ text: this.$t("search.export.downloadFailed") });
      }
    },
    handleClipboard(this: ExportMixinThis) {
      const el = document
        .getElementById("table")!
        .getElementsByTagName("table")[0]!;

      const body = document.body;
      let range: Range | undefined;
      let sel: Selection | undefined;
      if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection()!;
        sel.removeAllRanges();
        try {
          range.selectNodeContents(el);
          sel.addRange(range);
        } catch (e) {
          range.selectNode(el);
          sel.addRange(range);
        }
      } else if (
        (body as HTMLElement & { createTextRange?: () => LegacyTextRange })
          .createTextRange
      ) {
        const textRange = (
          body as HTMLElement & { createTextRange: () => LegacyTextRange }
        ).createTextRange();
        textRange.moveToElementText(el);
        textRange.select();
      }
      document.execCommand("Copy");
      sel!.removeAllRanges();

      this.toastSuccess({ text: this.$t("search.export.copySuccessful") });
    },
  },
};

interface LegacyTextRange {
  moveToElementText(element: Element): void;
  select(): void;
}
