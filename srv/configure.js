const path = require('path')
const minimist = require('minimist')
const bodyParser = require('body-parser')
const config = require('./config.json')
const api = require('./api')
const builder = require('./builder')
const args = minimist(process.argv)
const componentsPath = args.componentsPath ? path.resolve(args.componentsPath) : path.resolve(__dirname, config.components)
const pagesPath = args.pagesPath ? path.resolve(args.pagesPath) : path.resolve(__dirname, config.pages)
console.log('build index for Vue components', componentsPath)
console.log('build index for Vue pages', pagesPath)

// build Vue components importer
builder.build(componentsPath, path.resolve(__dirname, config.componentsImportFile))
builder.buildPages(pagesPath, path.resolve(__dirname, config.pagesImportFile))

module.exports = app => {
  app.use(bodyParser.json())
  app.use('/api', api)
  app.set('view engine', '.hbs')
}
