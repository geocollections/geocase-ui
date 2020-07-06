const getters = {
  itemExists: state => {
    return state.response !== null && state.response.numFound > 0;
  },

  item: (state, getters) => {
    return getters.itemExists ? state.response.docs[0] : [];
  },

  imageExists: (state, getters) => {
    return getters.itemExists && getters.item && getters.item.url;
  },

  localityExists: (state, getters) => {
    return (
      getters.itemExists &&
      getters.item &&
      getters.item.locality &&
      getters.item.latitude &&
      getters.item.longitude
    );
  },

  filteredItemHeaders: (state, getters) => {
    return state.itemHeaders.filter(header => {
      if (getters.item[header.value]) {
        return header;
      }
    });
  },

  /* Todo: Currently unused types:
   * OtherSpecimen
   * Unspecified
   * SedimentSample
   * TechnologicalSample
   * specimen
   * RecentPreservedSpecimen
   */
  isItemFossil: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      // Todo: Maybe add more?
      return (
        type === "FossileSpecimen" ||
        type === "FossilSpecimen" ||
        type === "fossil"
      );
    } else return false;
  },

  isItemMineral: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      // Todo: Maybe add more?
      return type === "MineralSpecimen";
    } else return false;
  },

  isItemRock: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      // Todo: Maybe add more?
      return type === "RockSpecimen" || type === "SedimentSample";
    } else return false;
  },

  isItemMeteorite: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      // Todo: Maybe add more?
      return type === "MeteoriteSpecimen";
    } else return false;
  }
};

export default getters;
