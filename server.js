// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);

var port = process.env.PORT || 80;

// Phaser exposed (used in index.hmtl)
app.use('/phaser',express.static(__dirname + '/node_modules/phaser/build/'));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// listen for requests :)
listener = http.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// socket messages ===============================================
require('./server/socket')(io);
require('./server/update')(io);
