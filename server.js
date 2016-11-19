var express = require('express');
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');
var app     = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/');
});


app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;