const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const TicTacToe = require('./app/models/tictactoe');
var Game = new TicTacToe();

const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile('app/views/index.html', {root: __dirname});
});

io.on('connection', function(socket) {
  console.log('A user connected');
  Game.start(socket.id.toString(), function() {

  });


  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
});

http.listen(port, function() {
  console.log('Listening on port ' + port);
});