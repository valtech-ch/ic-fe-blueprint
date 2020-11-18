const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  watch: false,
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [

    ]
  }
})