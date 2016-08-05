const assert = require('chai').assert;
const TicTacToe = require('../app/models/tictactoe');

describe('game item', function() {

});

describe('TicTacToe object', function() {
  game = new TicTacToe;

  describe('properties', function() {
    it('should create object containing currently playing games', function() {
      assert.typeOf(game.gamesOnline, 'object');
    });

    it('should create object containing currently playing users', function() {
      assert.typeOf(game.usersPlaying, 'object');
    });

    it('should create object containing waiting users', function() {
      assert.typeOf(game.usersWaiting, 'object');
    });

    it('should contain properties of game field', function() {
      assert.typeOf(game.x, 'number');
      assert.typeOf(game.y, 'number');
    });

    it('should contain steps to win parameter', function() {
      assert.typeOf(game.stepsToWin, 'number');
    });
  });

  describe('methods', function() {
    describe('init', function() {

      after(function() {
        game.gamesOnline = {};
        game.usersPlaying = {};
        game.usersWaiting = {};
      });

      let sampleUserId1 = 'sampleUser1',
          sampleUserId2 = 'sampleUser2',
          sampleGameId,
          xLength,
          yLength;

      it('should return false when there is no second player', function() {
        game.init(sampleUserId1, function(data) {
          assert.strictEqual(data, false);
        });
      });

      it('should add first user to waiting list', function() {
        assert.propertyVal(game.usersWaiting, sampleUserId1, true);
      });

      it('should return game properties when second player connected', function() {
        game.init(sampleUserId2, function(ready, gameId, opponent, boardX, boardY) {
          xLength = boardX,
          yLength = boardY,
          sampleGameId = gameId;
          assert.strictEqual(ready, true);
          assert.typeOf(gameId, 'string');
          assert.strictEqual(opponent, sampleUserId1);
          assert.typeOf(boardX, 'number');
          assert.typeOf(boardY, 'number');
        });
      });

      it('should add gameId to usersPlaying list under users id property', function() {
        assert.propertyVal(game.usersPlaying, sampleUserId1, sampleGameId);
        assert.propertyVal(game.usersPlaying, sampleUserId2, sampleGameId);
      });

      it('should delete user from waiting list when second player connected', function() {
        assert.notProperty(game.usersWaiting, sampleUserId1);
      });

      it('should create game object', function() {
        let curGame = game.gamesOnline[sampleGameId];
        assert.typeOf(curGame, 'object');
        assert.propertyVal(curGame.user, 'id', sampleUserId2);
        assert.propertyVal(curGame.opponent, 'id', sampleUserId1);
        assert.lengthOf(curGame.board, xLength);
        assert.lengthOf(curGame.board[0], yLength);
      });

    });

    describe('move', function() {
      let user = 'user',
          opponent = 'opponent',
          gameId;

      before(function() {
        game.init(opponent, function() {});
        game.init(user, function(result, curGameId) {
          gameId = curGameId;
        });
      });

    });
  });
});