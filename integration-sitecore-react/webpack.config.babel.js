// import HtmlWebpackPlugin from 'html-webpack-plugin';
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const globImporter = require('node-sass-glob-importer');

module.exports = {
	// Your main js file
	entry: {
		app: './src/js/app.js', 
	},
	// Production set up
	output: {
		path: path.resolve(__dirname, "dist/"),
		filename: "js/[name].js",
		publicPath: '/'
	},
		
	module: {
		rules: [
			{
				// Finds all .js files in project
				test: /\.js?$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
            loader: "css-loader",
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                importer: globImporter()
              }
            }
          },
				]
			},
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
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: 'index.html',
			inject: true,
			minify: false
		  })
	],

	node: false,
	devtool: 'source-map',

	devServer: {
		// Set a port number to your liking
		port: process.env.PORT || 8666,
		contentBase: './src',
		historyApiFallback: false
	}
};
