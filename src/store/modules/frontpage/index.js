import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  records: "",
  datasetowner: "",
  country: "",
  showAlert: true,
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
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
