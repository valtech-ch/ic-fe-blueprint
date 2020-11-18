const path = require("path");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  watch: true,
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: '[name].[contenthash].js',
    publicPath: '/'
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 5009,
      server: { baseDir: ['build'] }
    }),
  ]
}) 