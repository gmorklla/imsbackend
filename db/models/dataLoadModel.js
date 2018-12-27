const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Parser Schema
const DataLoadSchema = new Schema({
    documentKey: {
        type: String,
        required: true
    },
    formulaName: {
        type: String,
        required: true
    },
    day: {
        type: Date,
        required: true
    },
    measurement: {
        type: String,
        required: true,
    },
    nedn: [{
        name: {
            type: String,
            required: true
        },
        values: []
    }]
});

DataLoadSchema.index({
    "day": -1,
    "formulaName": 1,
    "measurement": 1,
    "nedn.name": 1
}, {
    background: true,
    unique: true
});

// Issue model
const DataLoad = mongoose.model('DataLoad', DataLoadSchema);

module.exports = DataLoad;