var express = require('express');
var app = express();
var path = require("path");
var Motors = require("../motor/motors.js");

var motors = new Motors(12,5,13,6,17);

app.get("/controls", function(req, res){
	res.sendFile(path.join(__dirname + "/controls.html"));
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/forward/:speed', function (req, res) {
  motors.moveForward(req.params.speed);
  res.send('Moving up! Full forward');
});

app.get('/backward/:speed', function (req, res) {
  motors.moveBackwards(req.params.speed);
  res.send('Moving back!');
});

app.get('/turnRight/:speed', function (req, res) {
  motors.turnRight(req.params.speed);
  res.send('Right turn! Comensing');
});

app.get('/turnLeft/:speed', function (req, res) {
  motors.turnLeft(req.params.speed);
  res.send('Left turn! Comensing');
});

app.get('/stop', function (req, res) {
  motors.fullStop();
  res.send('Kill down the engines!');
});

app.get('/cleanup', function (req, res) {
  motors.cleanup();
  res.send('Wipe out the pins!');
});

app.get('/left', function (req, res) {
  motors.steerLeft();
  res.send('Steering Left!');
});
app.get('/right', function (req, res) {
  motors.steerRight();
  res.send('Steering Right!');
});
app.get('/stopSteer', function (req, res) {
  motors.stopSteer();
  res.send('Steering Left!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

