// import HtmlWebpackPlugin from 'html-webpack-plugin';
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
				test: /\.scss?$/,
				loader: 'style-loader!css-loader!sass-loader'
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
