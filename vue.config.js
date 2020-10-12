module.exports = {
  devServer: {
    proxy: {
      "/api": {
        // target: "http://gc-api.geocollections.info"
        target: "http://localhost:5000"
      }
    }
  }
};
