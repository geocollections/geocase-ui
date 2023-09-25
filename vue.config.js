const routes = require("./src/router/sitemapRoutes");
const config = require("./src/config");

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api": {
        target: config.app.apiUrl,
        changeOrigin: true,
        pathRewrite: {
          "^/api/repeat": "/v1/repeat",
          "^/api": "/v1/solr",
        },
      },
    },
  },
  pluginOptions: {
    sitemap: {
      productionOnly: true,
      outputDir: "./public",
      pretty: true,
      baseURL: "https://geocase.eu",
      defaults: {
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "daily",
        priority: 0.5,
      },
      routes,
    },
  },
};
