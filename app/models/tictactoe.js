function TicTacToe() {
  this.gamesOnline = [];
  this.usersPlaying = [];
  this.usersWaiting = [];
  this.x = 3;
  this.y = 3;
  this.stepsToWin = 3;
}

function GameItem(user, opponent, x, y, stepsToWin) {
  this.board = [];
  this.user = user;
  this.opponent = opponent;
  this.x = x;
  this.y = y;
  this.stepsToWin = stepsToWin;
  this.steps = 0;
}

TicTacToe.prototype.start = function(user, cb) {
  if (Object.keys(this.usersWaiting).length > 0) {
    var opponent = Object.keys(this.usersWaiting).shift();
    var game = new GameItem(user, opponent, this.x, this.y, this.stepsToWin);
    var gameId = user + opponent;
    this.gamesOnline[gameId] = game;
    this.usersPlaying[user] = gameId;
    this.users[oppinent] = gameId;
    cb(true, gameId, opponent, this.x, this.y);
  } else {
    this.usersWaiting[user] = true;
    cb(false);
  }
};

// TicTacToe.prototype.end = function(user, cb) {
//   delete this.waitingUsers[user];
//   if (!this.users[user]) return;

//   var gameId = this.users[user];
//   if (!this.games[gameId]) return;

//   var game = this.games[gameId];

// };


module.exports = TicTacToe;