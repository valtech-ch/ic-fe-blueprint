const path = require('path')
const minimist = require('minimist')
const bodyParser = require('body-parser')
const config = require('./config.json')
const api = require('./api')
const builder = require('./builder')
const args = minimist(process.argv)
const componentsPath = args.componentsPath ? path.resolve(args.componentsPath) : path.resolve(__dirname, config.components)
console.log('build index for Vue components', componentsPath)

// build Vue components importer
builder.build(componentsPath, path.resolve(__dirname, config.componentsImportFile))

module.exports = app => {
  app.use(bodyParser.json())
  app.use('/api', api)
  app.set('view engine', '.hbs')
}
