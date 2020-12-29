const routes = require("./src/router/sitemapRoutes");

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api": {
        target: "http://geocase-api.geocollections.info/",
        changeOrigin: true,
        pathRewrite: {
          "^/api/repeat": "/v1/repeat",
          "^/api": "/v2/solr"
        }
      }
    }
  },
  pluginOptions: {
    sitemap: {
      productionOnly: true,
      outputDir: "./public",
      pretty: true,
      baseURL: "https://new.geocase.eu",
      defaults: {
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "daily",
        priority: 0.5
      },
      routes
    }
  }
};
