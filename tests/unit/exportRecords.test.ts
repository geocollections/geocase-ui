import { describe, expect, it } from "vitest";
import { read, utils } from "xlsx";
import { exportRows } from "@/utils/exportRecords";

describe("data exports", () => {
  it("exports raw values, URLs and multi-valued fields without UI content", () => {
    const columns = ["unitid", "recordURI", "images", "stratigraphy", "latitude", "has_image", "missing"].map((value) => ({ value, text: value }));
    expect(exportRows([{
      unitid: "A-1", recordURI: "https://example.org/record/1",
      images: ["https://example.org/1.jpg", "https://example.org/2.jpg"],
      stratigraphies: ["Ordovician", "Silurian"], latitude: 0, has_image: false,
    }], columns)).toEqual([["A-1", "https://example.org/record/1", "https://example.org/1.jpg; https://example.org/2.jpg", "Ordovician; Silurian", 0, false, ""]]);
  });

  it("preserves commas, quotes and line breaks in CSV", () => {
    const record = { name: 'Quartz, "crystal"\nEstonia' };
    const sheet = utils.aoa_to_sheet([["Name"], ...exportRows([record], [{ value: "name", text: "Name" }])]);
    const csv = utils.sheet_to_csv(sheet);
    const parsed = utils.sheet_to_json(read(csv, { type: "string", raw: true }).Sheets.Sheet1, { header: 1 });
    expect(parsed).toEqual([["Name"], [record.name]]);
  });
});
