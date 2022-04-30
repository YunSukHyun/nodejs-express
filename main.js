const express = require('express')
const app = express()
const port = 8080
var bodyParser = require('body-parser');
var compression = require('compression');
var fs = require('fs');
var topicRouter = require('./routes/topic');
var indexRouter = require('./routes/index');
const { urlencoded } = require('body-parser');
const { application } = require('express');
const { default: helmet } = require('helmet');

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(compression());
app.get('*', (req, res, next)=>{
  fs.readdir('./data', function(error, fileList){
    req.list = fileList;
    next();
  })
})
app.use('/topic', topicRouter);
app.use('/', indexRouter);

app.use((req, res, next)=>{
  res.status(404).send('Sorry can\'t find that!');
})

app.use((err, req, res, next)=>{
  console.log(err.stack);
  res.status(500).send('Something broke');
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
/*var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(req,res){
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, fileList){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(fileList);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          res.writeHead(200);
          res.end(html);
        });
      } else {
        fs.readdir('./data', function(error, fileList){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(fileList);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            res.writeHead(200);
            res.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(error, fileList){
        var title = 'WEB - create';
        var list = template.list(fileList);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '');
        res.writeHead(200);
        res.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      req.on('data', function(data){
          body = body + data;
      });
      req.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            res.writeHead(302, {Location: `/?id=${title}`});
            res.end();
          })
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, fileList){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(fileList);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          res.writeHead(200);
          res.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      req.on('data', function(data){
          body = body + data;
      });
      req.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              res.writeHead(302, {Location: `/?id=${title}`});
              res.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      req.on('data', function(data){
          body = body + data;
      });
      req.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            res.writeHead(302, {Location: `/`});
            res.end();
          })
      });
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
});
app.listen(3000);*/

