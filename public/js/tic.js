(function() {
  
  var stateBoard = document.getElementById('state');
  var socket = io.connect(window.location.host);
  var TicTacToe = {
    gameId: null,
    userSign: null,
    turn: false
  }

  TicTacToe.init = function() {

    socket.on('connect', function() {
      stateBoard.innerHTML = 'Successfully connected to server';
    });

    socket.on('reconnect', function() {
      stateBoard.innerHTML = 'Reconnected, continue playing';
    });

    socket.on('reconnecting', function() {
      stateBoard.innerHTML = 'Trying to reconnect';
    });

    socket.on('error', function(e) {
      stateBoard.innerHTML = 'Error: ' + (e ? e : 'unknown');
    });

    // Game events
    socket.on('wait', function() {
      stateBoard.innerHTML = 'Waiting for opponent';
    });

    socket.on('ready', function(data) {
      
      TicTacToe.gameId = data.gameId;
      TicTacToe.userSign = data.userSign;
      TicTacToe.turn = (data.userSign === 'X' ? true : false);

      stateBoard.innerHTML = 'Opponent connected, it is ' + (TicTacToe.turn ? 'your' : 'opponents') + ' turn';
      TicTacToe.startGame();
    });

    socket.on('move', function(cellId) {
      var cell = document.getElementById(cellId);
      cell.innerHTML = TicTacToe.userSign === 'X' ? 'O' : 'X';
      TicTacToe.turn = true;
      stateBoard.innerHTML = 'It is your turn';
      document.getElementById(cellId).removeEventListener('click', TicTacToe._makeMoveListener);
    });

    socket.on('win', function(winCells) {
      // End of game or opponent disconnect
      
      for (let i = 0; i < winCells.length; i++) {
        document.getElementById(winCells[i]).innerHTML = TicTacToe.userSign;
        document.getElementById(winCells[i]).style.color = 'green';
      }
      stateBoard.innerHTML = "You win!";
    });

    socket.on('lose', function(winCells) {
      let sign = TicTacToe.userSign === 'X' ? 'O' : 'X';
      
      for (let i = 0; i < winCells.length; i++) {
        document.getElementById(winCells[i]).innerHTML = sign;
        document.getElementById(winCells[i]).style.color = 'red';
      }
      stateBoard.innerHTML = "You lose";
    });

    socket.on('opponentLeft', function() {
      TicTacToe.turn = false;
      stateBoard.innerHTML = "Opponent has left the game, You win";
    });

  }

  TicTacToe.startGame = function() {
    var cells = document.getElementsByClassName('cell');
    for (var i = 0; i < cells.length; i++) {
      cells[i].addEventListener('mouseover', function(el) {
        el.target.style.borderColor = 'red';
      });
      cells[i].addEventListener('mouseout', function(el) {
        el.target.style.borderColor = '';
      });
      cells[i].addEventListener('click', TicTacToe._makeMoveListener);
    }
  }

  TicTacToe.makeMove = function(cell) {
    socket.emit('move', cell, TicTacToe.userSign);
    document.getElementById(cell).removeEventListener('click', TicTacToe._makeMoveListener);
  }

  TicTacToe.endGame = function() {}

  TicTacToe._makeMoveListener = function(el) {
    if (TicTacToe.turn) {
      el.target.innerHTML = TicTacToe.userSign;
      TicTacToe.turn = false;
      stateBoard.innerHTML = 'Opponents turn';
      TicTacToe.makeMove(el.target.id);
    }
  }

  window.onload = TicTacToe.init();

})();