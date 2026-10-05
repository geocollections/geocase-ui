interface ImageRecord {
  recordbasis?: unknown;
  fullscientificname?: unknown;
  locality?: unknown;
  datasetowner?: unknown;
  [key: string]: unknown;
}

interface ImageMixinThis {
  $t(key: string): string;
}

const imageMixin = {
  methods: {
    getImageUrl(
      this: ImageMixinThis,
      url: string | null | undefined,
    ): string {
      if (url) {
        const IMAGE_URL = "https://geocase.eu/thumbnails/";
        return IMAGE_URL + encodeURIComponent(url);
      } else return "";
    },

    getImageAltText(
      this: ImageMixinThis,
      imageObject: ImageRecord | null | undefined,
    ): string {
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
