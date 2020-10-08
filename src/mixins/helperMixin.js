const helperMixin = {
  computed: {
    detailViewImages() {
      if (this.imageExists) {
        return this.item.images.map(image => {
          return {
            ...this.item,
            extractedImage: image
          };
        });
      } else return [];
    },

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

export default helperMixin;
