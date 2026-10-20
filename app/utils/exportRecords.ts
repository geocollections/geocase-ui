export type ExportColumn = { value: string; text: string };

export function exportRows(records: Record<string, unknown>[], columns: ExportColumn[]) {
  return records.map((record) => columns.map(({ value }) => {
    const raw = value === "stratigraphy"
      ? record.stratigraphies ?? record.stratigraphytexts ?? record[value]
      : record[value];
    if (raw == null) return "";
    if (Array.isArray(raw)) return raw.filter((item) => item != null).join("; ");
    if (typeof raw === "object") return JSON.stringify(raw);
    return raw;
  }));
}
