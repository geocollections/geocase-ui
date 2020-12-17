const imageUrlMixin = {
  methods: {
    getImageUrl(url) {
      if (url) {
        const IMAGE_URL = "https://geocase.geocollections.info/thumbnail/?url=";
        return IMAGE_URL + encodeURIComponent(url);
      } else return "";
    }
  }
};

export default imageUrlMixin;
