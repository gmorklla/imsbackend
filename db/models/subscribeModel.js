const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Subscribe Schema
const SubscribeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    nedn: {
        type: String,
        required: true
    }
});

SubscribeSchema.index({
    name: 1,
    nedn: 1
}, {
    background: true,
    unique: true
});

// Subscribe model
const Subscribe = mongoose.model('Subscribe', SubscribeSchema);

module.exports = Subscribe;
