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
  console.log('A user connected, id: ' + socket.id);
  Game.init(socket.id, function(ready, gameId, opponent, x, y) {
    if (ready) {
      socket.join(gameId);
      io.sockets.connected[opponent].join(gameId);

      socket.emit('ready', {
        gameId: gameId,
        userSign: 'X',
        turn: true
      });

      io.to(opponent).emit('ready', {
        gameId: gameId,
        userSign: 'O',
        turn: false
      });

    } else {
      socket.emit('wait');
    }
  });

  socket.on('move', function(cell, sign) {
    let gameId = Game.usersPlaying[socket.id];
    
    Game.move(gameId, socket.id, cell, function(result, winCells) {
      let opponent = Game.gamesOnline[gameId].user.id === socket.id ? Game.gamesOnline[gameId].opponent.id : Game.gamesOnline[gameId].user.id;

      if (result) {
        io.to(opponent).emit('lose', winCells);
        socket.emit('win', winCells);
      } else {
        io.to(opponent).emit('move', cell);
      }
    });
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected, id ' + socket.id);
    // Need to close rooms
    Game.endGame(socket.id, function(opponent) {
      if (opponent) {
        socket.to(opponent).emit('opponentLeft');
      }
    });
  });
});

http.listen(port, function() {
  console.log('Listening on port ' + port);
});