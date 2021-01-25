const routes = require("./src/router/sitemapRoutes");
const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api": {
        target: "http://api.geocase.eu/",
        changeOrigin: true,
        pathRewrite: {
          "^/api/repeat": "/v1/repeat",
          "^/api": "/v1/solr"
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
  },
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, "dist"),
        // Required - Routes to render.
        routes: ["/", "/about", "/howto"]
      })
    ]
  }
};
