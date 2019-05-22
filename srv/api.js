const path = require('path')
const express = require('express')
const router = express.Router({ mergeParams: true })
const config = require('./config.json')
const service = require('./service')(path.resolve(__dirname, config.components))

router.get('', function (req, res, next) {
  res.send({ running: true })
})

router.get('/structure', async (req, res) => {
  res.json(service.getNavTree(1))
})

router.get('/:type/:component?/:view?/:viewModel?', service.processViewHit)

module.exports = router
