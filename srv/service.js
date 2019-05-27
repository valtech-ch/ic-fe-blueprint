const fs = require('fs')
const marked = require('marked')
const hbs = require('handlebars')

module.exports = function (pathToComponents, pathToPages) {
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
        doc = '<p>DOCUMENTATION IS MISSING!</p>'
      }

      return doc
    },

    processViewHit: function (req, res) {
      const { type, component, view, viewModel } = req.params
      const response = {}

      let path = type === 'pages' ? `${pathToPages}` : `${pathToComponents}`

      if (!component) {
        path += `/${type}`

        response.doc = service.getDocumentation(path)
      } else if (!view) {
        path += `/${type}/${component}`

        response.doc = service.getDocumentation(path)
      } else {
        path += `/${type}/${component}/`

        const mock = require(`${path}/mock.js`)
        const doc = service.getDocumentation(path, `/doc.md`)

        const viewModelName = viewModel || 'default'
        const vm = mock.models[viewModelName]
        const template = fs.readFileSync(`${path}/views.hbs`, {
          encoding: 'utf-8'
        })
        const hbsOnly = !fs.existsSync(`${path}/${view}.vue`)

        response.models = mock.models
        response.doc = doc
        response.raw = service.getView(template, vm)
        response.html = template
        response.hbsOnly = hbsOnly
      }

      res.json(response)
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
      if (level > 3) {
        return null
      }

      // build folder path to get elements
      var navPath = pathToComponents
      if (level > 1 && type) {
        navPath = navPath + '/' + type

        if (level === 3 && component) {
          navPath = navPath + '/' + component
        }
      }

      // get navigation elements
      var navElements = fs.readdirSync(navPath)
      navElements = navElements.filter((navElement) => {
        if (level < 3) {
          return navElement.indexOf('.') === -1
        }

        if (level === 3) {
          return navElement.indexOf('.') !== -1 && navElement.substr(-4) === '.vue'
        }

        return true
      })

      navElements = navElements.map((navElement) => {
        // build name
        var name = navElement
        if (name.indexOf('.') !== -1) {
          name = name.substr(0, name.indexOf('.'))
        }

        // Get url when clicking nav element
        var url = '/'
        if (level > 1 && type) {
          url = url + type + '/'
        }
        if (level > 2 && component) {
          url = url + component + '/'
        }

        url = url + name

        // Check if is active nav element
        var active = false
        if (level === 3 && view) {
          if (view.toLowerCase() === name.toLowerCase()) {
            active = true
          }
        } else if (level === 2 && component) {
          if (component.toLowerCase() === name.toLowerCase()) {
            active = true
          }
        } else if (level === 1 && type) {
          if (type.toLowerCase() === name.toLowerCase()) {
            active = true
          }
        }

        var nextType = type
        if (level == 1) {
          nextType = name
        }

        var nextComponent = component
        if (level == 2) {
          nextComponent = name
        }

        return {
          title: name,
          children: service.getNavTree(level + 1, nextType, nextComponent, view)
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
      //get navigation elements
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
