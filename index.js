// Load app dependencies
var http = require('http'),
  path = require('path'),
  express = require('express'),
  twilio = require('twilio'),
  firebase = require("firebase"),
  bodyParser = require('body-parser'),
  errorHandler = require('express-error-handler')

// Load configuration information from system environment variables.
var TWILIO_ACCOUNT_SID = "AC0ee9085bf027984dc427585a54173f39",
  TWILIO_AUTH_TOKEN = "c0c52f565d3b1f4978e66aa65672c4fb",
  TWILIO_NUMBER = "+14702382881";

// Create an authenticated client to access the Twilio REST API
var client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
var numbers = {};

var config = {
  apiKey: "AIzaSyCtpX8eEkJH0rWvikVLeqU5Xm0eYDhmyEs",
  authDomain: "vizitr-17f48.firebaseapp.com",
  databaseURL: "https://vizitr-17f48.firebaseio.com",
  storageBucket: "vizitr-17f48.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();
var numberData;

function initializeNewNumber(number, firstName) {
  firebase.database().ref('/numbers/' + number).set({
    first: firstName, //initialize first name from first message sent
    last: '',
    reason: '',
    timein: '',
    timeout: ''
  });
}

function addData(exists, number, body, response, snapshot) {
  if (exists) {
    console.log('user ' + number + ' exists!');
    if (snapshot.last == '') {
      console.log("hello");
      firebase.database().ref('/numbers/' + number + '/last').set(body);
      console.log("in last");
      response.send("<Response><Message>What is the reason for your visit?</Message></Response>");
    } else if (snapshot.reason == '') {
      firebase.database().ref('/numbers/' + number + '/reason').set(body);
      firebase.database().ref('/numbers/' + number + '/timein').set(new Date().getTime());
      console.log("in reason");
      response.send("<Response><Message>Great! Please proceed to security with this QR Code: http://qrickit.com/api/qr.php?d=https://vizitr.herokuapp.com/security/" + encodeURIComponent(snapshot.first) + "/" + encodeURIComponent(snapshot.last) + "/" + encodeURIComponent(body) + "</Message></Response>")
    } else {
      response.send("<Response><Message>Your information has already been filled out.</Message></Response>");
    }
  } else {
    console.log('user ' + number + ' does not exist!');
    initializeNewNumber(number, body);
    response.send("<Response><Message>What is your last name?</Message></Response>");
    console.log(numberData);
    // Do something here you want to do for first time users (Store data in database?)
  }
}

function checkForFirstTime(number, body, response) {
  firebase.database().ref('/numbers/' + number).once('value', function (snapshot) {
    var exists = (snapshot.val() !== null);
    addData(exists, number, body, response, snapshot.val());
  });
}

// Create an Express web application with some basic configuration
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(function (err, req, res, next) {
  console.log(err);
  next(err);
});

app.use(express.static(path.join(__dirname, 'public')));

// render our home page
app.get('/', function (req, res) {
  var name = 'Ayush';
  res.render(__dirname + '/views/index');
});

app.get('/dashboard', function (req, res) {
  var name = 'Ayush';
  res.render(__dirname + '/views/dashboard');
});
// handle a POST request to send a text message.  This is sent via ajax on our
// home page

app.post('/message', function (request, response) {
  //console.log(request.body, response);
  checkForFirstTime(request.body.From, request.body.Body, response);
  console.log(numberData);
});

app.get('/number/:number', function (request, response) {
  client.sendSms({
    to: request.param('number'),
    from: TWILIO_NUMBER,
    body: 'Hello welcome to Vizitr! Please enter your first name to get started'
  }, function (err, data) {
    // When we get a response from Twilio, respond to the HTTP POST request
    response.send('Message is inbound!');
  });
});
/*
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/

// Start our express app, by default on port 3000
http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});