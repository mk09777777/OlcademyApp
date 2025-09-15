module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      "nativewind/babel",
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      "@babel/plugin-transform-flow-strip-types",
      ["@babel/plugin-transform-runtime", { "regenerator": false }],
      ["module-resolver", {
        "root": ["./"],
        "alias": {
          "@components": "./components",
          "@context": "./context",
          "@config": "./config",
          "@utils": "./utils",
          "@styles": "./styles"
        }
      }]
    ],
  };
};