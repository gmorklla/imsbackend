const events = require('events');
const emitter = new events.EventEmitter();

function set(io) {
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('test', data => {
      console.log('test', data);
    });
  });
  emitter.on('nValue', val => {
    console.log('emitter', val);
    const key = val.name + val.nedn;
    io.emit(key, val);
  });
}

function emitNValue(val) {
  emitter.emit('nValue', val);
}

module.exports = {
  set: set,
  emitNValue: emitNValue
};
