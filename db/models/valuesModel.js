const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subscribe = require('./subscribeModel');
const {
    emitValue
} = require('../../sockets/base');

// Value Schema
const ValueSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nedn: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

ValueSchema.index({
    date: -1,
    name: 1,
    nedn: 1
}, {
    background: true,
    unique: true
});

// ValueSchema.post('save', function (doc, next) {
//     // console.log('%s has been saved', doc);
//     Subscribe.find({
//             name: doc.name,
//             nedn: doc.nedn
//         }, {
//             _id: 0,
//             __v: 0
//         })
//         .then(subs => {
//             subs.length > 0 && emitValue(doc);
//             next();
//         })
//         .catch(err => console.log('Error', err));
// });

// Value model
const Value = mongoose.model('Value', ValueSchema);

module.exports = Value;
