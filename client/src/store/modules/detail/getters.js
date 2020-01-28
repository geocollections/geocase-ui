const getters = {
  itemExists: state => {
    return state.response !== null && state.response.numFound > 0;
  },

  item: (state, getters) => {
    return getters.itemExists ? state.response.docs[0] : [];
  },

  imageExists: (state, getters) => {
    return (
      getters.itemExists &&
      typeof getters.item.url !== "undefined" &&
      getters.item.url !== null
    );
  },

  localityExists: (state, getters) => {
    return (
      getters.itemExists &&
      typeof getters.item.locality !== "undefined" &&
      getters.item.locality !== null &&
      getters.item.latitude !== null &&
      getters.item.longitude !== null
    );
  },

  filteredItemHeaders: (state, getters) => {
    return state.itemHeaders.filter(header => {
      if (getters.item[header.value]) {
        return header;
      }
    });
  }
};

export default getters;
