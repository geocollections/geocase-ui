const routes = require("./src/router/routes.js");

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://gc-api.geocollections.info/"
      }
    }
  },
  pluginOptions: {
    sitemap: {
      productionOnly: true,
      outputDir: "./public",
      pretty: true,
      baseURL: "http://geocase.geocollections.info",
      defaults: {
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "daily",
        priority: 0.5
      },
      routes
    }
  }
};
