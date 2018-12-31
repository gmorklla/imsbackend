const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Parser Schema
const DataLoadSchema = new Schema({
  formulaName: {
    type: String,
    required: true
  },
  day: {
    type: Date,
    required: true
  },
  data: [{
    time: {
      type: String,
      required: true
    },
    counters: [{
      name: {
        type: String,
        required: true
      },
      nedn: []
    }]
  }]
});

DataLoadSchema.index({
  day: -1,
  formulaName: 1,
  "data.time": 1
}, {
  background: true,
  unique: true
});

// Issue model
const DataLoad = mongoose.model('DataLoad', DataLoadSchema);

module.exports = DataLoad;
