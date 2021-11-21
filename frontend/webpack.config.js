const webpack = require("webpack");
require("dotenv").config({ path: "../.env" });

const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.ENV,
  entry: {
    app: ["./src/Index.tsx"],
    vendor: ["react", "react-dom"],
  },
  watch: process.env.ENV == "development",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/[name].bundle.js",
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      }, {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
