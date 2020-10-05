const getters = {
  itemExists: state => {
    return (
      state.response && state.response.length > 0 && state.response?.[0]?.id
    );
  },

  item: (state, getters) => {
    return getters.itemExists ? state.response[0] : [];
  },

  imageExists: (state, getters) => {
    return getters.itemExists && getters.item && getters.item.images;
  },

  localityExists: (state, getters) => {
    return (
      getters.itemExists &&
      getters.item &&
      getters.item.has_map &&
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

  filteredItemHeadersSecondary: (state, getters) => {
    return state.itemHeadersSecondary.filter(header => {
      if (getters.item[header.value]) {
        return header;
      } else if (
        header.value.includes("contentContactName") &&
        getters?.contentContactName
      )
        return header;
      else if (
        header.value.includes("contentContactEmail") &&
        getters?.contentContactEmail
      )
        return header;
      else if (
        header.value.includes("contentContactPhone") &&
        getters?.contentContactPhone
      )
        return header;
      else if (
        header.value.includes("contentContactAddress") &&
        getters?.contentContactAddress
      )
        return header;
    });
  },

  /* Currently unused types aka unspecified:
   * OtherSpecimen
   * Unspecified
   * specimen
   */
  isItemFossil: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return (
        type === "FossileSpecimen" ||
        type === "FossilSpecimen" ||
        type === "RecentPreservedSpecimen" ||
        type === "fossil"
      );
    } else return false;
  },

  isItemMineral: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return type === "MineralSpecimen";
    } else return false;
  },

  isItemRock: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return (
        type === "RockSpecimen" ||
        type === "SedimentSample" ||
        type === "TechnologicalSample"
      );
    } else return false;
  },

  isItemMeteorite: (state, getters) => {
    if (getters.item) {
      let type = getters.item.recordbasis;
      return type === "MeteoriteSpecimen";
    } else return false;
  },

  itemStratigraphy: state => {
    console.log(state);
    return "test";
  },

  contentContact: state => {
    // console.log(state?.responseFromSource?.["abcd:DataSets"]?.["abcd:DataSet"]?.[0]?.["abcd:ContentContacts"]?.[0]?.["abcd:ContentContact"]?.[0])
    return state?.responseFromSource?.["abcd:DataSets"]?.[
      "abcd:DataSet"
    ]?.[0]?.["abcd:ContentContacts"]?.[0]?.["abcd:ContentContact"]?.[0];
  },

  contentContactName: (state, getters) => {
    return getters?.contentContact?.["abcd:Name"]?.[0];
  },

  contentContactEmail: (state, getters) => {
    return getters?.contentContact?.["abcd:Email"]?.[0];
  },

  contentContactPhone: (state, getters) => {
    return getters?.contentContact?.["abcd:Phone"]?.[0];
  },

  contentContactAddress: (state, getters) => {
    return getters?.contentContact?.["abcd:Address"]?.[0];
  }
};

export default getters;
