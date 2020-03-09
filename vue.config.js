const configureAPI = require('./srv/configure')
const minimist = require('minimist')
const config = require('./srv/config.json')
const { defineRootPath, definePath } = require('./srv/path')

const args = minimist(process.argv)
const rootPath = defineRootPath(args.embedded)
const componentsPath = definePath(args.componentsPath, rootPath, config.components)
const pagesPath = definePath(args.pagesPath, rootPath, config.pages)
const assetsPath = definePath(args.assetsPath, rootPath, config.assets)
const directivesFilePath = definePath(args.directivesFilePath, rootPath, config.directivesFile)
const pluginsFilePath = definePath(args.pluginsFilePath, rootPath, config.pluginsFile)
const mixinsFilePath = definePath(args.mixinsFilePath, rootPath, config.mixinsFile)
const filtersFilePath = definePath(args.filtersFilePath, rootPath, config.filtersFile)

module.exports = {
    devServer: {
        before: configureAPI,
        disableHostCheck: true
    },

    chainWebpack: config => {
       config
            .plugin('define')
            .tap(options => {
                    options[0]['process.env'].COMPONENTS_BASEPATH = `"${componentsPath}"`
                    options[0]['process.env'].PAGES_BASEPATH = `"${pagesPath}"`
                    options[0]['process.env'].DIRECTIVES = `"${directivesFilePath}"`
                    options[0]['process.env'].FILTERS = `"${filtersFilePath}"`
                    options[0]['process.env'].PLUGINS = `"${pluginsFilePath}"`
                    options[0]['process.env'].MIXINS = `"${mixinsFilePath}"`
                    options[0]['process.env'].BLUEPRINT = `"true"`
                    options[0]['process.env'].BLUEPRINT_SET = `"${process.env.BLUEPRINT_SET || 'default'}"`
                    return options
                }
            )

        config.resolve.alias
            .set('@components', componentsPath)

        config.resolve.alias
            .set('@pages', pagesPath)

        config.resolve.alias
            .set('@assets', assetsPath)

        config.resolve.alias
            .set('@directives', directivesFilePath)

        config.resolve.alias
            .set('@plugins', pluginsFilePath)

        config.resolve.alias
            .set('@mixins', mixinsFilePath)

        config.resolve.alias
            .set('@filters', filtersFilePath)
    },

    css: {
        sourceMap: true,
        loaderOptions: {
            postcss: {
                plugins: [
                    require('autoprefixer')()
                ]
            }
        }
    }
}
