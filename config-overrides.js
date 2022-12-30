const {override, addBabelPresets, addBabelPlugins} = require('customize-cra');

module.exports = {
  webpack: override(
    /* babel constructor decorator support
     * @see babel-plugin-transform-typescript-metadata README
     */
    ...addBabelPlugins(
      "babel-plugin-transform-typescript-metadata",
      ["@babel/plugin-proposal-decorators", {"legacy": true}],
      ["@babel/plugin-proposal-class-properties", {"loose": true}],
    ),
    ...addBabelPresets(
      "@babel/preset-typescript"
    ),
  ),
  /*
     * jest! config
     * @see https://archive.jestjs.io/docs/en/configuration
     * we can also use .babelrc + jest props in package.json
     */
  jest: override(function (config) {
    return config;
  }),
};
