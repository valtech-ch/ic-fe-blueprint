import fs from 'fs'
import path from 'path'
import express from 'express'
import cors from 'cors'
import marked from 'marked'

//TODO: pass view script parameters
const srcDir = '/../ic-components'

//TODO dynamically resolve when blueprint is in npm package
let pathToComponents = path.resolve(`${__dirname}${srcDir}/components`)

const pathToPartials = './preview/views/'
const pathToComponentViews = './dist/views/'
const indexViewName = "index.hbs";
const plainViewName = "plain.hbs";

export default (app, http) => {
  app.use(cors())
  app.use(express.json())

  app.get('/structure', async (req, res) => {
    res.json(getNavTree(1))
  })

  app.get('/:type/:component/:view', (req, res) => {
    const {type, component, view} = req.params

    const componentPath = `${pathToComponents}/${type}/${component}`

    const models = require(`${componentPath}/mock/${view}.js`).models
    const raw = 'raw template' // require(`${componentPath}/view/${view}.hbs`)
    const doc = getDocumentation(req.params.type, req.params.component, req.params.view)
    
    res.json({
      models,
      doc,
      raw: 'raw template'
    })
  })
}

function getDocumentation(type, component, view){
  if(!type || !component)
    return null;

  var data = {};
  var docPath = pathToComponents

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

function getNavTree(level, type, component, view){
  //stop of recursion
  if(level > 3)
    return null;

  //build folder path to get elements
  var navPath = pathToComponents;
  if(level > 1 && type){
    navPath = navPath + '/' + type;

    if(level === 3 && component){
      navPath = navPath + '/' + component + '/views';
    }
  }

  //get navigation elements
  var navElements = fs.readdirSync(navPath);
  navElements = navElements.filter((navElement) => {
    if(level < 3)
      return navElement.indexOf('.') === -1;

    if(level === 3)
      return navElement.indexOf('.') !== -1;

    return true;
  });

  navElements = navElements.map((navElement) => {
    //build name
    var name = navElement;
    if(name.indexOf('.') !== -1)
      name = name.substr(0, name.indexOf('.'));

    //Get url when clicking nav element
    var url = '/';
    if(level > 1 && type)
      url = url + type + '/';
    if(level > 2 && component)
      url = url + component + '/';

    url = url + name;

    //Check if is active nav element
    var active = false
    if(level === 3 && view){
      if(view.toLowerCase() === name.toLowerCase())
        active = true
    }
    else if(level === 2 && component){
      if(component.toLowerCase() === name.toLowerCase())
        active = true
    }
    else if(level === 1 && type){
      if(type.toLowerCase() === name.toLowerCase())
        active = true
    }

    var nextType = type;
    if(level == 1){
      nextType = name;
    }

    var nextComponent = component;
    if(level == 2){
      nextComponent = name
    }
    
    return {
      title: name,
      children: getNavTree(level+1, nextType, nextComponent, view)
    }
  });

  //add pages selection to navtree
  if(level === 1)
  {
    navElements.push({
      title: 'pages',
      children: getPages(component)
    })
  }
  
  return navElements;
}

function getPages(modul){
  return []
}