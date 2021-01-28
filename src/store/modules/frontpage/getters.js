import i18n from "@/i18n";

const getters = {
  stats: state => {
    return [
      {
        text: i18n.t("frontPage.totalRecords"),
        count: state.records.toLocaleString(),
        id: 1
      },
      {
        text: i18n.t("frontPage.institutionCount"),
        count: state.datasetowner.toLocaleString(),
        id: 2
      },
      {
        text: i18n.t("frontPage.countryCount"),
        count: state.country.toLocaleString(),
        id: 3
      }
    ];
  },
  getCards: state => {
    return {
      fossil: {
        ...state.cards.fossil,
        title: i18n.t("frontPage.cards.fossils.title"),
        text: i18n.t("frontPage.cards.fossils.text"),
        button: i18n.t("frontPage.cards.fossils.button"),
        imageAltText: i18n.t("frontPage.cards.fossils.imageAltText")
      },
      mineral: {
        ...state.cards.mineral,
        title: i18n.t("frontPage.cards.minerals.title"),
        text: i18n.t("frontPage.cards.minerals.text"),
        button: i18n.t("frontPage.cards.minerals.button"),
        imageAltText: i18n.t("frontPage.cards.minerals.imageAltText")
      },
      rock: {
        ...state.cards.rock,
        title: i18n.t("frontPage.cards.rocks.title"),
        text: i18n.t("frontPage.cards.rocks.text"),
        button: i18n.t("frontPage.cards.rocks.button"),
        imageAltText: i18n.t("frontPage.cards.rocks.imageAltText")
      },
      meteorite: {
        ...state.cards.meteorite,
        title: i18n.t("frontPage.cards.meteorites.title"),
        text: i18n.t("frontPage.cards.meteorites.text"),
        button: i18n.t("frontPage.cards.meteorites.button"),
        imageAltText: i18n.t("frontPage.cards.meteorites.imageAltText")
      }
    };
  }
};

export default getters;