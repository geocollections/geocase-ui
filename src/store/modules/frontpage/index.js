import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  records: "1 128 949",
  datasetowner: "11",
  country: "161",
  showAlert: true,
  cardIds: ["fossil", "mineral", "rock", "meteorite"],
  cards: {
    fossil: {
      url:
        '/search?recordbasis=("FossileSpecimen" "FossilSpecimen" "RecentPreservedSpecimen" "fossil")',
      image:
        "https://files.geocollections.info/img/geocase/front_page/fossil1.jpg",
      isLeaving: false
    },
    mineral: {
      url: '/search?recordbasis="MineralSpecimen"',
      image:
        "https://files.geocollections.info/img/geocase/front_page/mineral1.jpg",
      isLeaving: false
    },
    rock: {
      url:
        '/search?recordbasis=("RockSpecimen" "SedimentSample" "TechnologicalSample")',
      image:
        "https://files.geocollections.info/img/geocase/front_page/rock1.jpg",
      isLeaving: false
    },
    meteorite: {
      url: '/search?recordbasis="MeteoriteSpecimen"',
      image:
        "https://geocase.eu/thumbnail/?url=https://files.geocollections.info/img/geocase/front_page/meteorite1.jpg",
      isLeaving: false
    }
  },
  mapResults: {}
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
