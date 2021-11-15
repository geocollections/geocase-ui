const imageMixin = {
  methods: {
    getImageUrl(url) {
      if (url) {
        const IMAGE_URL = "https://geocase.eu/thumbnail/?url=";
        return IMAGE_URL + encodeURIComponent(url);
      } else return "";
    },

    getImageAltText(imageObject) {
      let altText = "";
      const fields = [
        "recordbasis",
        "fullscientificname",
        "locality",
        "datasetowner",
      ];
      if (imageObject) {
        fields.forEach((item, index) => {
          if (imageObject[item])
            altText += ` ${this.$t(`search.table.${item}`)}: ${
              imageObject[item]
            }${index < fields.length - 1 ? "," : ""}`;
        });
      }
      return altText;
    },
  },
};

export default imageMixin;
