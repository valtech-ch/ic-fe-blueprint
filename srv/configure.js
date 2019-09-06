const path = require('path')
const minimist = require('minimist')
const bodyParser = require('body-parser')
const config = require('./config.json')
const express = require('express')
const builder = require('./builder')
const chokidar = require('chokidar')
const args = minimist(process.argv)
const { defineRootPath, definePath } = require('./path')
const rootPath = defineRootPath(args.embedded)
const componentsPath = definePath(args.componentsPath, rootPath, config.components)
const pagesPath = definePath(args.pagesPath, rootPath, config.pages)
const stylePath = definePath(args.stylePath, rootPath, config.styles)
const scriptPath = definePath(args.scriptPath, rootPath, config.scripts)
const assetsPath = definePath(args.assetsPath, rootPath, config.assets)
const directivePath = definePath(args.diretivePath, rootPath, config.directives)
const backendTemplates = args.backendTemplates || 'hbs'

let aemMocksPath
if (backendTemplates === 'htl') {
  aemMocksPath = definePath(args.aemMocksPath, rootPath, config.aemMocks)
}

const potentialMockPaths = [componentsPath, aemMocksPath].filter(Boolean).map(dir => path.join(dir, '/**/*.js'))

// Watchers

const componentsWatcher = chokidar.watch(componentsPath)
const pagesWatcher = chokidar.watch(pagesPath)
const directivesWatcher = chokidar.watch(directivePath)
const assetsWatcher = chokidar.watch(assetsPath)
const stylesWatcher = chokidar.watch(stylePath)
const mocksWatcher = chokidar.watch(potentialMockPaths)

componentsWatcher.on('ready', function () {
  componentsWatcher.on('all', function () {
    console.log('rebuild components')
    builder.build(componentsPath, stylePath, scriptPath, path.resolve(__dirname, config.componentsImportFile))
  })
})

pagesWatcher.on('ready', function () {
  pagesWatcher.on('all', function () {
    console.log('rebuild pages')
    builder.buildPages(pagesPath, stylePath, scriptPath, path.resolve(__dirname, config.pagesImportFile))
  })
})

directivesWatcher.on('ready', function () {
  directivesWatcher.on('all', function () {
    console.log('rebuild directives')
    builder.buildDirectives(directivePath, path.resolve(__dirname, config.directivesImportFile))
  })
})

stylesWatcher.on('ready', function () {
  stylesWatcher.on('all', function () {
    console.log('get new styles')
    builder.build(componentsPath, stylePath, scriptPath, path.resolve(__dirname, config.componentsImportFile))
    builder.buildPages(pagesPath, stylePath, scriptPath, path.resolve(__dirname, config.pagesImportFile))
  })
})

assetsWatcher.on('ready', function () {
  assetsWatcher.on('all', function () {
    console.log('get new assets')
    builder.build(componentsPath, stylePath, scriptPath, path.resolve(__dirname, config.componentsImportFile))
    builder.buildPages(pagesPath, stylePath, scriptPath, path.resolve(__dirname, config.pagesImportFile))
  })
})

mocksWatcher.on('ready', function () {
  mocksWatcher.on('all', function () {
    // Make sure mock files are not cached
    Object.keys(require.cache).forEach((file, i) => {
      if ([componentsPath, aemMocksPath].find(dir => file.includes(dir))) {
        delete require.cache[file]
      }
    })
    console.log('get new mocks')
    builder.build(componentsPath, stylePath, scriptPath, path.resolve(__dirname, config.componentsImportFile))
    builder.buildPages(pagesPath, stylePath, scriptPath, path.resolve(__dirname, config.pagesImportFile))
  })
})

const api = require('./api')(componentsPath, pagesPath, aemMocksPath, backendTemplates)

// Initial builder

console.log('build index for Vue components', componentsPath)
console.log('build index for Vue pages', pagesPath)
console.log('build path for styles', stylePath)
console.log('build path for scripts', scriptPath)
console.log('build path for assets', assetsPath)
console.log('build path for directives', directivePath)
if (aemMocksPath) {
  console.log('Your AEM mocks are in:', aemMocksPath)
}

// build Vue components importer
builder.build(componentsPath, stylePath, scriptPath, path.resolve(__dirname, config.componentsImportFile))
builder.buildPages(pagesPath, stylePath, scriptPath, path.resolve(__dirname, config.pagesImportFile))
builder.buildDirectives(directivePath, path.resolve(__dirname, config.directivesImportFile))

module.exports = app => {
  app.use('/assets', express.static(assetsPath))
  app.use(bodyParser.json())
  app.use('/api', api)
  app.set('view engine', '.hbs')
}
