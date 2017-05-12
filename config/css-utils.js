var
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  autoprefixer = require('autoprefixer')

module.exports.postcss = [autoprefixer()]

module.exports.styleLoaders = function (options) {
  options = options || {}

  function generateLoaders (loaders) {
    if (options.postcss) {
      loaders.splice(1, 0, 'postcss')
    }

    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
      
      }
      else {
        loader = loader + '-loader'
       
      }
      return {'loader':loader}
    })

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: sourceLoader,
        fallback: 'style-loader'
      })
    }
    else {
      return [{'loader':'style-loader'}].concat(sourceLoader)

    }
  }

  return {
    css: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    styl: generateLoaders(['css', 'stylus']),
    stylus: generateLoaders(['css', 'stylus'])
  }
}

module.exports.styleRules = function (options) {
  var output = []
  var loaders = exports.styleLoaders(options)

  for (var extension in loaders) {

    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

