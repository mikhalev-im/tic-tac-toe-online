function TicTacToe() {
  this.gamesOnline = {};
  this.usersPlaying = {};
  this.usersWaiting = {};
  this.x = 3;
  this.y = 3;
  this.stepsToWin = 3;
}

function GameItem(user, opponent, x, y, stepsToWin) {
  this.board = [];
  let json = 'null';

  for (let i = 1; i < x; i++) {
    json += ', null';
  }

  json = '[' + json + ']';

  for (let i = 0; i < y; i++) {
    this.board.push(JSON.parse(json));
  }

  this.user = {
    id: user,
    sign: 'X'
  };
  this.opponent = {
    id: opponent,
    sign: 'O'
  };
  this.x = x;
  this.y = y;
  this.stepsToWin = stepsToWin;
}

TicTacToe.prototype.init = function(user, cb) {
  if (Object.keys(this.usersWaiting).length > 0) {
    let opponent = Object.keys(this.usersWaiting).shift();
    let game = new GameItem(user, opponent, this.x, this.y, this.stepsToWin);
    let gameId = user + opponent;
    this.gamesOnline[gameId] = game;
    this.usersPlaying[user] = gameId;
    this.usersPlaying[opponent] = gameId;
    delete this.usersWaiting[opponent];
    cb(true, gameId, opponent, this.x, this.y);
  } else {
    this.usersWaiting[user] = true;
    cb(false);
  }
};

TicTacToe.prototype.move = function(gameId, user, cell, cb) {
  let sign = this.gamesOnline[gameId].user.id === user ? this.gamesOnline[gameId].user.sign : this.gamesOnline[gameId].opponent.sign;
  cell = cell.split('-');
  cell[0] = +cell[0];
  cell[1] = +cell[1];

  this.gamesOnline[gameId].board[cell[0]][cell[1]] = sign;

  this.checkWin(gameId, cell, sign, cb);
}

TicTacToe.prototype.endGame = function(user, cb) {
  if (this.usersWaiting[user]) {
    delete this.usersWaiting[user];
    cb(null);
  } else if (this.usersPlaying[user]) {
    let gameId = this.usersPlaying[user],
        opponent = null;

    if (this.gamesOnline[gameId]) {
      opponent = this.gamesOnline[gameId].user.id === user ? this.gamesOnline[gameId].opponent.id : this.gamesOnline[gameId].user.id;
      delete this.usersPlaying[opponent];
      delete this.gamesOnline[gameId];
    }

    delete this.usersPlaying[user];

    cb(opponent);
  }
};

TicTacToe.prototype.checkWin = function(gameId, lastMove, sign, cb) {
  let board = this.gamesOnline[gameId].board,
      stepsToWin = this.gamesOnline[gameId].stepsToWin,
      winCells = [lastMove.join('-')],
      count = 1; // 1 because of centrall cell

  // CHECK HORIZONTAL
  
  // check horizontal-right
  let i = lastMove[0] + 1, g = lastMove[1];

  while(board[i] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    i++;
  }

  // check horizontal-left
  i = lastMove[0] - 1, g = lastMove[1];

  while(board[i] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    i--;
  }

  if (count >= stepsToWin) {
    cb(true, winCells);
    return;
  }

  // CHECK VERTICAL

  count = 1;
  winCells = [lastMove.join('-')];

  // check vertical-top
  i = lastMove[0], g = lastMove[1] - 1;
  while(board[i][g] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    g--;
  }

  // check vertical-bottom
  i = lastMove[0], g = lastMove[1] + 1;
  while(board[i][g] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    g++;
  }

  if (count >= stepsToWin) {
    cb(true, winCells);
    return;
  }

  // CHECK DIAGONAL /

  count = 1;
  winCells = [lastMove.join('-')];

  //check diagonal / - top
  i = lastMove[0] + 1, g = lastMove[1] - 1;
  while(board[i] && board[i][g] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    i++;
    g--;
  }

  //check diagonal / - bottom
  i = lastMove[0] - 1, g = lastMove[1] + 1;
  while(board[i] && board[i][g] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    i--;
    g++;
  }

  if (count >= stepsToWin) {
    cb(true, winCells);
    return;
  }

  // CHECK DIAGONAL \

  count = 1;
  winCells = [lastMove.join('-')];

  //check diagonal \ - top
  i = lastMove[0] - 1, g = lastMove[1] - 1;
  while(board[i] && board[i][g] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    i--;
    g--;
  }

  //check diagonal \ - bottom
  i = lastMove[0] + 1, g = lastMove[1] + 1;
  while(board[i] && board[i][g] && board[i][g] === sign) {
    winCells.push(i + '-' + g);
    count++;
    i++;
    g++;
  }

  if (count >= stepsToWin) {
    cb(true, winCells);
    return;
  }

  // IF NO WIN, THEN CONTINUE
  cb(false);
}

module.exports = TicTacToe;