const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Keys Schema
const KeysSchema = new Schema({
    _id: String,
    list: [{
        type: String
    }],
});

// Keys model
const Keys = mongoose.model('Keys', KeysSchema);

module.exports = Keys;
