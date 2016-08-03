const assert = require('chai').assert;
const http = require('http');
const io = require('../public/js/socket.io-1.4.5');

const server = {
  hostname: 'localhost',
  port: 3000
}

describe('server', function() {
  it('should listen on port 3000', function() {
    http.get({
      hostname: server.hostname,
      port: server.port,
      path:'/'
    }, function(res) {
      assert.equal(res.statusCode, 200);
    });
  });
});

describe('socket', function() {
  const client1 = io.connect(server.hostname + server.port);
  it('should accept connection', function() {

    client1.on('connect', function() {
      assert.equal(true, true);
    });

    client1.on('connect_error', function() {
      assert.equal(false, true);
    });
  })

  it('should answer wait if no opponent', function() {
    client1.on('wait', function() {
      assert.equal(true, true);
    });
  });
});