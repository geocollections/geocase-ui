const plugins = ["@babel/plugin-proposal-optional-chaining"];

if (process.env.NODE_ENV === "production")
  plugins.push("transform-remove-console");

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: plugins,
};
