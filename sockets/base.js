const events = require('events');
const emitter = new events.EventEmitter();

const set = (io) => {
  // setInterval(() => {
  //   const val = Math.floor(Math.random() * 100 + 1);
  //   console.log('emit val', val);
  //   io.emit('IMSCSCFInitRegSuccRatioDC=ims.mnc020.mcc334.3gppnetwork.org,g3SubNetwork=Mexico,g3ManagedElement=R5TEPECSCF01', {
  //     value: val
  //   });
  // }, 60000);
  emitter.on('nValue', val => {
    const key = `${val.name}${val.nedn}`;
    io.emit(key, val);
    console.log('emitter io //////////', val);
  });
}

const emitValue = (doc) => {
  emitter.emit('nValue', doc);
};

module.exports = {
  set: set,
  emitValue: emitValue
};
