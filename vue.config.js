const configureAPI = require('./srv/configure')
const minimist = require('minimist')
const config = require('./srv/config.json')
const { defineRootPath, definePath, mapPathToImportString } = require('./srv/path')

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
                    options[0]['process.env'].COMPONENTS_BASEPATH = `"${mapPathToImportString(componentsPath)}"`
                    options[0]['process.env'].PAGES_BASEPATH = `"${mapPathToImportString(pagesPath)}"`
                    options[0]['process.env'].DIRECTIVES = `"${mapPathToImportString(directivesFilePath)}"`
                    options[0]['process.env'].FILTERS = `"${mapPathToImportString(filtersFilePath)}"`
                    options[0]['process.env'].PLUGINS = `"${mapPathToImportString(pluginsFilePath)}"`
                    options[0]['process.env'].MIXINS = `"${mapPathToImportString(mixinsFilePath)}"`
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
