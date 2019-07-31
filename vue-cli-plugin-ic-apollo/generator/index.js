module.exports = api => {
  api.render('./template')

  api.extendPackage({
    dependencies: {
      'apollo-cache-inmemory': '^1.6.0',
      'vue-apollo': '^3.0.0-beta.11',
      'graphql-type-json': '^0.2.1',
      'lowdb': '^1.0.0',
      'mkdirp': '^0.5.1',
      'shortid': '^2.2.8',
      'graphql': '^0.12.0'
    },
    devDependencies: {
      'eslint-plugin-graphql': '^2.1.1',
      'graphql-tag': '^2.9.0'
    },
    vue: {
      pluginOptions: {
        apollo: {
          enableMocks: true,
          enableEngine: false
        }
      }
    }
  })

  api.injectImports(api.entryFile, `import { createProvider } from './vue-apollo'`)

  api.onCreateComplete(() => {
    const { EOL } = require('os')
    const fs = require('fs')

    // Modify entry file (most probably main.js)
    const contentMain = fs.readFileSync(api.entryFile, { encoding: 'utf-8' })
    const lines = contentMain.split(/\r?\n/g)

    if (lines.findIndex(line => line.match(/const graphQLSettings/)) === -1) {
      const renderIndex = lines.findIndex(line => line.match(/new Vue/))
      lines[renderIndex] = `const graphQLSettings = document.querySelector('body').dataset
const graphQLOptions = {
  wsEndpoint: process.env.IC_VUE_APP_GRAPHQL_WS || graphQLSettings.graphqlWs || 'ws://localhost:4000/graphql',
  httpEndpoint: process.env.IC_VUE_APP_GRAPHQL_HTTP || graphQLSettings.graphqlHttp || 'http://localhost:4000/graphql'
}${EOL}
${lines[renderIndex]}
  apolloProvider: createProvider(graphQLOptions),`

      fs.writeFileSync(api.entryFile, lines.join(EOL), { encoding: 'utf-8' })
    }

    // Modify webpack
    const webpackFile = `${__dirname}/../../vue.config.js`
    const contentWebpack = fs.readFileSync(webpackFile, { encoding: 'utf-8' })
    const linesWebpack = contentWebpack.split(/\r?\n/g)

    if (linesWebpack.findIndex(line => line.match(/graphql-tag\/loader/)) === -1) {
      const renderIndex = linesWebpack.findIndex(line => line.match(/chainWebpack/))
      linesWebpack[renderIndex] = `${linesWebpack[renderIndex]}
    config.module
      .rule('gql')
      .test(/\\.gql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
      `

      const returnOptionsIndex = linesWebpack.findIndex(line => line.match(/return options/))
      linesWebpack[returnOptionsIndex] = `        options[0]['process.env'].IC_VUE_APP_GRAPHQL_WS = \`"\${process.env.IC_VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql'}"\`
        options[0]['process.env'].IC_VUE_APP_GRAPHQL_HTTP = \`"\${process.env.IC_VUE_APP_GRAPHQL_HTTP || 'http://localhost:4000/graphql'}"\`
      return options
      `
      fs.writeFileSync(webpackFile, linesWebpack.join(EOL), { encoding: 'utf-8' })
    }
  })
}
