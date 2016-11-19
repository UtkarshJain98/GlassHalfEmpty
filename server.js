var express = require('express');
var fs = require('fs');
var request = require('request');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var csurf = require('csurf');
var path = require('path');
var axios = require('axios');
var http = require('http');
var Clarifai = require('clarifai');
var twilio = require('twilio');

var app     = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/');
});

var clientID = 'NbVruBOPShFT7IaTpwWVoUnyg9CsWh8ztMqPJ4iE';
var clientSecret = 'QumS429uhARGJypw9g89C93RsDmJE5nkWfLBM2Ka';
var accessToken = '3Wtkflxmv6MEjhqBzyRzQc2IUyh5si';

var header = {
	'Authorization': 'Bearer 3Wtkflxmv6MEjhqBzyRzQc2IUyh5si',
    'Content-Type': 'application/json'
}


// instantiate a new Clarifai app passing in your clientId and clientSecret
var abc = new Clarifai.App(
  'NbVruBOPShFT7IaTpwWVoUnyg9CsWh8ztMqPJ4iE',
  'QumS429uhARGJypw9g89C93RsDmJE5nkWfLBM2Ka'
);



app.post('/image',function(req,res){
	var url = req.body.url;
	console.log("after url "+url);
	// predict the contents of an image by passing in a url
	abc.models.predict("c08302d6bc6f45fca7c86a7ac905e470", url).then(
	  function(response) {
	    console.log(response.data);
	    res.send(response.data);
	  },
	  function(err) {
	    console.error(err);
	  }
	);
	
});

var accountSid = 'AC0b0ba08cc89a36af2cabd83671ccca75'; 
var authToken = '7e0f05236d7b9432aa8073c6b811ae3c';

var client = new twilio.RestClient(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+14253099634',
    from: '+18554766086'
}, function(err, message) {
    console.log(message.sid);
});


app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
