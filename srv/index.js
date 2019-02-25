import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'

export default (app, http) => {
  app.use(cors())
  app.use(express.json())

  app.get('/structure', async (req, res) => {
    res.json({
      atoms: {
        text: [
          'heading',
        ]
      },
      molecules: {

      },
      organisms: {

      },
      pages: [
        'demo',
      ]
    })
  })

  app.get('/:type/:component/:view', (req, res) => {
    const componentPath = path.resolve(`${__dirname}/../ic-components/components/${req.params.type}/${req.params.component}`)

    const model = require(`${componentPath}/mock/${req.params.view}.js`)
    const doc = fs.readFileSync(`${componentPath}/doc/${req.params.view}.md`, {
      encoding: 'utf-8'
    })

    res.json({
      models: model.models,
      doc
    })
  })
}
