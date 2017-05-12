
var mode = ('' + process.env.NODE_ENV).trim()

module.exports = {
  dev:  mode === 'development',
  prod: mode === 'production',
  theme: 'mat'
}