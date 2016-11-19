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
<<<<<<< HEAD
var multer = require('multer');
var fs = require('fs');
=======
var twilio = require('twilio');
>>>>>>> 981c00fc771288e81b2dadb2bca1b7434e395dc2

var app     = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './uploads');
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

function decodeBase64Image(dataString) {
	var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
	var response = {};
	if (matches.length !== 3) {
		return new Error('Invalid input string');
	}
	response.type = matches[1];
	response.data = new Buffer(matches[2], 'base64');
	return response;
}

var upload = multer(); 

// for parsing multipart/form-data
app.post('/testFormData', upload.array(), function(req, res) {
	var base64Data = decodeBase64Image(req.body.testdot);
	//console.log('writing file...', base64Data);
	var filename = Date.now() + ".jpg";
	fs.writeFile(__dirname + "/uploads/" + filename, base64Data.data, function(err) {
		if (err) {
			console.log(err);
			res.send({
				"success": false,
				"error": err
			});
		}
		fs.readFile(__dirname + "/uploads/" + filename, function(err, data) {
			if (err) {
				res.send({
					"success": false,
					"error": err
				});
			}
			console.log('reading file...', filename);
			res.send({"success":true, "filename":filename});
		});
	});
});

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
