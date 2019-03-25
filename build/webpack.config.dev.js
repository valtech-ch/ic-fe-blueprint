'use strict'

const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',

  entry: [
    './src/main.js'
  ],

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/',
    filename: 'main.js'
  },

  devServer: {
    hot: true,
    watchOptions: {
      poll: true
    },
    writeToDisk: true,
    historyApiFallback: {
      index: 'dist/index.html'
    }
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
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          runtimeCompat: true
        }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'ic-components/components/**/*.hbs',
        to: 'views',
        flatten: true
      },
      {
        from: 'public',
        to: ''
      },
      {
        from: 'src/assets',
        to: 'assets'
      }
    ])
  ]
}