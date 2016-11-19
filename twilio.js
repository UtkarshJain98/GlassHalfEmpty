var twilio = require("C:\Users\Utkarsh\Desktop\wildhacks\node_modules\twilio-node\lib");

var accountSid = 'AC0b0ba08cc89a36af2cabd83671ccca75'; 
var authToken = '{{7e0f05236d7b9432aa8073c6b811ae3c}}';

var twilio = require('twilio');
var client = new twilio.RestClient(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+13099634',
    from: '+18554766086'
}, function(err, message) {
    console.log(message.sid);
});