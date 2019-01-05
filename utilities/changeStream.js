const ParserW = require('../db/models/parserModel');
const DataLoad = require('../db/models/dataLoadModel');
const Formula = require('../db/models/formulaModel');
const Keys = require('../db/models/keysToWatchModel');
const createDayData = require('./createDataForDay');
const calculateProcess = require('./calculateKpi');

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

ParserW.watch(filter, {
  fullDocument: 'updateLookup'
}).on('change', data => {
  if (data.operationType === 'insert') {
    // ** Check counters that are used on several formulas option
    const key = String(data.documentKey._id);
    addKey(key)
      .then(_ => getFormula(data))
      .then(formula => saveInsertDataLoad(data, formula))
      .then(_ => {})
      .catch(err => manageError('Error insert', err));
  }
  if (data.operationType === 'update') {
    const key = String(data.documentKey._id);
    getKeys()
      .then(keys => {
        const kArr = keys.length > 0 ? keys[0].list : [];
        return kArr.includes(key) ? getFormula(data) : false;
      })
      .then(formula => (formula ? saveUpdateDataLoad(data, formula) : false))
      .then(_ => {})
      .catch(err => manageError('Error update', err));
  }
});

async function getKeys() {
  return await Keys.find({
    _id: 'keys'
  }, {
    list: 1
  });
}

async function addKey(key) {
  return Keys.findOneAndUpdate({
    _id: 'keys'
  }, {
    $push: {
      list: key
    }
  }, {
    new: true,
    upsert: true
  });
}

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
    const inDb = await findInDb(formula.name, day, nedn);
    if (inDb) {
      return await updateData(inDb, step, compMeasurement);
    } else {
      const obj = await createDayData(day, formula, nedn);
      return await updateData(obj._id, step, compMeasurement);
    }
  } catch (error) {
    manageError('Error on saveInsertDataLoad', error);
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
    const inDb = await findInDb(formula.name, day, nedn);
    if (inDb) {
      return await updateData(inDb, step, compMeasurement);
    }
  } catch (error) {
    manageError('Error on saveUpdateDataLoad', error);
  }
}

function findInDb(name, day, nedn) {
  return DataLoad.findOne({
    formulaName: name,
    day: day,
    nedn: nedn
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

function updateData(id, step, cName) {
  const filterObj = {
    _id: id
  };
  const jTime = 'data.' + step;
  const kToFilter = jTime + '.name';
  filterObj[kToFilter] = cName;
  const kToPush = jTime + '.$.check';
  const objToPush = {};
  objToPush[kToPush] = true;
  const project = {
    formulaName: 1,
    day: 1,
    nedn: 1
  };
  project[jTime] = 1;
  return DataLoad.findOneAndUpdate(filterObj, objToPush, {
      new: true
    })
    .select(project)
    .then(updated => {
      checkToCalculate(updated, step);
      return true;
    })
    .catch(err => manageError('Error on update', err));
}

function checkToCalculate(updated, step) {
  const toCheck = updated.data[step];
  let checks = 0;
  toCheck.forEach(obj => obj.check && checks++);
  if (checks >= toCheck.length - 1) {
    calculateProcess(updated);
  }
}

function manageError(msg, error) {
  console.log(msg, error);
}

module.exports = ParserW;
