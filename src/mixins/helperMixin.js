const helperMixin = {
  data: () => ({
    detailViewImages: []
  }),

  watch: {
    "item.images": {
      handler: async function(newVal) {
        await this.getDetailViewImages(newVal);
      }
    }
  },

  methods: {
    async getDetailViewImages(images) {
      if (this.imageExists) {
        const asyncRes = await Promise.all(
          images.map(async image => {
            let img = await getMeta(image);

            return {
              ...this.item,
              extractedImage: image,
              imageWidth: img.width ? img.width : null,
              imageHeight: img.height ? img.height : null
            };
          })
        );
        if (asyncRes) this.detailViewImages = asyncRes;
        else this.detailViewImages = [];
      } else this.detailViewImages = [];
    }
  },

  computed: {
    searchResultImages() {
      if (this.responseResultsCount > 0) {
        let responsesWithImages = this.responseResults.filter(
          image => !!image.images
        );

        let allImages = [];

        responsesWithImages.forEach(item =>
          item.images.forEach(image =>
            allImages.push({ ...item, extractedImage: image })
          )
        );

        return allImages;
      } else return [];
    }
  }
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
