(function() {
  var TicTacToe = {
    socket: null,

    stateBoard: null,

    gameId: null,

    userSign: null,

    turn: false,

    showMessage: function(html) {
      this.stateBoard.innerHTML = html;
    },

    onConnect: function() {
      this.showMessage('Successfully connected to server');
    },

    onReconnect: function() {
      this.showMessage('Reconnected, continue playing');
    },

    onReconnecting: function() {
      this.showMessage('Trying to reconnect');
    },

    onError: function(e) {
      this.showMessage('Error: ' + (e ? e : 'unknown'));
    },

    onWait: function() {
      this.showMessage('Waiting for opponent');
    },

    onReady: function(data) {
      this.gameId = data.gameId;
      this.userSign = data.userSign;
      this.turn = (data.userSign === 'X' ? true : false);

      this.showMessage('Opponent connected, it is ' + (this.turn ? 'your' : 'opponents') + ' turn');
      this.startGame();
    },

    onMove: function(cellId) {
      var cell = document.getElementById(cellId);
      cell.innerHTML = this.userSign === 'X' ? 'O' : 'X';
      this.turn = true;

      this.showMessage('It is your turn');
      document.getElementById(cellId).removeEventListener('click', this.makeMoveListener);
    },

    onWin: function(winCells) {
      // End of game or opponent disconnect
      for (var i = 0; i < winCells.length; i++) {
        document.getElementById(winCells[i]).innerHTML = this.userSign;
        document.getElementById(winCells[i]).style.color = 'green';
      }

      this.showMessage("You win! <a href='javascript:void(0)' onclick='window.location.reload()'>Play again?</a>");
    },

    onLose: function(winCells) {
      var sign = this.userSign === 'X' ? 'O' : 'X';

      for (var i = 0; i < winCells.length; i++) {
        document.getElementById(winCells[i]).innerHTML = sign;
        document.getElementById(winCells[i]).style.color = 'red';
      }

      this.showMessage("You lose. <a href='javascript:void(0)' onclick='window.location.reload()'>Play again?</a>");
    },

    onOpponentLeft: function() {
      this.turn = false;
      this.showMessage("Opponent has left the game, You win. <a href='javascript:void(0)' onclick='window.location.reload()'>Play again?</a>");
    },

    init: function() {
      this.stateBoard = document.getElementById('state');
      this.socket = io.connect(window.location.host);
      this.makeMoveListener = this.makeMoveListener.bind(this);

      this.socket.on('connect', this.onConnect.bind(this));
      this.socket.on('reconnect', this.onReconnect.bind(this));
      this.socket.on('reconnecting', this.onReconnecting.bind(this));
      this.socket.on('error', this.onError.bind(this));

      // Game events
      this.socket.on('wait', this.onWait.bind(this));
      this.socket.on('ready', this.onReady.bind(this));
      this.socket.on('move', this.onMove.bind(this));
      this.socket.on('win', this.onWin.bind(this));
      this.socket.on('lose', this.onLose.bind(this));
      this.socket.on('opponentLeft', this.onOpponentLeft.bind(this));
    },

    startGame: function() {
      var cells = document.getElementsByClassName('cell');
      for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('mouseover', function(el) {
          el.currentTarget.style.borderColor = 'red';
        });
        cells[i].addEventListener('mouseout', function(el) {
          el.currentTarget.style.borderColor = '';
        });
        cells[i].addEventListener('click', this.makeMoveListener);
      }
    },

    makeMove: function(cell) {
      this.socket.emit('move', cell, this.userSign);
      document.getElementById(cell).removeEventListener('click', this.makeMoveListener);
    },

    makeMoveListener: function(el) {
      if (this.turn) {
        el.currentTarget.innerHTML = this.userSign;
        this.turn = false;
        this.showMessage('Opponents turn');
        this.makeMove(el.currentTarget.id);
      }
    }
  }

  window.onload = TicTacToe.init();
})();