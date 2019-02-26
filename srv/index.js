import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
import marked from 'marked'

const pathToPartials = './preview/views/'
const pathToComponentViews = './dist/views/'
const pathToComponents = '/../ic-components/components'
const indexViewName = "index.hbs";
const plainViewName = "plain.hbs";

export default (app, http) => {
  app.use(cors())
  app.use(express.json())

  app.get('/structure', async (req, res) => {
    res.json({
      atoms: {
        text: [
          'heading',
        ]
      },
      molecules: {

      },
      organisms: {

      },
      pages: [
        'demo',
      ]
    })
  })

  app.get('/:type/:component/:view', (req, res) => {
    const componentPath = path.resolve(`${__dirname}${pathToComponents}/${req.params.type}/${req.params.component}`)

    const model = require(`${componentPath}/mock/${req.params.view}.js`)
    const doc = fs.readFileSync(`${componentPath}/doc/${req.params.view}.md`, {
      encoding: 'utf-8'
    })

    res.json({
      models: model.models,
      doc: getDocumentation(req.params.type, req.params.component, req.params.view),
    })
  })
}

function getDocumentation(type, component, view){
  if(!type || !component)
    return null;

  var data = {};
  var docPath = path.resolve(`${__dirname}${pathToComponents}`)

  if(type === 'pages'){
    return null;
  }else{
    if(type)
      docPath = docPath + '/' + type + '/';

    if(component)
      docPath = docPath + component + '/';

    if(view)
      docPath = docPath + 'doc/' + view + '.md';
    else
      docPath = docPath + 'README.md';
  }

  return getMarkdownByPath(docPath);
}

function getMarkdownByPath(mdPath){
  try {
    var markdownHtml = marked(fs.readFileSync(mdPath, 'utf8'));
    markdownHtml = markdownHtml.replace(/<h1/g, "<h1 class='title is-size-3'");
    markdownHtml = markdownHtml.replace(/<h2/g, "<h2 class='title is-size-4'");
    markdownHtml = markdownHtml.replace(/<h3/g, "<h3 class='title is-size-5'");
    markdownHtml = markdownHtml.replace(/<h4/g, "<h4 class='title is-size-6'");
    markdownHtml = markdownHtml.replace(/<h5/g, "<h5 class='title is-size-6'");
    markdownHtml = markdownHtml.replace(/<h6/g, "<h6 class='title is-size-6'");
    return markdownHtml;
  } catch (e) {
    return { 
      error: {
        message: "Error in getMarkdownByPath(mdPath)",
        exception: e
      }
    };
  }
}