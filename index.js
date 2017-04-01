var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var numbers = [];
app.use(bodyParser.urlencoded({
  extended: false
}));

app.post("/message", function (request, response) {
  console.log(request.body);
  if (request.body.From in numbers) {
    console.log("In numbers");
  } else {
    console.log("not in numbers");
    numbers.push({
      key: request.body.From,
      value: []
    });
  }
  response.send("<Response><Message>Hello</Message></Response>")
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});