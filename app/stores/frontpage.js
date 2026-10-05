import { defineStore } from "pinia";
import SearchService from "@/services/SearchService";
import { useSettingsStore } from "./settings";
import i18n from "@/i18n";

export const useFrontpageStore = defineStore("frontpage", {
  state: () => ({
    records: "",
    datasetowner: "",
    country: "",
    datasourceurl: "",
    datasets: /** @type {{ url: string, count: number }[]} */ ([]),
    hasMaterialSamples: false,
    cardIds: ["mineral", "rock", "meteorite", "materialSample", "fossil"],
    cards: {
      materialSample: {
        url: '/search?recordbasis="MaterialSample"',
        image:
          "https://files.geocollections.info/7f91c242-6f29-4fa7-93a1-705e87219efd.jpg",
        isLeaving: false,
      },
      fossil: {
        url: '/search?recordbasis="Fossil" "FossilSpecimen"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/fossil1.jpg",
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
          "https://files.geocollections.info/img/geocase/front_page/rock1.jpg",
        isLeaving: false,
      },
      meteorite: {
        url: '/search?recordbasis="Meteorite" "MeteoriteSpecimen"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/meteorite1.jpg",
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
          count: state.records.toLocaleString(),
          id: 1,
        },
        {
          text: i18n.t("frontPage.institutionCount"),
          count: state.datasetowner.toLocaleString(),
          id: 2,
        },
        {
          text: i18n.t("frontPage.countryCount"),
          count: state.country.toLocaleString(),
          id: 3,
        },
        {
          text: i18n.t("frontPage.datasetCount"),
          count: state.datasourceurl.toLocaleString(),
          id: 4,
        },
      ];
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
    SET_STATS(payload) {
      if (payload?.records) this.records = payload.records;
      const types = payload?.facet_fields?.recordbasis || [];
      this.hasMaterialSamples = types.some(
        (value, index) => index % 2 === 0 && value === "MaterialSample" && types[index + 1] > 0,
      );
      const sources = payload?.facet_fields?.datasourceurl;
      if (sources) {
        this.datasets = [];
        for (let index = 0; index < sources.length; index += 2) {
          if (sources[index] && sources[index + 1] > 0) {
            this.datasets.push({ url: sources[index], count: sources[index + 1] });
          }
        }
        this.datasourceurl = this.datasets.length;
      }
      if (payload?.facet_fields) {
        Object.entries(payload.facet_fields).forEach((item) => {
          if (["recordbasis", "datasourceurl"].includes(item[0])) return;
          this[item[0]] = item[1].filter(
            (val) => typeof val !== "string",
          ).length;
        });
      }
    },

    UPDATE_CARD_IS_LEAVING(payload) {
      this.cards[payload.id].isLeaving = payload.isLeaving;
    },

    INIT_MAP_RESULTS(id) {
      this.mapResults = { ...this.mapResults, [id]: { numFound: 0, docs: [] } };
    },

    UPDATE_MAP_RESPONSE_RESULTS(payload) {
      this.mapResults[payload.id].docs = payload.docs;
    },

    UPDATE_MAP_RESPONSE_RESULTS_COUNT(payload) {
      this.mapResults[payload.id].numFound = payload.numFound;
    },
    async getStats() {
      try {
        let response = await SearchService.getStats();

        if (response)
          this.SET_STATS({
            records: response?.response?.numFound,
            facet_fields: response?.facet_counts?.facet_fields,
          });
      } catch (err) {
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch statistics</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }
    },

    updateCardIsLeaving(payload) {
      this.UPDATE_CARD_IS_LEAVING(payload);
    },

    async getLocalitySpecimens(localityData) {
      try {
        if (!this.mapResults?.[localityData.id])
          this.INIT_MAP_RESULTS(localityData.id);
        let response =
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
        useSettingsStore().updateErrorMessage(
          `<b>Failed to fetch specimens in proximity</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        );
        if (!useSettingsStore().error)
          useSettingsStore().updateErrorState(true);
      }
    },
  },
});
