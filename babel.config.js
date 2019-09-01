module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      [
        "@babel/env",
        {
          targets: {
            chrome: 76
          }
        }
      ],
      "@babel/preset-typescript",
      "@babel/react"
    ],
    plugins: []
  };
};
