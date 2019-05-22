const path = require('path')
const express = require('express')
const router = express.Router({ mergeParams: true })
const config = require('./config.json')
const minimist = require('minimist')
const args = minimist(process.argv)
console.log(args)
const componentsPath = args.basePath || path.resolve(__dirname, config.components)
const service = require('./service')(componentsPath)

router.get('', function (req, res, next) {
  res.send({ running: true })
})

router.get('/structure', async (req, res) => {
  res.json(service.getNavTree(1))
})

router.get('/:type/:component?/:view?/:viewModel?', service.processViewHit)

module.exports = router
