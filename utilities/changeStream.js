const ParserW = require('../db/models/parserModel');
const DataLoad = require('../db/models/dataLoadModel');
const Formula = require('../db/models/formulaModel');
const createDayData = require('./createDataForDay');

const filter = [{
    $match: {
      $or: [{
          $and: [{
              'fullDocument.measurement': {
                $eq: 'cscfAcceptedRegistrations'
              }
            },
            {
              'fullDocument.moid': {
                $eq: 'DEFAULT'
              }
            }
          ]
        },
        {
          $and: [{
              'fullDocument.measurement': {
                $eq: 'cscfRegistrationsFailure'
              }
            },
            {
              'fullDocument.moid': {
                $in: [
                  'SIPResponseCode=400',
                  'SIPResponseCode=401',
                  'SIPResponseCode=403',
                  'SUM'
                ]
              }
            }
          ]
        }
      ]
    }
  },
  {
    $project: {
      ns: 0,
      'fullDocument._id': 0
    }
  }
];
// ** Must be saved on db instead
const keys = [];

ParserW.watch(filter, {
  fullDocument: 'updateLookup'
}).on('change', data => {
  if (data.operationType === 'insert') {
    keys.push(String(data.documentKey._id));
    // ** Check counters that are used on several formulas option
    getFormula(data)
      .then(formula => saveInsertDataLoad(data, formula))
      .then(_ => {})
      .catch(err => console.log('error saveInsert', err));
  }
  if (data.operationType === 'update') {
    if (keys.includes(String(data.documentKey._id))) {
      getFormula(data)
        .then(formula => saveUpdateDataLoad(data, formula))
        .then(_ => {})
        .catch(err => console.log('error saveUpdate', err));
    }
  }
});

async function saveInsertDataLoad(doc, formula) {
  const {
    fullDocument: {
      day,
      measurement,
      moid,
      nedn,
      values
    }
  } = doc;
  const compMeasurement = measurement + '.' + moid;
  const hour = Object.keys(values)[0];
  const minutes = Object.keys(values[hour])[0];
  const step = hour + ':' + minutes;
  try {
    const inDb = await findInDb(formula.name, day);
    if (inDb) {
      return await updateData(inDb, nedn, step, compMeasurement);
    } else {
      const obj = await createDayData(day, formula);
      return await updateData(obj._id, nedn, step, compMeasurement);
    }
  } catch (error) {
    console.log('Error on saveInsertDataLoad', error);
  }
}

async function saveUpdateDataLoad(doc, formula) {
  const {
    fullDocument: {
      day,
      measurement,
      moid,
      nedn
    },
    updateDescription: {
      updatedFields
    }
  } = doc;
  const compMeasurement = measurement + '.' + moid;
  const pieces = Object.keys(updatedFields)[0].split('.');
  const step = pieces[1] + ':' + pieces[2];
  try {
    const inDb = await findInDb(formula.name, day);
    if (inDb) {
      return await updateData(inDb, nedn, step, compMeasurement);
    }
  } catch (error) {
    console.log('Error on saveUpdateDataLoad', error);
  }
}

function findInDb(name, day) {
  return DataLoad.findOne({
    formulaName: name,
    day: day
  }, {
    _id: 1
  });
}

async function getFormula(doc) {
  const {
    fullDocument: {
      measurement,
      moid
    }
  } = doc;
  const counter = measurement + '.' + moid;
  let formulaObj;
  const formulas = await Formula.find({});
  formulas.forEach(formula => {
    const check = formula.counters.includes(counter);
    if (check) {
      formulaObj = formula;
    }
  });
  return formulaObj;
}

function updateData(id, nedn, step, cName) {
  const filterObj = {
    _id: id
  };
  const jTime = 'data.' + step;
  const kToFilter = jTime + '.name';
  filterObj[kToFilter] = cName;
  const kToPush = jTime + '.$.nedn';
  const objToPush = {};
  objToPush[kToPush] = nedn;
  return DataLoad.findOneAndUpdate(filterObj, {
      $push: objToPush
    })
    .then(val => val)
    .catch(err => err);
}

module.exports = ParserW;
