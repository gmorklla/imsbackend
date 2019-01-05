const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Parser Schema
const DataLoadSchema = new Schema({
  formulaName: {
    type: String,
    required: true
  },
  nedn: {
    type: String,
    required: true
  },
  day: {
    type: Date,
    required: true
  },
  data: {}
});

DataLoadSchema.index({
  day: -1,
  formulaName: 1,
  nedn: 1
}, {
  background: true,
  unique: true
});

// Issue model
const DataLoad = mongoose.model('DataLoad', DataLoadSchema);

module.exports = DataLoad;
