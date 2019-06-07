const configureAPI = require('./srv/configure')
const minimist = require('minimist')
const path = require('path')
const config = require('./srv/config.json')

const args = minimist(process.argv)
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
  return path.resolve(__dirname, 'cms.frontend')
}
const rootPath = defineRootPath(args.embedded)
const componentsPath = definePath(args.componentsPath, rootPath, config.components)
const pagesPath = definePath(args.pagesPath, rootPath, config.pages)

module.exports = {
  devServer: {
    before: configureAPI
  },
  chainWebpack: config => {
    config
      .plugin('define')
      .tap(options => {
        options[0]['process.env'].COMPONENTS_BASEPATH = `"${componentsPath}"`
        options[0]['process.env'].PAGES_BASEPATH = `"${pagesPath}"`
        return options
      })

    config.resolve.alias
      .set('@components', componentsPath)

    config.resolve.alias
      .set('@pages', pagesPath)

    console.log(config.resolve.alias)
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')()
        ]
      }
    }
  }
}
