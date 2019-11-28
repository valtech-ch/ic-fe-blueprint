// local modules
const { Compiler } = require('@adobe/htlengine/src/index')
const Runtime = require('./ICRuntime')
const { prepareTemplate } = require('./utilities')

/**
 * Simple engine that compiles the given template and executes it.
 * @param resource the global object to pass into the script
 * @param template the HTL script
 * @param userConfig A config object
 * @returns A promise that resolves to the evaluated code.
 */
module.exports = async function main (resource, template, userConfig = {}) {
  // setup the HTL compiler
  const compiler = new Compiler().withRuntimeVar(Object.keys(resource)).withSourceMap(true)

  const config = Object.assign({
    useOptions: {
      model: 'default'
    }
  }, userConfig)

  template = prepareTemplate(template)

  // compile the script to a executable template function
  const fn = await compiler.compileToFunction(template, null)

  // create the HTL runtime
  const runtime = new Runtime(config.useOptions)
    .setGlobal(resource)
    .withUseDirectory(config.useDir)

  // finally, execute the template function and return the result
  return fn(runtime)
}
