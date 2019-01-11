const Values = require('../db/models/valuesModel');
const Subscribe = require('../db/models/subscribeModel');
const {
    emitValue
} = require('../sockets/base');

Values.watch({}, {
    fullDocument: 'updateLookup'
}).on('change', data => {
    const {
        fullDocument: {
            name,
            nedn
        }
    } = data;
    Subscribe.find({
            name: name,
            nedn: nedn
        }, {
            _id: 0,
            __v: 0
        })
        .then(subs => {
            subs.length > 0 && emitValue(data.fullDocument);
        })
        .catch(err => console.log('Error', err));
});
