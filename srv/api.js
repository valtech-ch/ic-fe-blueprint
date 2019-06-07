const factory = function (componentsPath, pagesPath, aemMocksPath, backendTemplates) {
  const express = require('express')
  const router = express.Router({ mergeParams: true })
  const service = require('./service')(componentsPath, pagesPath, aemMocksPath, backendTemplates)

  router.get('', function (req, res, next) {
    res.send({ running: true })
  })

  router.get('/structure', async (req, res) => {
    res.json(service.getNavTree(1))
  })

  router.get('/:type/:component?/:view?/:viewModel?', service.processViewHit)

  return router
}

module.exports = factory
