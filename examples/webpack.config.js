'use strict';

var path = require('path');

module.exports = {
	devtool: 'eval',

	context: path.resolve(__dirname, 'src'),
	entry: './index.jsx',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: './bundle.js'
	},

	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				include: [
					__dirname,
					path.resolve(__dirname, '../src')
				],
				loader: 'babel'
			}
		]
	},
	resolve: {
		root: [
			path.resolve(__dirname, 'node_modules'),
			path.resolve(__dirname, '../node_modules')
		],
		extensions: ['', '.js', '.jsx']
	},
	resolveLoader: {
		root: path.resolve(__dirname, 'node_modules')
	}
};
