'use strict'

const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',

  entry: [
    './preview/app.js'
  ],

  devServer: {
    hot: true,
    watchOptions: {
      poll: true
    },
    writeToDisk: true
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'src/components/**/*.hbs',
        to: 'views',
        flatten: true
      },
      {
        from: 'preview/assets',
        to: 'assets'
      }
    ])
  ]
}