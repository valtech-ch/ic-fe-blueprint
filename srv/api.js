const path = require('path')
const express = require('express')
const router = express.Router({ mergeParams: true })
const config = require('./config.json')
const minimist = require('minimist')
const args = minimist(process.argv)
console.log('Received arguments:', args)
const componentsPath = args.componentsPath ? path.resolve(args.componentsPath) : path.resolve(__dirname, config.components)
console.log('Your components are in:', componentsPath)
const service = require('./service')(componentsPath)

router.get('', function (req, res, next) {
  res.send({ running: true })
})

router.get('/structure', async (req, res) => {
  res.json(service.getNavTree(1))
})

router.get('/:type/:component?/:view?/:viewModel?', service.processViewHit)

module.exports = router
