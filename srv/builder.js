const fs = require('fs')
const mkdirp = require('mkdirp')

module.exports = {

  build (src, style, script, dest) {
    const data = []
    if (!fs.existsSync(src)) {
      console.log('WARNING: components src does not exist')
      fs.writeFileSync(dest, '')
      return
    }
    const components = fs.readdirSync(src)
    components.filter(component => {
      const stats = fs.lstatSync(`${src}/${component}`)
      return stats.isDirectory()
    }).forEach(component => {
      const _path = `${src}/${component}`
      const items = fs.readdirSync(_path)

      items.filter(item => {
        return !['.gitkeep', 'README.md'].includes(item)
      }).forEach(item => {
        const name = item.charAt(0).toUpperCase() + item.slice(1)
        if (fs.existsSync(`${_path}/${item}/${name}.vue`)) {
          data.push({
            path: `${_path}/${item}/${name}.vue`,
            name
          })
        }
      })
    })

    let internalString = `// created: ${new Date()}\nimport Vue from 'vue'\n`
    // Add global project stylesheets
    if (fs.existsSync(style)) {
      internalString += `import '${style}'\n`
    }
    // Add global project script
    if (fs.existsSync(script)) {
      internalString += `import '${script}'\n`
    }
    let componentsString = '\n'
    data.forEach(module => {
      internalString += `import ${module.name} from '${module.path}'\n`
      componentsString += `Vue.component('${module.name}', ${module.name})\n`
    })

    const destArr = dest.split('/').slice(0, -1).join('/')
    mkdirp.sync(destArr)
    fs.writeFileSync(dest, internalString + componentsString)
  },
  buildPages (src, style, script, dest) {
    const data = []
    if (!fs.existsSync(src)) {
      console.log('WARNING: pages src does not exist')
      fs.writeFileSync(dest, '')
      return
    }
    const pages = fs.readdirSync(src)
    pages.filter(page => {
      const stats = fs.lstatSync(`${src}/${page}`)
      return stats.isFile()
    }).forEach(page => {
      const name = page.slice(0, -4)
      if (fs.existsSync(`${src}/${page}`)) {
        data.push({
          path: `${src}/${page}`,
          name
        })
      }
    })

    let internalString = `// created: ${new Date()}\nimport Vue from 'vue'\n`
    // Add global project stylesheets
    if (fs.existsSync(style)) {
      internalString += `import '${style}'\n`
    }
    // Add global project script
    if (fs.existsSync(script)) {
      internalString += `import '${script}'\n`
    }
    let componentsString = '\n'
    data.forEach(module => {
      internalString += `import ${module.name} from '${module.path}'\n`
      componentsString += `Vue.component('${module.name}', ${module.name})\n`
    })

    const destArr = dest.split('/').slice(0, -1).join('/')
    mkdirp.sync(destArr)
    fs.writeFileSync(dest, internalString + componentsString)
  },
  buildDirectives (src, dest) {
    let directiveString = ''
    if (!fs.existsSync(src)) {
      console.log('WARNING: directives src does not exist')
      fs.writeFileSync(dest, '')
      return
    }

    directiveString = "import Vue from 'vue'\n"
    const directives = fs.readdirSync(src)
    directives.filter(directive => {
      const stats = fs.lstatSync(`${src}/${directive}`)
      return stats.isFile()
    }).forEach(directive => {
      if (fs.existsSync(`${src}/${directive}`)) {
        const directiveCode = fs.readFileSync(`${src}/${directive}`).toString().replace('import Vue from \'vue\'', '' )
        directiveString += `${directiveCode}`
      }
    })

    fs.writeFileSync(dest, directiveString)
  }
}
