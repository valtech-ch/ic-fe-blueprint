const fs = require('fs')
const mkdirp = require('mkdirp')

module.exports = {

  build (src, dest) {
    const data = []
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
    data.forEach(module => {
      internalString += `\nimport ${module.name} from '${module.path}'\n`
      internalString += `Vue.component('${module.name}', ${module.name})\n`
    })

    const destArr = dest.split('/').slice(0, -1).join('/')
    mkdirp.sync(destArr)
    fs.writeFileSync(dest, internalString)
  },
  buildPages (src, dest) {
    const data = []
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
    data.forEach(module => {
      internalString += `\nimport ${module.name} from '${module.path}'\n`
      internalString += `Vue.component('${module.name}', ${module.name})\n`
    })

    const destArr = dest.split('/').slice(0, -1).join('/')
    mkdirp.sync(destArr)
    fs.writeFileSync(dest, internalString)
  }
}
