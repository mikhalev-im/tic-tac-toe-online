(function() {

  var socket = io();

  var TicTacToe = {
    gameId: null,
    userSign: null,
    turn: false,
    init: init,
    startGame: function() {},
    mask: function() {},
    move: function() {},
    endGame: function() {}
  }

  function init() {
    var socket = io.connect(window.location.hostname + ':1337', {resource: 'api'});

    socket.on('connect', function() {
      var stateBoard = document.getElementById('state');
      stateBoard.innerHTML = 'Successfully connected to server';
    });
  }
})();