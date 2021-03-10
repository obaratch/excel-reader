const nodepath = require("path");
const resolvePath = (path) => nodepath.resolve(__dirname, path);

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",

  watchOptions: {
    ignored: ["node_modules", "stories", "test", "dist"],
  },

  context: resolvePath("./src/"),
  entry: ["./js/main.js"],

  output: {
    publicPath: "/",
    path: resolvePath("./dist"),
    filename: "bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        loader: "css-loader",
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },

  resolve: {
    extensions: [".js", ".jsx"],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: "./style/style.css" }),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
};
