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
var multer = require('multer');
var twilio = require('twilio');


var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var path = require('path').dirname(require.main.filename);
var publicPath = path + "/public/";
var obj = [];

var accountSid = 'AC0b0ba08cc89a36af2cabd83671ccca75';
var authToken = '7e0f05236d7b9432aa8073c6b811ae3c';
var client = new twilio.RestClient(accountSid, authToken);

server.listen('8081');


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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
//var counter = 0;

io.sockets.on('connection', function(socket) {

    socket.on('testFormData', function(obj, ack) {
        //app.post('/testFormData', upload.array(), function(req, res) {
        if (obj.testdot != "data:,") {
            var base64Data = decodeBase64Image(obj.testdot);
            //console.log('writing file...', base64Data);
            var filename = Date.now() + ".jpg";
            fs.writeFile(__dirname + "/public/uploads/" + filename, base64Data.data, function(err) {
                if (err) {
                    console.log(err);
                    ack({
                        "success": false,
                        "error": err
                    });
                }
                fs.readFile(__dirname + "/public/uploads/" + filename, function(err, data) {
                    if (err) {
                        ack({
                            "success": false,
                            "error": err
                        });
                    }
                    console.log('reading file...', filename);
                    var url = "http://nisarg.me:8081/uploads/" + filename;
                    console.log("after urlencoded " + url);
                    // predict the contents of an image by passing in a url
                    abc.models.predict("c08302d6bc6f45fca7c86a7ac905e470", url).then(
                        function(response) {
                            console.log("before response");

                            console.log(response.data.outputs[0].data);
                            obj = [{
                                "id": response.data.outputs[0].data.concepts[0].id,
                                "value": response.data.outputs[0].data.concepts[0].value
                            }, {
                                "id": response.data.outputs[0].data.concepts[1].id,
                                "value": response.data.outputs[0].data.concepts[1].value
                            }, {
                                "id": response.data.outputs[0].data.concepts[2].id,
                                "value": response.data.outputs[0].data.concepts[2].value
                            }];

                            var ackObj = {
                            	"GlassExists":response.data.outputs[0].data.concepts[0].value,
                            	"WaterIsDirty":response.data.outputs[0].data.concepts[1].value,
                            	"EmptyGlass":response.data.outputs[0].data.concepts[2].value
                            }
                            console.log("before twilio ");

							//if(counter==0)
                            	initTwilio(obj);
                            
                            console.log("control flow here");
                            ack(ackObj);
                        },
                        function(err) {
                            console.error(err);
                            ack({
	                            "success": false,
	                            "error": err
	                        });
                        });
                    //res({"success":true, "filename":filename});
                });
                //});
            });
        } else {
        	ack({
                "success": false,
                "error": "webcam not enabled"
            });
        }
    });

});
// for parsing multipart/form-data

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/');
});

app.get('/:file', function(req, res) { sendFolder("", req, res); });

app.get('/uploads/:file', function(req, res) { sendFolder("uploads", req, res); });


function sendFolder(folder, req, res) {
    var fileId = req.params.file;
    var file = publicPath + folder + "/" + fileId;
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.send("404 not found.");
    }
}

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




var initTwilio = function(obj) {
	
    if (obj[0].value > 0.85 && obj[1].value > 0.8 && obj[2].value < 0.2) {
	   // counter++;
        client.messages.create({
            body: 'Oops! The Water is not pure and the glass is full as well',
            to: '+14253099634',
            from: '+18554766086'
        }, function(err, message) {
	        if(err)
	        	console.log(err)
			else
            	console.log(message);
        });
    } else if (obj[0].value > 0.85 && obj[1].value > 0.8) {
	    //counter++;
        client.messages.create({
            body: 'Looks like your water is not pure!',
            to: '+14253099634',
            from: '+18554766086'
        }, function(err, message) {
            if(err)
	        	console.log(err)
			else
            	console.log(message);
        });
    } else if (obj[0].value > 0.85 && obj[2].value < 0.2) {
        //counter++;
        client.messages.create({
            body: 'Close the tap! Your glass is full',
            to: '+14253099634',
            from: '+18554766086'
        }, function(err, message) {
           if(err)
	        	console.log(err)
			else
            	console.log(message);
        });
    }
};
//app.listen('8081');

console.log('Magic happens on port 8081');

exports = module.exports = app;
