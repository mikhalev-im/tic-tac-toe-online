const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile('app/views/index.html', {root: __dirname});
});

io.on('connection', function(socket) {
  console.log('get connetction');
});

http.listen(port, function() {
  console.log('Listening on port ' + port);
});