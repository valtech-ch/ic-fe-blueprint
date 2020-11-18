const purgecss = require('@fullhuman/postcss-purgecss');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    require('postcss-import-ext-glob'),
    require('postcss-import'),
    
    require('postcss-nested'),
    require('tailwindcss'),
    require('autoprefixer'),
    cssnano({
      preset: 'default'
    }),
    purgecss({
      content: ['./src/**/*.html', './src/**/*.njk', './dist/**/*.html']
    })
  ]
}