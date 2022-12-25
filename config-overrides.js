const {override, addBabelPlugins, addDecoratorsLegacy} = require('customize-cra');

module.exports = {
  webpack: override(
    /* babel constructor decorator support
     * @see babel-plugin-parameter-decorator README
     */
    addDecoratorsLegacy(),
    ...addBabelPlugins(
      "babel-plugin-parameter-decorator",
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
