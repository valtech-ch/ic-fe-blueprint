const path = require('path')

const definePath = function (directPath, defaultPath, entity) {
  if (directPath) {
    return path.resolve(directPath)
  }
  return path.join(path.resolve(defaultPath), entity)
}

const defineRootPath = function (embedded) {
  if (embedded) {
    if (args.feRootPath) {
      return path.resolve(args.feRootPath)
    }
    return path.resolve('../../')
  }
  return path.resolve(__dirname, '../cms.frontend')
}

module.exports = {
  definePath,
  defineRootPath
}
