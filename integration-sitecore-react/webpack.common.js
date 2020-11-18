const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
require("@babel/polyfill");

module.exports = {
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, loader: "babel-loader" },
      {
        test: /\.(njk)$/i,
        use: [
          {
            loader: 'ignore-loader'
          }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader',
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "dist/index.html"),
      filename: 'index.html',
      inject: true,
      minify: false
    }),
  ],
}