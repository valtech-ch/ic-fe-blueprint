module.exports = function (pathToComponents) {
  const fs = require('fs')
  const axios = require('axios')

  return {
    engine () {
      return require('./engine')
    },
    getTemplate: async function (path) {
      let meta = {}
      try {
        meta = require(`${path}/meta`)
      } catch (e) {
        console.log(e)
        return 'MISSING meta.js'
      }
      const htlPath = `${pathToComponents}/${meta.templatePath}/${meta.component}.html`
      const contentPath = `${pathToComponents}/${meta.templatePath}/.content.xml`
      let htlTemplate = false

      if (fs.existsSync(htlPath)) {
        htlTemplate = fs.readFileSync(htlPath, {
          encoding: 'utf-8'
        })
      } else if (fs.existsSync(contentPath)) {
        const contentConfig = fs.readFileSync(contentPath, {
          encoding: 'utf-8'
        })
        const regex = /sling:resourceSuperType="([^"]*)"/gm
        const componentPath = regex.exec(contentConfig)
        try {
          const result = await axios.get(`https://raw.githubusercontent.com/adobe/aem-core-wcm-components/master/content/src/content/jcr_root/apps/${componentPath[1]}/${meta.component}.html`)
          htlTemplate = result.data
        } catch (e) {
          console.log(e)
        }
      }
      return htlTemplate
    },

    async getProcessedTpl (path, model) {
      const engine = this.engine()
      const template = this.getTemplate(path)
      if (template) {
        const raw = await engine(model, template, { useDir: pathToAemMocks, useOptions: { model: viewModel } })
        if (raw) {
          return raw.body
        }
      }
      return ''
    }
  }
}
