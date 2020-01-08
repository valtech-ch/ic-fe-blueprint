module.exports.prepareTemplate = function (template) {
  const expressions = [
    /data-sly-use\.templates?=(["'])core.*?\1/,
    /data-sly-call=(["']).*?\1.*?/
  ]

  expressions.forEach(expression => {
    template = template.replace(expression, '')
  })

  return template
}
