var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var numbers = {};
app.use(bodyParser.urlencoded({
  extended: false
}));

app.post("/message", function (request, response) {
  console.log(request.body);
  if (request.body.From in numbers) {
    console.log("In numbers");
    if (numbers[request.body.From]["first"] == '') {
      numbers[request.body.From]["first"] = request.body.Body;
      response.send("<Response><Message>What is your last name?</Message></Response>")
    } else if (numbers[request.body.From]["last"] == '') {
      numbers[request.body.From]["last"] = request.body.Body;
      response.send("<Response><Message>What is the reason for your visit?</Message></Response>")
    } else if (numbers[request.body.From]["reason"] == '') {
      numbers[request.body.From]["reason"] = request.body.Body;
      response.send("<Response><Message>Great! Please proceed to security with this QR Code</Message></Response>")
      response.send("<Response><Message>https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://vizitr.herokuapp.com/security/" + [request.body.From]["first"] + "/" + [request.body.From]["last"] + "/" + [request.body.From]["reason"] + "</Message></Response>")
    }
    console.log(numbers[request.body.From]);
  } else {
    console.log("Not in numbers");
    numbers[request.body.From] = {
      "first": '',
      "last": '',
      "reason": ''
    };
    console.log(numbers[request.body.From]);
    response.send("<Response><Message>What is your first name?</Message></Response>")
  }
  response.send("<Response><Message>Hello</Message></Response>")
});
app.get("/security/:first/:last/:reason", function (request, response) {
  res.send(req.params);
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});