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
    config.module
      .rule('gql')
      .test(/\.gql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()

    config
      .plugin('define')
      .tap(options => {
        options[0]['process.env'].COMPONENTS_BASEPATH = `"${componentsPath}"`
        options[0]['process.env'].PAGES_BASEPATH = `"${pagesPath}"`
        options[0]['process.env'].IC_VUE_APP_GRAPHQL_WS = `"${process.env.IC_VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql'}"`
        options[0]['process.env'].IC_VUE_APP_GRAPHQL_HTTP = `"${process.env.IC_VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'}"`
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
  },

  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: false
    }
  }
}
