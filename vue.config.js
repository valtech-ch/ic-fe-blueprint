const configureAPI = require('./srv/configure')
const minimist = require('minimist')
const path = require('path')

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
      .set('@components', args.componentsPath || path.resolve(__dirname, 'ic-components/components'))

    config.resolve.alias
      .set('@pages', args.pagesPath || path.resolve(__dirname, 'ic-components/pages'))

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
