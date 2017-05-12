const base = require('./webpack.base')
const webpack = require('webpack')
const path = require('path');
let moment = require('moment')
let dc = moment().format('YMMDD-hmmss')
const env = require('./env-utils')
const config = Object.assign({}, base, {
    output: Object.assign({}, base.output, {
        chunkFilename: "modules/m-[name].min.js?v=" + dc
    }),
    plugins: (base.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'client-vendor-bundle.js'
        })
    ])
})




console.log('=========== checking mode =================')

if (env.prod) {
    console.log('=========== production mode =================')
   
        // config.devtool = ''
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    )

    config.output.path = path.resolve(__dirname, '../dist')

} else {
    console.log('=========== dev  mode =================')

    config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    )
}

module.exports = config
