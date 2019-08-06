const configureAPI = require('./srv/configure')
const minimist = require('minimist')
const config = require('./srv/config.json')
const { defineRootPath, definePath } = require('./srv/path')

const args = minimist(process.argv)
const rootPath = defineRootPath(args.embedded)
const componentsPath = definePath(args.componentsPath, rootPath, config.components)
const pagesPath = definePath(args.pagesPath, rootPath, config.pages)
const assetsPath = definePath(args.assetsPath, rootPath, config.assets)

module.exports = {
  devServer: {
    before: configureAPI,
    disableHostCheck: true
  },

  chainWebpack: config => {
    config
      .plugin('define')
      .tap(options => {
        options[0]['process.env'].COMPONENTS_BASEPATH = `"${componentsPath}"`
        options[0]['process.env'].PAGES_BASEPATH = `"${pagesPath}"`
        return options
      }
      )

    config.resolve.alias
      .set('@components', componentsPath)

    config.resolve.alias
      .set('@pages', pagesPath)

    config.resolve.alias
      .set('@assets', assetsPath)
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
