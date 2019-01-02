const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Formula Schema
const FormulaSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    counters: [String],
    formula: {
        type: String,
        required: true
    }
});

FormulaSchema.index({
    name: 1
}, {
    background: true,
    unique: true
});

// Formula model
const Formula = mongoose.model('Formula', FormulaSchema);

module.exports = Formula;
