var path = require('path');
var fs = require('fs');
var Finder = require('fs-finder');
var express = require('express')
var exphbs  = require('express-handlebars');

const pathToPartials = './preview/views/'
const pathToComponentViews = './dist/views/'
const pathToComponents = './src/components'
const indexViewName = "index.hbs";

var app = express();
var hbs = exphbs.create({
  extname: '.hbs',
  partialsDir: pathToPartials
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs'); 
app.set('views', pathToPartials);

app.get('/plain/:type?/:module?/:component?/:viewModel?', function(req, res){
  getViewData(req.params.type, req.params.module, req.params.component, req.params.viewModel, true, function(viewModel){
    res.render(indexViewName, viewModel)
  })
});

app.get('/:type?/:module?/:component?/:viewModel?', function(req, res){
  getViewData(req.params.type, req.params.module, req.params.component, req.params.viewModel, false, function(viewModel){
    res.render(indexViewName, viewModel)
  })
});

app.listen(3001);

function getViewData(type, modul, component, viewModelName, isPlain, callback){
  var viewModel = getViewModel(type, modul, component, viewModelName)


  getComponent(type, modul, component, viewModel, function(result){
    var navigation = {}
    navigation.children = getNavTree(1, type, modul, component, viewModelName)

    return callback({
      isPlain: isPlain,
      //isOverview: component === undefined && type !== "pages" ? true : false,
      component: result,
      //page: getPage(type, modul),
      //documentation: getDocumentation(type, modul, component),
      //viewModel: vm ? syntaxHighlight(JSON.stringify(vm, null, 4)) : null,
      navigation: navigation,
      modelSelection: getViewModelSelection(type, modul, component, viewModelName)
    });
  })
}

function getComponent(type, modul, component, viewModel, callback){
  if(!(type && modul && component && viewModel)){
    return callback(null);
  }

  hbs.render(pathToComponentViews + component + ".hbs", viewModel).then((renderedHtml) => {
    return callback({
      name: component,
      viewModel: viewModel,
      view: renderedHtml
    });
  });
}

function getViewModel(type, modul, component, viewModel){
  if(!(type && modul && component))
    return null;

  var mock = require('./src/components/' + type + "/" + modul + "/mock/" + component + ".js");
  if(!viewModel)
    viewModel = 'default'

  return mock.models[viewModel];
}

function getViewModelSelection(type, modul, component, viewModelName){
  if(!(type && modul && component))
    return null;
    
  var mock = require('./src/components/' + type + "/" + modul + "/mock/" + component + ".js");
  if(mock == null)
    return null;
  
  var modelSelection = []
  for (var key in mock.models) {
    if (mock.models.hasOwnProperty(key)) {
      modelSelection.push({
        title: key.charAt(0).toUpperCase() + key.slice(1),
        url: '/' + type + '/' + modul + '/' + component + '/' + key,
        active: viewModelName === key
      })
    }
  }

  return modelSelection;
}

function getNavTree(level, type, modul, component, vModel){
  //stop of recursion
  if(level > 3)
    return null;

  //build folder path to get elements
  var navPath = pathToComponents;
  if(level > 1 && type){
    navPath = navPath + '/' + type;

    if(level === 3 && modul){
      navPath = navPath + '/' + modul;
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
    if(level > 2 && modul)
      url = url + modul + '/';

    url = url + name;

    //Check if is active nav element
    var active = false
    if(level === 3 && component){
      if(component.toLowerCase() === name.toLowerCase())
        active = true
    }
    else if(level === 2 && modul){
      if(modul.toLowerCase() === name.toLowerCase())
        active = true
    }
    else if(level === 1 && type){
      if(type.toLowerCase() === name.toLowerCase())
        active = true
    }

    var nextType = type;
    if(level == 1)
      nextType = name;

    return {
      title: name.charAt(0).toUpperCase() + name.slice(1),
      url: url.toLowerCase(),
      plainUrl: level >= 3 ? '/plain' + url : null,
      active: active,
      children: active || level == 1 ? getNavTree(level+1, nextType, modul, component, vModel) : null,
      level: level
    }
  });

  //add pages selection to navtree
  if(level === 1)
  {
    navElements.push({
      title: 'pages',
      url: '/pages',
      plainUrl: null,
      active: type === 'pages',
      navTreeElements: getPages(modul)
    })
  }
  
  return navElements;
}

function getPages(modul){
  return []
}

/*
var srcPath = path.resolve(__dirname, './src');
var compPath = srcPath + '/components';
var componentViews = path.resolve(__dirname, './public/views/components');

var indexViewName = "index";

app.listen(process.env.PORT || 3000);

app.engine('mustache', mustacheExpress());

app.set('views', './public/views');
app.set('view engine', 'mustache');
app.locals.basedir = app.get('views');

app.use('/public', express.static('public'));

function getViewData(type, modul, component, vModel, isPlain = false){
  var vm = getViewModel(type, modul, component, vModel)

  var viewModel = {
    isPlain: isPlain,
    isOverview: component === undefined && type !== "pages" ? true : false,
    component: getComponent(type, modul, component, vm),
    page: getPage(type, modul),
    documentation: getDocumentation(type, modul, component),
    viewModel: vm ? syntaxHighlight(JSON.stringify(vm, null, 4)) : null,
    navTreeElements: getNavTree(1, type, modul, component, vModel)
  }

  return viewModel;
}

function getViewModel(type, modul, component, viewModel){
  if(!(type && modul && component))
    return null;

  var data = undefined;
  var vmPath = compPath + '/' + type + '/' + modul + '/mock'

  if(viewModel)
    data = getJsonByPath(`${vmPath}/${viewModel}.json`);

  if(data === undefined || data.error)
    data = getJsonByPath(`${vmPath}/${component}.json`);

  if(data === undefined || data.error)
    data = getJsonByPath(`${vmPath}/default.json`);

  data = processPartialModels(data);

  return data;
}

function getNavTree(level, type, modul, component, vModel){
  //stop of recursion
  if(level > 4)
    return null;

  //build folder path to get elements
  var navPath = compPath;
  if(level > 1 && type){
    navPath = navPath + '/' + type;

    if(level === 3 && modul){
      navPath = navPath + '/' + modul + '/views';
    }

    if(level === 4 && modul){
      navPath = navPath + '/' + modul + '/mock';
    }
  }

  //get navigation elements
  var navElements = fs.readdirSync(navPath);
  navElements = navElements.filter((navElement) => {
    if(level < 3)
      return navElement.indexOf('.') === -1;

    if(level === 4)
      return navElement.startsWith(component);

    return true;
  });
  
  if(navElements.length < 2 && level === 4)
    return null;

  navElements = navElements.map((navElement) => {
    //build name
    var name = navElement;
    if(name.indexOf('.') !== -1)
      name = name.substr(0, name.indexOf('.'));

    //Get url when clicking nav element
    var url = '/';
    if(level > 1 && type)
      url = url + type + '/';
    if(level > 2 && modul)
      url = url + modul + '/';
    if(level > 3 && component)
      url = url + component + '/';

    url = url + name;

    //Check if is active nav element
    var active = false
    if(level === 4 && vModel){
      if(vModel.toLowerCase() === name.toLowerCase())
        active = true
    }
    if(level === 3 && component){
      if(component.toLowerCase() === name.toLowerCase())
        active = true
    }
    else if(level === 2 && modul){
      if(modul.toLowerCase() === name.toLowerCase())
        active = true
    }
    else if(level === 1 && type){
      if(type.toLowerCase() === name.toLowerCase())
        active = true
    }

    var nameStart = '';
    for(var i = 0; i < level-1; i++){
      nameStart = nameStart + '>';
    }

    nameStart = nameStart + ' ' + (name.startsWith('_') ? '_' : '');

    return {
      name: nameStart + name.split('-')[name.split('-').length-1],
      url: url,
      plainUrl: level >= 3 ? '/plain' + url : null,
      active: active,
      navTreeElements: active ? getNavTree(level+1, type, modul, component, vModel) : null,
      level: level
    }
  });

  //add pages selection to navtree
  if(level === 1)
  {
    navElements.push({
      name: 'pages',
      url: '/pages',
      plainUrl: null,
      active: type === 'pages',
      navTreeElements: type === 'pages' ? getPages(modul) : null
    })
    navElements.unshift({
      name: 'home',
      url: '/',
      plainUrl: null,
      active: type === undefined,
      navTreeElements: null
    })
  }

  var hasActiveEntry = false;
  for(var i = 0; i < navElements.length; i++) {
    if (navElements[i].active === true) {
      hasActiveEntry = true;
      break;
    }
  }

  if(hasActiveEntry && level !== 1){
    navElements = navElements.filter(function(element){
      return element.active;
    });
  }
  
  return navElements;
}

function getPages(currentPage){
  var pages = fs.readdirSync(srcPath+ '/pages/mock');
  pages = pages.filter((page) => {
    return page.endsWith('.json');
  });

  pages = pages.map((page) => {
    var name = page.substr(0, page.indexOf("."))

    return {
      name: name,
      url: '/pages/' + name,
      plainUrl: '/plain/pages/' + name,
      active: currentPage != null && name.toLowerCase() === currentPage.toLowerCase(),
      navTreeElements: null,
      level: 2
    }
  });

  return pages;
}

function getComponent(type, modul, component, viewModel){
  if(!(type && modul && component && viewModel))
    return null;
  
  var partialViews = getMustachePartials();

  var mustacheTemplate = fs.readFileSync(componentViews + "/" + component + ".mustache", 'utf8')
  if(!mustacheTemplate)
    return null;

  return {
    name: component,
    viewModel: viewModel,
    view: mustache.render(mustacheTemplate, viewModel, partialViews)
  };
}

function getPage(type, page){
  if(!page || type !== 'pages')
    return null;

  var data = {};
  var pagePath = srcPath + '/pages/mock/' + page + '.json';

  data = getJsonByPath(pagePath);
  data.components = processPartialModels(data.components);
  if(data.error)
    return data;

  var partialViews = getMustachePartials();

  return {
    view: mustache.render(data.layout, data, partialViews)
  }
}



function processPartialModels(data){
  for (var k in data){
    if (data.hasOwnProperty(k) && typeof data[k] === 'string' && data[k].startsWith("%%")) {
      var filename = data[k].replace(/%/g, "");
      if(filename.startsWith("[")){
        data[k] = [];
        filename = filename.replace(/\[/g, "").replace(/\]/g, "");

        var amount = parseInt(filename.substr(0, filename.indexOf('*')));
        filename = filename.substr(filename.indexOf('*'), filename.length - filename.indexOf('*'));

        var files = Finder.from(compPath).findFiles('*' + filename + '.json');
        if(files === null || files.length === 0)
          continue;
  
        var child = getJsonByPath(files[0]);
        child = processPartialModels(child);

        for(var i = 0; i < amount; i++)
          data[k].push(child);
      }
      else{
        var files = Finder.from(compPath).findFiles('*' + filename + '.json');
        if(files === null || files.length === 0)
          continue;
  
        var child = getJsonByPath(files[0]);
        child = processPartialModels(child);
  
        data[k] = child;
      }
    }
  }

  return data;
}

function getDocumentation(type, modul, component){
  var data = {};
  var docPath = compPath + '/';

  if(type === 'pages'){
    if(modul)
      return null;

    docPath = srcPath + '/pages/README.md';
  }else{
    if(type)
      docPath = docPath + type + '/';

    if(modul)
      docPath = docPath + modul + '/';

    if(component)
      docPath = docPath + 'doc/' + component + '.md';
    else
      docPath = docPath + 'README.md';
  }

  return getMarkdownByPath(docPath);
}

function getJsonByPath(jsonPath){
  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch (e) {
    return { 
      error: {
        message: "Error in getJsonByPath(jsonPath)",
        exception: e
      }
    };
  }
}

function parseComponentLinks(html){
  return html.replace(/%%(.+?)%%/g, function(match){
    match = match.substr(2, match.length-4);

    var files = Finder.from(compPath).findFiles('*' + match + '.mustache');
    if(files.length < 1){
      return '<a class="tag is-danger" disabled>COMPONENT NOT FOUND</a>'
    }
    
    var first = files[0];
    var split = first.split('\\');
    
    if(split.length < 5){
      return '<a class="tag is-danger" disabled>CANNOT CREATE COMPONENT LINK</a>'
    }

    var link = split[split.length-1].replace('.mustache', '');
    link = split[split.length-3] + '/' + link;
    link = '/' + split[split.length-4] + '/' + link;

    return '<a href="' + link + '" class="tag is-link">' + match + "</a>";
  });
}

function getMustachePartials(){
  var partialViews = {};
  
  var partials = fs.readdirSync(componentViews);
  partials = partials.forEach((partial) => {
    var name = partial.substr(0, partial.indexOf("."))
    var view = fs.readFileSync(componentViews + "/" + partial, 'utf8');

    partialViews[name] = view;
  });

  return partialViews;
}

function syntaxHighlight(json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  json = json.replace(/{\n/g, "{</br><span class='vmLine'>")
  json = json.replace(/\[\n/g, "[</br><span class='vmLine'>")
  json = json.replace(/,\n/g, ",</span></br><span class='vmLine'>");
  json = json.replace(/\n\s*},/g, "</span></br>},</br>")
  json = json.replace(/\n\s*}/g, "</span></br>}</br>")
  json = json.replace(/\n\s*],/g, "</span></br>],</br>")
  json = json.replace(/\n\s*]/g, "</span></br>]</br>")
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    var cls = 'vmNumber';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'vmKey';
      } else {
        cls = 'vmString';
      }
    } else if (/true|false/.test(match)) {
      cls = 'vmBoolean';
    } else if (/null/.test(match)) {
      cls = 'vmNull';
    }
    
    return '<span class="' + cls + '">' + match + '</span>';
  });
}
*/