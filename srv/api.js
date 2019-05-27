const path = require('path')
const express = require('express')
const router = express.Router({ mergeParams: true })
const config = require('./config.json')
const minimist = require('minimist')
const args = minimist(process.argv)
console.log('Received arguments:', args)
const componentsPath = args.componentsPath ? path.resolve(args.componentsPath) : path.resolve(__dirname, config.components)
const pagesPath = args.pagesPath ? path.resolve(args.pagesPath) : path.resolve(__dirname, config.pages)
console.log('Your components are in:', componentsPath)
console.log('Your pages are in:', pagesPath)
const service = require('./service')(componentsPath, pagesPath)

router.get('', function (req, res, next) {
  res.send({ running: true })
})

router.get('/structure', async (req, res) => {
  res.json(service.getNavTree(1))
})

router.get('/:type/:component?/:view?/:viewModel?', service.processViewHit)

module.exports = router
