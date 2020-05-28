const getters = {
  itemExists: state => {
    return state.response !== null && state.response.numFound > 0;
  },

  item: (state, getters) => {
    return getters.itemExists ? state.response.docs[0] : [];
  },

  imageExists: (state, getters) => {
    return getters.itemExists && getters.item.url;
  },

  localityExists: (state, getters) => {
    return (
      getters.itemExists &&
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
  }
};

export default getters;
