import imageMixin from "@/mixins/imageMixin";

const helperMixin = {
  mixins: [imageMixin],

  data: () => ({
    detailViewImages: [],
  }),

  watch: {
    "item.images": {
      handler: async function (newVal) {
        await this.getDetailViewImages(newVal);
      },
    },
  },

  methods: {
    async getDetailViewImages(images) {
      if (this.imageExists) {
        const asyncRes = await Promise.all(
          images.map(async (image) => {
            let img = await getMeta(this.getImageUrl(image));

            return {
              ...this.item,
              thumbnailImage: this.getImageUrl(image),
              originalImage: image,
              imageWidth: img.width ? img.width : null,
              imageHeight: img.height ? img.height : null,
              altText: this.getImageAltText(this.item),
            };
          })
        );
        if (asyncRes) this.detailViewImages = asyncRes;
        else this.detailViewImages = [];
      } else this.detailViewImages = [];
    },
  },

  computed: {
    searchResultImages() {
      if (this.responseResultsCount > 0) {
        let responsesWithImages = this.responseResults.filter(
          (image) => !!image.images
        );
        let allImages = [];

        responsesWithImages.forEach((item) =>
          item.images.forEach((image) => {
            allImages.push({
              ...item,
              thumbnailImage: this.getImageUrl(image),
              originalImage: image,
              altText: this.getImageAltText(item),
            });
          })
        );

        return allImages;
      } else return [];
    },
  },
};

function getMeta(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export default helperMixin;
