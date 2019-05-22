const configureAPI = require('./srv/configure')
const minimist = require('minimist')

const args = minimist(process.argv)
console.log('VCONF Received arguments:', args)

module.exports = {
  devServer: {
    before: configureAPI
  },
  chainWebpack: config => {
    config
      .plugin('define')
      .tap(options => {
        options[0]['process.env'].COMPONENTS_BASEPATH = `"${args.componentsPath}"`
        options[0]['process.env'].PAGES_BASEPATH = `"${args.pagesPath}"`
        return options
      })

    config.resolve.alias
      .set('@components', args.componentsPath || '/src/components')

    config.resolve.alias
      .set('@pages', args.pagesPath || '/src/pages')
  }
}
