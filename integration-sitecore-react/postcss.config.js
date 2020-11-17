module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-nested'),
    require('postcss-import-ext-glob'),
    require("postcss-import"),
    require('tailwindcss')
  ]
}