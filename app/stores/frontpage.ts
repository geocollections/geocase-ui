import { defineStore } from "pinia";
import SearchService from "@/services/SearchService";
import { useSettingsStore } from "./settings";
import i18n from "@/i18n";

type SolrRecord = Record<string, any>;
type CardId = "materialSample" | "fossil" | "mineral" | "rock" | "meteorite";

interface FrontpageCard {
  url: string;
  image: string;
  imageModifiers?: { rotate: number; width: number; height: number; fit: string; quality: number; position?: string };
  isLeaving: boolean;
}

interface FrontpageState {
  records: number | string;
  datasetowner: number | string;
  country: number | string;
  datasourceurl: number | string;
  datasets: { url: string; count: number }[];
  hasMaterialSamples: boolean;
  cardIds: CardId[];
  cards: Record<CardId, FrontpageCard>;
  mapResults: Record<string, { numFound: number; docs: SolrRecord[] }>;
}

interface StatsPayload {
  records?: number;
  facet_fields?: Record<string, (string | number)[]>;
}

export const useFrontpageStore = defineStore("frontpage", {
  state: (): FrontpageState => ({
    records: "",
    datasetowner: "",
    country: "",
    datasourceurl: "",
    datasets: [] as { url: string; count: number }[],
    hasMaterialSamples: false,
    cardIds: ["mineral", "rock", "meteorite", "fossil", "materialSample"],
    cards: {
      materialSample: {
        url: '/search?recordbasis="MaterialSample"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/materialsample2.jpg",
        isLeaving: false,
      },
      fossil: {
        url: '/search?recordbasis="Fossil" "FossilSpecimen"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/fossil2.jpg",
        isLeaving: false,
      },
      mineral: {
        url: '/search?recordbasis="Mineral" "MineralSpecimen"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/mineral1.jpg",
        isLeaving: false,
      },
      rock: {
        url: '/search?recordbasis="Rock" "RockSpecimen"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/rock2.jpg",
        isLeaving: false,
      },
      meteorite: {
        url: '/search?recordbasis="Meteorite" "MeteoriteSpecimen"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/meteorite2.jpg",
        isLeaving: false,
      },
    },
    mapResults: {},
  }),
  getters: {
    stats: (state) => {
      return [
        {
          text: i18n.t("frontPage.totalRecords"),
          count: state.records,
          id: 1,
        },
        {
          text: i18n.t("frontPage.institutionCount"),
          count: state.datasetowner,
          id: 2,
        },
        {
          text: i18n.t("frontPage.countryCount"),
          count: state.country,
          id: 3,
        },
        {
          text: i18n.t("frontPage.datasetCount"),
          count: state.datasourceurl,
          id: 4,
        },
      ]
        .sort((a, b) => Number(b.count) - Number(a.count))
        .map((item) => ({ ...item, count: item.count.toLocaleString() }));
    },
    getCards: (state) => {
      return {
        fossil: {
          ...state.cards.fossil,
          title: i18n.t("frontPage.cards.fossils.title"),
          text: i18n.t("frontPage.cards.fossils.text"),
          button: i18n.t("frontPage.cards.fossils.button"),
          imageAltText: i18n.t("frontPage.cards.fossils.imageAltText"),
        },
        mineral: {
          ...state.cards.mineral,
          title: i18n.t("frontPage.cards.minerals.title"),
          text: i18n.t("frontPage.cards.minerals.text"),
          button: i18n.t("frontPage.cards.minerals.button"),
          imageAltText: i18n.t("frontPage.cards.minerals.imageAltText"),
        },
        rock: {
          ...state.cards.rock,
          title: i18n.t("frontPage.cards.rocks.title"),
          text: i18n.t("frontPage.cards.rocks.text"),
          button: i18n.t("frontPage.cards.rocks.button"),
          imageAltText: i18n.t("frontPage.cards.rocks.imageAltText"),
        },
        meteorite: {
          ...state.cards.meteorite,
          title: i18n.t("frontPage.cards.meteorites.title"),
          text: i18n.t("frontPage.cards.meteorites.text"),
          button: i18n.t("frontPage.cards.meteorites.button"),
          imageAltText: i18n.t("frontPage.cards.meteorites.imageAltText"),
        },
        materialSample: {
          ...state.cards.materialSample,
          url: state.hasMaterialSamples ? state.cards.materialSample.url : "/search",
          title: i18n.t("frontPage.cards.materialSamples.title"),
          text: i18n.t("frontPage.cards.materialSamples.text"),
          button: i18n.t("frontPage.cards.materialSamples.button"),
          imageAltText: i18n.t("frontPage.cards.materialSamples.imageAltText"),
        },
      };
    },
  },
  actions: {
    SET_STATS(payload: StatsPayload) {
      if (payload?.records) this.records = payload.records;
      const types = payload?.facet_fields?.recordbasis || [];
      this.hasMaterialSamples = types.some((value, index) => {
        const count = types[index + 1];
        return (
          index % 2 === 0 &&
          value === "MaterialSample" &&
          typeof count === "number" &&
          count > 0
        );
      });
      const sources = payload?.facet_fields?.datasourceurl;
      if (sources) {
        this.datasets = [];
        for (let index = 0; index < sources.length; index += 2) {
          const url = sources[index];
          const count = sources[index + 1];
          if (typeof url === "string" && typeof count === "number" && count > 0) {
            this.datasets.push({ url, count });
          }
        }
        this.datasourceurl = this.datasets.length;
      }
      if (payload?.facet_fields) {
        Object.entries(payload.facet_fields).forEach((item) => {
          if (["recordbasis", "datasourceurl"].includes(item[0])) return;
          (this as unknown as Record<string, unknown>)[item[0]] =
            item[1].filter((val) => typeof val !== "string").length;
        });
      }
    },

    UPDATE_CARD_IS_LEAVING(payload: { id: CardId; isLeaving: boolean }) {
      this.cards[payload.id].isLeaving = payload.isLeaving;
    },

    INIT_MAP_RESULTS(id: string) {
      this.mapResults = { ...this.mapResults, [id]: { numFound: 0, docs: [] } };
    },

    UPDATE_MAP_RESPONSE_RESULTS(payload: { id: string; docs: SolrRecord[] }) {
      this.mapResults[payload.id]!.docs = payload.docs;
    },

    UPDATE_MAP_RESPONSE_RESULTS_COUNT(payload: { id: string; numFound: number }) {
      this.mapResults[payload.id]!.numFound = payload.numFound;
    },
    async getStats() {
      try {
        const response = await SearchService.getStats();

        if (response)
          this.SET_STATS({
            records: response?.response?.numFound,
            facet_fields: response?.facet_counts?.facet_fields,
          });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch statistics</b><br /><b>Name:</b> ${error.name}<br /><b>Message:</b> ${error.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }
    },

    updateCardIsLeaving(payload: { id: CardId; isLeaving: boolean }) {
      this.UPDATE_CARD_IS_LEAVING(payload);
    },

    async getLocalitySpecimens(localityData: {
      id: string;
      lat: number;
      lng: number;
    }) {
      try {
        if (!this.mapResults?.[localityData.id])
          this.INIT_MAP_RESULTS(localityData.id);
        const response =
          await SearchService.getAllSpecimensInProximity(localityData);

        if (response) {
          this.UPDATE_MAP_RESPONSE_RESULTS({
            docs: response?.response?.docs || [],
            id: localityData.id,
          });
          this.UPDATE_MAP_RESPONSE_RESULTS_COUNT({
            numFound: response?.response?.numFound || 0,
            id: localityData.id,
          });
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch specimens in proximity</b><br /><b>Name:</b> ${error.name}<br /><b>Message:</b> ${error.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }
    },
  },
});
