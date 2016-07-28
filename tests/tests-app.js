var assert = require('chai').assert;
var http = require('http');

describe('server', function() {
  it('shoud listen on port 3000', function() {
    http.get({
      hostname: 'localhost',
      port: 3000,
      path:'/'
    }, function(res) {
      assert.equal(res.statusCode, 200);
    });
  });
});