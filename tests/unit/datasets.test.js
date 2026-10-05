import { afterEach, expect, it, vi } from "vitest";
import axios from "axios";
import SearchService from "@/services/SearchService";
import { parseDatasetsResponse } from "@/utils/datasets";

vi.mock("axios", () => ({ default: { get: vi.fn() } }));

afterEach(() => vi.clearAllMocks());

it("requests dataset facets through the existing Solr proxy and maps them", async () => {
  axios.get.mockResolvedValue({
    data: {
      facet_counts: {
        facet_pivot: {
          "datasourceurl,datasetowner,recordbasis": [
            {
              value: "https://source.test",
              count: 7,
              pivot: [
                {
                  value: "Department of Geology, TalTech",
                  count: 4,
                  pivot: [{ value: "Fossil", count: 4 }],
                },
                {
                  value: "Other museum",
                  count: 3,
                  pivot: [
                    { value: "Fossil", count: 2 },
                    { value: "Rock", count: 1 },
                  ],
                },
              ],
            },
            { value: "https://unknown.test", count: 1 },
            { value: "", count: 10 },
            { value: "https://empty.test", count: 0 },
          ],
        },
      },
    },
  });

  await expect(SearchService.getDatasets()).resolves.toEqual([
    {
      url: "https://source.test",
      count: 7,
      owners: [
        {
          name: "Department of Geology, TalTech",
          count: 4,
          institutionId: "tallinn-university-of-technology",
        },
        { name: "Other museum", count: 3, institutionId: null },
      ],
      specimenTypes: ["Fossil", "Rock"],
    },
    {
      url: "https://unknown.test",
      count: 1,
      owners: [],
      specimenTypes: [],
    },
  ]);

  expect(axios.get).toHaveBeenCalledWith("/api/", {
    params: {
      q: "*:*",
      rows: 0,
      facet: "on",
      "facet.pivot": "datasourceurl,datasetowner,recordbasis",
      "facet.limit": -1,
      "facet.mincount": 1,
    },
  });
});

it("rejects responses that do not contain the expected facet data", () => {
  expect(() => parseDatasetsResponse({})).toThrow(
    "The Solr response is missing dataset facet data",
  );
});
