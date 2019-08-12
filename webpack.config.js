/* eslint-disable @typescript-eslint/no-var-requires */
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve("./playground/src/main.jsx")
    // inline: path.resolve("./playground/src/inline.mjs")
  },
  output: {
    path: path.resolve("./playground/dist")
  },
  module: {
    rules: [{ test: /\.[jmt]sx?$/, loader: "babel-loader" }]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new WriteFilePlugin(),
    new CopyPlugin([
      {
        from: "@ampproject/worker-dom/**/*.mjs",
        to: "./",
        context: "./node_modules/"
      }
    ])
  ],
  devServer: {
    contentBase: path.resolve("./playground")
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".mjs", ".json"]
  }
};
