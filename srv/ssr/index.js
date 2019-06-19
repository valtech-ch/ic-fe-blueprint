module.exports = function (language) {
  const renderer = require('./' + language)
  return {
    getProcessedTpl (path) {

    },

    getEngine () {
      return renderer.engine()
    }
  }
}
