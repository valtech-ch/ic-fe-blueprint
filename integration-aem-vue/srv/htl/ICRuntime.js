const { Runtime } = require('@adobe/htlengine')

module.exports = class ICRuntime extends Runtime {
  constructor (useOptions) {
    super()
    this.useOptions = useOptions
  }

  use(uri, options) {
    return super.use(uri, Object.assign({}, this.useOptions, options))
  }
}
