import { defineStore } from "pinia";
import SearchService from "@/services/SearchService";
import { useSettingsStore } from "./settings";
import i18n from "@/i18n";

export const useFrontpageStore = defineStore("frontpage", {
  state: () => ({
    records: "",
    datasetowner: "",
    country: "",
    cardIds: ["fossil", "mineral", "rock", "meteorite"],
    cards: {
      fossil: {
        url: '/search?recordbasis="Fossil"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/fossil1.jpg",
        isLeaving: false,
      },
      mineral: {
        url: '/search?recordbasis="Mineral"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/mineral1.jpg",
        isLeaving: false,
      },
      rock: {
        url: '/search?recordbasis="Rock"',
        image:
          "https://files.geocollections.info/img/geocase/front_page/rock1.jpg",
        isLeaving: false,
      },
      meteorite: {
        url: '/search?recordbasis="Meteorite"',
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
      };
    },
  },
  actions: {
    SET_STATS(payload) {
      if (payload?.records) this.records = payload.records;
      if (payload?.facet_fields) {
        Object.entries(payload.facet_fields).forEach((item) => {
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
