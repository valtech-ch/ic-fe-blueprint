const fs = require('fs')
const marked = require('marked')
const hbs = require('handlebars')
const axios = require('axios')

module.exports = function (pathToComponents, pathToPages, pathToAemMocks, backendTemplates = 'hbs') {
  const registerPartials = function (directory) {
    var files = fs.readdirSync(directory)

    files.forEach(function (file) {
      if (fs.statSync(directory + '/' + file).isDirectory()) {
        registerPartials(directory + '/' + file)
      } else {
        var matches = /^([^.]+).hbs$/.exec(file)
        if (matches) {
          var name = matches[1]
          var template = fs.readFileSync(directory + '/' + file, 'utf8')
          hbs.registerPartial(name, template)
        }
      }
    })
  }

  // initialisation
  registerPartials(pathToComponents)

  const service = {
    getDocumentation: function (componentPath, viewName = 'README.md') {
      let pathToDoc = componentPath

      pathToDoc += `/${viewName}`

      let doc
      if (fs.existsSync(pathToDoc)) {
        doc = service.getMarkdownByPath(pathToDoc)
      } else {
        doc = false
      }

      return doc
    },

    processViewHit: async function (req, res) {
      const { type, view, viewModel } = req.params
      const response = {}
      const notifications = []
      const errors = []

      let path = type === 'pages' ? `${pathToPages}` : `${pathToComponents}`

      if (!view) {
        path += `/${type}`
        const doc = service.getDocumentation(path)

        notifications.push({ text: 'view not set' })

        if (doc) {
          response.doc = doc
        } else {
          notifications.push({ text: 'doc.md not found' })
        }
      } else {
        path += `/${type}/${view}/`

        const doc = service.getDocumentation(path, `/doc.md`)
        if (!doc) {
          notifications.push({ text: 'doc.md not found' })
        }
        const viewModelName = viewModel || 'default'

        let mock = {}
        let vm = {}

        if (fs.existsSync(`${path}/mock.js`)) {
          mock = require(`${path}/mock.js`)
          vm = mock.models[viewModelName]
        } else {
          notifications.push({ text: 'mock.js file not found' })
        }

        // define CMS template
        let raw
        let cmsTemplate = ''
        let cmsOnly = !fs.existsSync(`${path}/${view}.vue`)
        if (backendTemplates === 'hbs') {
          if (fs.existsSync(`${path}/views.hbs`)) {
            cmsTemplate = fs.readFileSync(`${path}/views.hbs`, {
              encoding: 'utf-8'
            })
            raw = service.getView(cmsTemplate, vm)
          } else {
            notifications.push({ text: `${path}/views.hbs not found` })
          }
        } else if (backendTemplates === 'htl') {
          try {
            cmsTemplate = await service.getHtlTemplate(path, view)
            if (cmsTemplate) {
              const engine = require('./htl/engine')
              raw = await engine(vm.htl || {}, cmsTemplate, { useDir: pathToAemMocks, useOptions: { model: viewModel } })

              if (!raw) {
                notifications.push({ text: 'Referenced htl template not found' })
              }
            } else {
              notifications.push({ text: 'meta.js file not found' })
            }
          } catch (e) {
            console.log(e)
            errors.push({ text: e.toString() })
          }
        }

        response.models = mock.models || null
        response.doc = doc
        response.raw = raw
        response.html = cmsTemplate
        response.cms = backendTemplates
        response.cmsOnly = cmsOnly
        response.notifications = notifications
        response.errors = errors
      }

      res.json(response)
    },

    getHtlTemplate: async function (path, view) {
      let meta = {}
      try {
        meta = require(`${path}/meta`)
      } catch (e) {
        return false
      }
      const htlPath = `${pathToComponents}/${meta.templatePath}/${meta.component}.html`
      // TODO check whether this makes sense
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

    getView: function (html, viewModel) {
      let template = hbs.compile(html)
      return template(viewModel)
    },

    getMarkdownByPath: function (mdPath) {
      try {
        var markdownHtml = marked(fs.readFileSync(mdPath, 'utf8'))
        markdownHtml = markdownHtml.replace(/<h1/g, "<h1 class='title is-size-3'")
        markdownHtml = markdownHtml.replace(/<h2/g, "<h2 class='title is-size-4'")
        markdownHtml = markdownHtml.replace(/<h3/g, "<h3 class='title is-size-5'")
        markdownHtml = markdownHtml.replace(/<h4/g, "<h4 class='title is-size-6'")
        markdownHtml = markdownHtml.replace(/<h5/g, "<h5 class='title is-size-6'")
        markdownHtml = markdownHtml.replace(/<h6/g, "<h6 class='title is-size-6'")
        return markdownHtml
      } catch (e) {
        return {
          error: {
            message: 'Error in getMarkdownByPath(mdPath)',
            exception: e
          }
        }
      }
    },

    getNavTree: function (level, type, component, view) {
      // stop of recursion
      if (level > 2) {
        return null
      }

      // build folder path to get elements
      var navPath = pathToComponents
      if (level > 1 && type) {
        navPath = navPath + '/' + type
      }

      // get navigation elements
      var navElements = fs.readdirSync(navPath)
      navElements = navElements.filter((navElement) => {
        if (level < 3) {
          return navElement.indexOf('.') === -1
        }

        if (level === 2) {
          return navElement.indexOf('.') !== -1 && navElement.substr(-4) === '.vue'
        }

        return true
      })

      navElements = navElements.map((navElement) => {
        var nextType = type
        if (level === 1) {
          nextType = navElement
        }

        var nextComponent = component
        if (level === 2) {
          nextComponent = navElement
        }

        return {
          title: navElement,
          children: level + 1 >= 3 ? null : service.getNavTree(level + 1, nextType, nextComponent, view)
        }
      })

      // add pages selection to navtree
      if (level === 1) {
        navElements.push({
          title: 'pages',
          children: service.getPages(component)
        })
      }

      return navElements
    },

    getPages: function (modul) {
      const navPath = pathToPages
      // get navigation elements
      const navElements = fs.readdirSync(navPath)
      const pages = []

      navElements.map((navElement) => {
        pages.push({
          title: navElement.slice(0, -4),
          children: null
        })
      })

      return pages
    }
  }
  return service
}
