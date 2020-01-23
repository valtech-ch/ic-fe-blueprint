// built-in modules
const path = require('path')
// declared dependencies
const fse = require('fs-extra')
// local modules
const { Compiler } = require('@adobe/htlengine')

const { prepareTemplate } = require('./utilities')

/**
 * Simple engine that compiles the given template and executes it.
 * @param resource the global object to pass into the script
 * @param template the HTL script
 * @param userConfig A config object
 * @returns A promise that resolves to the evaluated code.
 */
module.exports = async function main (resource, template, userConfig = {}) {
  const compiler = new Compiler()
    .withOutputDirectory('.')
    .includeRuntime(true)
    .withRuntimeVar(Object.keys(resource))
    .withSourceMap(true)

  const config = Object.assign({
    outFile: './out.js',
    template: './srv/htl/template.js',
    useOptions: {
      model: 'default'
    }
  }, userConfig)

  if (config.template) {
    let runtimeTemplate = await fse.readFile(config.template, 'utf-8')
    compiler.withCodeTemplate(runtimeTemplate)
  }

  template = prepareTemplate(template)

  let code = await compiler.compileToString(template)

  const filename = path.resolve(process.cwd(), config.outFile)
  await fse.writeFile(filename, code, 'utf-8')

  // eslint-disable-next-line import/no-dynamic-require,global-require
  delete require.cache[require.resolve(filename)]
  // eslint-disable-next-line import/no-dynamic-require,global-require
  const service = require(filename)
  return service.main(resource, config)
}
