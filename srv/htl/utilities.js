module.exports.prepareTemplate = function (template) {
  const expressions = [
    /data-sly-use\.template=(["'])core.*?\1/,
    /<sly[^>]+data-sly-call=(["']).*?\1.*?><\/sly>/
  ]

  expressions.forEach(expression => {
    template = template.replace(expression, '')
  })

  return template
}
