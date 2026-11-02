import { describe, expect, it } from "vitest";
import { datasetWebUrl, datasetWebLinks, parseDatasetCatalog, findCatalogDataset } from "../../app/utils/datasetCatalog";

const dataset = {
  dataset_guid: "8fa26a2c-c99d-11f1-a7eb-269714084253",
  title: "Test collection",
  is_active: 1,
  is_published: 1,
};
describe("dataset catalog", () => {
  it("resolves GUID and numeric ID to the same dataset", () => {
    const item = { ...dataset, dataset_id: 2 };
    expect(findCatalogDataset([item], "2")).toBe(item);
    expect(findCatalogDataset([item], item.dataset_guid)).toBe(item);
    expect(findCatalogDataset([item], item.dataset_guid.toUpperCase())).toBe(item);
  });
  it("does not match malformed or unknown identifiers", () => {
    for (const id of ["0", "-2", "2.0", "2abc", "../2", "02", "999"]) {
      expect(findCatalogDataset([{ ...dataset, dataset_id: 2 }], id)).toBeUndefined();
    }
  });
  it("keeps public datasets and their nullable metadata", () => {
    expect(parseDatasetCatalog({ data: [{ ...dataset, citation: null }] })).toEqual([{ ...dataset, citation: null }]);
  });
  it("excludes unpublished, inactive and malformed entries", () => {
    expect(parseDatasetCatalog({ data: [
      { ...dataset, is_published: 0 }, { ...dataset, is_active: 0 },
      { ...dataset, dataset_guid: "../other" }, null, { title: "Missing GUID" },
    ] })).toEqual([]);
  });
  it("accepts the current GeoCASe publication flag without the legacy field", () => {
    const metadata = { dataset_guid: dataset.dataset_guid, title: dataset.title, is_active: 1 };
    const current = { ...metadata, is_published_geocase: 1, is_published_dcat: 1 };
    expect(parseDatasetCatalog({ data: [current] })).toEqual([current]);
  });
  it("uses GeoCASe visibility even when DCAT or the legacy flag is enabled", () => {
    expect(parseDatasetCatalog({ data: [
      { ...dataset, is_published_geocase: 0, is_published_dcat: 1 },
      { ...dataset, is_active: 0, is_published_geocase: 1 },
      { ...dataset, is_published: undefined, is_published_dcat: 1 },
    ] })).toEqual([]);
    const visible = { ...dataset, is_published: 0, is_published_geocase: true, is_published_dcat: 0 };
    expect(parseDatasetCatalog({ data: [visible] })).toEqual([visible]);
  });
  it("rejects unexpected upstream responses", () => {
    expect(() => parseDatasetCatalog({ error: "unavailable" })).toThrow();
  });
  it("rejects an HTML redirect response instead of rendering its characters", () => {
    expect(() => parseDatasetCatalog({ data: "<!DOCTYPE html><html>API docs</html>" })).toThrow();
  });
  it("allows only complete HTTP access links", () => {
    expect(datasetWebUrl("https://example.org/data")).toBe("https://example.org/data");
    for (const value of ["javascript:alert(1)", "data:text/html,test", "/relative", "", null]) {
      expect(datasetWebUrl(value)).toBeUndefined();
    }
  });
  it("separates metadata links before URL normalisation and preserves source labels", () => {
    const first = "http://purl.org/coar/resource_type/S7R1-K5P0";
    const second = "http://purl.org/coar/resource_type/c_ddb1";
    for (const separator of [" ", ",", ";", " ; \n", "\t"]) {
      expect(datasetWebLinks(first + separator + second)).toEqual([
        { label: first, href: first }, { label: second, href: second },
      ]);
    }
    expect(datasetWebLinks("https://example.org")).toEqual([
      { label: "https://example.org", href: "https://example.org/" },
    ]);
    expect(datasetWebLinks("https://example.org/a%20b")).toEqual([
      { label: "https://example.org/a%20b", href: "https://example.org/a%20b" },
    ]);
  });
  it("ignores empty and unsafe metadata links", () => {
    for (const value of [null, "", " , ; ", "javascript:alert(1); /relative"]) {
      expect(datasetWebLinks(value)).toEqual([]);
    }
  });

});
