const {override, addBabelPresets, addBabelPlugins} = require('customize-cra');
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

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
    // custom changes
    function (config) {
      const swPlugin = new WorkboxWebpackPlugin.InjectManifest({
        swDest: 'service-worker.js',
        swSrc: "./src/service-worker.ts",
        maximumFileSizeToCacheInBytes: 50000000 // 50MB (limit of file size, need for high weight npm library like currency-list)
      });

      // clear from ws plugins
      config.plugins = config.plugins
        .filter((plugin) => !["InjectManifest", "GenerateSW"].includes(plugin.constructor.name));

      // if it is prod mode then replace native react-app plugin
      if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_RUN_SW) {
        config.plugins.push(swPlugin);
      }

      return config;
    }
  ),
  /*
     * jest! config
     * @see https://archive.jestjs.io/docs/en/configuration
     * we can also use .babelrc + jest props in package.json
     */
  jest: override(
    function (config) {
      // TODO: remove it after dist won't contain es6
      config.transformIgnorePatterns = ["/node_modules/(?!(@vitologi)/).*/"]
      config.coverageThreshold = {
        global: {
          statements: 1,
          branches: 1,
          functions: 1,
          lines: 1,
        },
      };
      config.coveragePathIgnorePatterns = [
        "<rootDir>/src/modules/offline",  // TODO: find out how to test service worker interceptors
      ];
      return config;
    }),
};
