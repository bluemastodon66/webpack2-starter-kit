require('es6-promise').polyfill();
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const moment = require('moment')
const dc = moment().format('YMMDD-hmmss')
const env = require('./env-utils')
const cssUtils = require('./css-utils')
const webpack = require('webpack')
var useCssSourceMap = env.dev ? true : false


const lodash = require('lodash')
function MixManifest(stats) {
	let flattenedPaths = [].concat.apply([],lodash.values(stats.assetsByChunkName));
	let manifest = flattenedPaths.reduce((manifest, filename) => {
		let original = filename.replace(/\.(\w{20})(\..+)/, '$2');
		manifest['/'+original] = '/'+filename
		return manifest
		
	}, {});
	return JSON.stringify(manifest, null, 2);
}
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
  
var rules = [{
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [{
            loader: 'babel-loader',
        }]
    }, {
        test: /.(gif|jpe?g|png)\??.*$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
            use: [{ loader: 'resolve-url-loader' }]
        })
    }, {
        test: /\.(woff|woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: 'fonts/[name].[hash:7].[ext]'
            }
        }]

    }

]
var cssRules = cssUtils.styleRules({
    sourceMap: useCssSourceMap,
    postcss: true,
    extract: true
})
var rulesArray = cssRules.concat(rules)


module.exports = {
    devServer: {
        contentBase: 'www',
        hot: true,
        port: 3000
    },
    entry: {
        'main': './src/main.js',
        'common': './src/common.js',
		'vendor': ['moment', 'lodash', 'axios']		
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['.js'],
        alias: {
            'src': path.resolve(__dirname, '../src')
        }
    },
    /*
     externals: {
        "lodash": "lodash"
    },
    */
    plugins: [
        new ExtractTextPlugin({ filename: 'css/[name].css?v=' + dc, disable: false, allChunks: true }),
        new webpack.LoaderOptionsPlugin({
            minimize: env.prod,
            options: {
                context: path.resolve(__dirname, '../src'),
                postcss: cssUtils.postcss
            }
        }),
		 new StatsWriterPlugin({
			filename: "mix-manifest.json" // Default 
			,transform: MixManifest
		})
    ],
    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/dist/',
        filename: '[name]-bundle.js'
    },
    module: {
        rules: rulesArray
    }
}
