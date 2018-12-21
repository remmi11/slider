var express = require('express');
var app = express();
var path = require("path");
var requirejs = require('requirejs');

// app.use(express.static('public'));

// app.get('/', function (req, res) {
//    res.send('Hello World');
// })

app.use(express.static(path.join(__dirname, '/public')));
// app.use('/static', express.static(path.join(__dirname, '/font-awesome-4.7.0/css')));
app.use(express.static(__dirname + '/node_modules/'));

app.get('/', function(req,res) {
    res.sendfile('public/index.html');
  })
  
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})