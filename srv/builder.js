const fs = require('fs')

module.exports = {

  build (src, dest) {
    const data = []
    const components = fs.readdirSync(src)
    components.filter(component => {
      const stats = fs.lstatSync(`${src}/${component}`)
      return stats.isDirectory()
    }).forEach(component => {
      const _path = `${src}/${component}`
      const types = fs.readdirSync(_path)

      types.filter(type => {
        return !['.gitkeep'].includes(type)
      }).forEach(type => {
        if (fs.existsSync(`${_path}/${type}/vue`)) {
          const files = fs.readdirSync(`${_path}/${type}/vue`)
          files.forEach(file => {
            const fileNoExt = file.substr(0, file.length - 4)
            data.push({
              path: `${_path}/${type}/vue/${file}`,
              name: fileNoExt
            })
          })
        }
      })
    })

    let internalString = `// created: ${new Date()}\nimport Vue from 'vue'\n`
    data.forEach(module => {
      internalString += `\nimport ${module.name} from '${module.path}'\n`
      internalString += `Vue.component('${module.name}', ${module.name})\n`
    })

    fs.writeFileSync(dest, internalString)
  }
}
