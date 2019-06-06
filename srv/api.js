const path = require('path')
const express = require('express')
const router = express.Router({ mergeParams: true })
const config = require('./config.json')
const minimist = require('minimist')
const args = minimist(process.argv)

const backendTemplates = args.backendTemplates || 'hbs'

const componentsPath = args.componentsPath ? path.resolve(args.componentsPath) : path.resolve(__dirname, config.components)
console.log('Your components are in:', componentsPath)

const pagesPath = args.pagesPath ? path.resolve(args.pagesPath) : path.resolve(__dirname, config.pages)
console.log('Your pages are in:', pagesPath)

let aemMocksPath
if (backendTemplates === 'htl') {
  aemMocksPath = args.aemMocksPath ? args.aemMocksPath : config.aemMocks
  console.log('Your AEM mocks are in:', pagesPath)
}

const service = require('./service')(componentsPath, pagesPath, aemMocksPath, backendTemplates)

router.get('', function (req, res, next) {
  res.send({ running: true })
})

router.get('/structure', async (req, res) => {
  res.json(service.getNavTree(1))
})

router.get('/:type/:component?/:view?/:viewModel?', service.processViewHit)

module.exports = router
