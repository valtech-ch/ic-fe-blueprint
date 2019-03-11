const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const marked = require('marked')
const hbs = require('handlebars')
const config = require('./config')
const exphbs = require('express-handlebars')

//TODO: pass view script parameters
const srcDir = '/../ic-components'

//TODO dynamically resolve when blueprint is in npm package
let pathToComponents = path.resolve(`${__dirname}${srcDir}/components`)
let pathToSrc = path.resolve(`${__dirname}${srcDir}`)

registerPartials(pathToComponents)

let app = express();

app.use(cors())
app.use(express.json())

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs'); 
app.set('views', path.join(__dirname, '../public'));

app.get('/navigation', async (req, res) => {
  res.json(getNavTree(1))
})

app.get('/:type?/:component?/:view?/:viewModel?', processViewHit)
app.get('/plain/:type?/:component?/:view?/:viewModel?', processPlainView)

app.listen(process.env.PORT || 3000);

function processViewHit (req, res) {
  const { type, component, view, viewModel } = req.params
  res.json(buildViewModel(type, component, view, viewModel))
}

function processPlainView (req, res) {
  const { type, component, view, viewModel } = req.params
  let plainViewModel = buildViewModel(type, component, view, viewModel)
  let plainView = buildPlainView(plainViewModel)
  res.render('index.hbs', plainViewModel)
}

function buildPlainView(){

}

function buildViewModel(type, component, view, viewModel){
  const response = {}

  let componentPath = `${pathToComponents}`

  if(!type){
    response.doc = getDocumentation(componentPath)
  }
  else if(type === 'pages'){
    let componentPath = `${pathToSrc}/${type}`
    response.doc = getDocumentation(componentPath)
  }
  else if (!component) {
    componentPath += `/${type}`
    response.doc = getDocumentation(componentPath)

  } else if (!view) {
    componentPath += `/${type}/${component}`
    response.doc = getDocumentation(componentPath)

  } else {
    componentPath += `/${type}/${component}/`

    const mock = require(`${componentPath}/mock/${view}.js`)
    const doc = getDocumentation(componentPath, `/doc/${view}.md`)

    const viewModelName = viewModel ? viewModel : 'default'
    const vm = mock.models[viewModelName]
    const template = fs.readFileSync(`${componentPath}/views/${view}.hbs`, {
      encoding: 'utf-8'
    })
    const hbsOnly = !fs.existsSync(`${componentPath}/vue/${view}.vue`)

    response.models = mock.models
    response.doc = doc
    response.raw = getView(template, vm)
    response.html = template
    response.hbsOnly = hbsOnly
  }

  return response
}

function registerPartials(directory, type, component){
  var files = fs.readdirSync(directory);

  files.forEach(function (file) {
    var nextComponent = component
    if(file == 'atoms' || file == 'components' || file == 'organisms') {
      type = file;
    }
    else if(!file.includes('.') && file != 'views') {
      nextComponent = file
    }

    if (fs.statSync(directory + '/' + file).isDirectory()) {
      registerPartials(directory + '/' + file, type, nextComponent);
    }
    else {
      var matches = /^([^.]+).hbs$/.exec(file);
      if (matches) {
        var name = `${type}/${component}/${matches[1]}`
        var template = fs.readFileSync(directory + '/' + file, 'utf8');
        hbs.registerPartial(name, template);
      }
    }
  });
}

function getView(html, viewModel){
  let template = hbs.compile(html)
  return template(viewModel)
}

function getDocumentation(componentPath, viewName = 'README.md'){
  let pathToDoc = componentPath

  pathToDoc += `/${viewName}`

  let doc
  if (fs.existsSync(pathToDoc)) {
    doc = getMarkdownByPath(pathToDoc)
  } else {
    doc = '<div class="notification is-warning">Documentation is missing!</div>'
  }

  return doc
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