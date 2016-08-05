const assert = require('chai').assert;
const http = require('http');
const io = require('socket.io-client');

const server = {
  hostname: 'localhost',
  port: 3000,
  url: 'http://localhost:3000'
}

describe('server', function() {
  it('should listen on port ' + server.port, function(done) {
    http.get({
      hostname: server.hostname,
      port: server.port,
      path:'/'
    }, function(res) {
      assert.equal(res.statusCode, 200);
      done();
    });
  });
});

describe('socket', function() {
  
  describe('1 player behavior', function() {
    let client1, message = false;

    before(function(done) {
      client1 = io.connect(server.url);

      client1.on('wait', function() {
        message = true;
      });

      client1.on('connect', function() {
        done();
      })
    });

    after(function(done) {
      client1.disconnect();

      let interval = setInterval(function() {
        if (!client1.connected) {
          clearInterval(interval);
          done();
        }
      }, 100);
    });

    it('should accept connection', function() {
      assert.equal(client1.connected, true);
    })

    it('should send wait state', function() {
      assert.equal(client1.connected, true);
    })

  })

  describe('2 players behavior', function(done) {

    let client1, client2, data;

    before(function(done) {
      client1 = io.connect(server.url);
      client2 = io.connect(server.url);

      client2.on('ready', function(resData) {
        data = resData;
        done();
      });
    });

    after(function(done) {
      client2.disconnect();
      client1.disconnect();

      let interval = setInterval(function() {
        if (!client1.connected && !client2.connected) {
          clearInterval(interval);
          done();
        }
      }, 100);
    });

    it('should send ready and data when 2 users ready to play', function() {
      assert.equal(typeof data.gameId === 'string' && typeof data.userSign === 'string' && typeof data.turn === 'boolean', true);
    });

    it('should send move and cellId on somones move', function(done) {
      client2.on('move', function(cell) {
        assert.equal(cell, '0-0');
        done();
      })

      client1.emit('move', '0-0');
    });

    it('should send opponentLeft on opponent disconnect', function(done) {
      client2.on('opponentLeft', function() {
        done();
      });

      client1.disconnect();
    });

  });

});




