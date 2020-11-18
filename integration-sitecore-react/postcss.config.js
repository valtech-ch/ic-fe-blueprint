module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-import-ext-glob'),
    require('postcss-nested'),
    require('tailwindcss'),
    require('autoprefixer')
  ]
}