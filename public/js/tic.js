(function() {
  
  var TicTacToe = {
    gameId: null,
    userSign: null,
    turn: false
  }

  TicTacToe.init = function() {

    var socket = io.connect(window.location.host),
        stateBoard = document.getElementById('state');

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

      stateBoard.innerHTML = 'Opponent connected, it is ' + (TicTacToe.turn ? 'your' : 'opponents') + 'turn';
      TicTacToe.startGame();
    });

    socket.on('move', function(data) {

    });

    socket.on('game end', function(data) {
      // End of game or opponent disconnect

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
      cells[i].addEventListener('click', function(el) {
        if (TicTacToe.turn) {
          el.target.innerHTML = TicTacToe.userSign;
          TicTacToe.makeMove(el.id);
        }
      });
    }
  }

  TicTacToe.mask = function() {}

  TicTacToe.makeMove = function() {}

  TicTacToe.endGame = function() {}

  window.onload = TicTacToe.init();

})();