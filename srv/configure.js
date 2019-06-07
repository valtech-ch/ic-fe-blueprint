const path = require('path')
const minimist = require('minimist')
const bodyParser = require('body-parser')
const config = require('./config.json')
const express = require('express')
const builder = require('./builder')
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
  return path.resolve(__dirname, '../cms.frontend')
}
const rootPath = defineRootPath(args.embedded)
const componentsPath = definePath(args.componentsPath, rootPath, config.components)
const pagesPath = definePath(args.pagesPath, rootPath, config.pages)
const stylePath = definePath(args.stylePath, rootPath, config.styles)
const assetsPath = definePath(args.assetsPath, rootPath, config.assets)
const backendTemplates = args.backendTemplates || 'hbs'

let aemMocksPath
if (backendTemplates === 'htl') {
  aemMocksPath = definePath(args.aemMocksPath, rootPath, config.aemMocks)
}

const api = require('./api')(componentsPath, pagesPath, aemMocksPath, backendTemplates)

console.log('build index for Vue components', componentsPath)
console.log('build index for Vue pages', pagesPath)
console.log('build path for styles', stylePath)
console.log('build path for styles', assetsPath)
if (aemMocksPath) {
  console.log('Your AEM mocks are in:', aemMocksPath)
}

// build Vue components importer
builder.build(componentsPath, stylePath, path.resolve(__dirname, config.componentsImportFile))
builder.buildPages(pagesPath, stylePath, path.resolve(__dirname, config.pagesImportFile))

module.exports = app => {
  app.use('/assets', express.static(assetsPath))
  app.use(bodyParser.json())
  app.use('/api', api)
  app.set('view engine', '.hbs')
}
