const configureAPI = require('./srv/configure')

module.exports = {
  devServer: {
    before: configureAPI
  }
}
