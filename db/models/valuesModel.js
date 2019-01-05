const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

// Value model
const Value = mongoose.model('Value', ValueSchema);

module.exports = Value;
