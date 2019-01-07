const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Subscribe = require('./subscribeModel');
const {
    emitNValue
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

ValueSchema.post('save', function (doc, next) {
    // console.log('%s has been saved', doc);
    Subscribe.find({})
        .then(subs => {
            let inDb = null;
            subs.forEach(sub => {
                if (sub.name === doc.name && sub.nedn === doc.nedn) {
                    inDb = sub;
                }
            });
            inDb && emitNValue(doc);
            next();
        })
        .catch(err => console.log('Error', err));
});

// Value model
const Value = mongoose.model('Value', ValueSchema);

module.exports = Value;
