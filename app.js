const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./sockets/base').set(io);
require('./db/connection').connect();
require('./utilities/changeStream');
require('./utilities/vChangeStream');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(4001, function () {
  console.log('listening on *:4001');
});
