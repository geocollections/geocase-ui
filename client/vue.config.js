const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "../server/public"),
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000"
      }
    }
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.scss$/,
  //       use: ["vue-style-loader", "css-loader", "sass-loader"]
  //     }
  //   ]
  // }
};
