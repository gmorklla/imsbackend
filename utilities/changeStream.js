const ParserW = require('../db/models/parserModel');
const DataLoad = require('../db/models/dataLoadModel');

const formulas = [{
    name: 'IMSCSCFInitRegSuccRatio',
    counters: [
      'cscfAcceptedRegistrations.DEFAULT',
      'cscfRegistrationsFailure.SIPResponseCode=400',
      'cscfRegistrationsFailure.SIPResponseCode=401',
      'cscfRegistrationsFailure.SIPResponseCode=403',
      'cscfRegistrationsFailure.SUM'
    ]
  },
  {
    name: 'IMSCSCFOrgSessSetupSuccRatio',
    counters: [
      'scscfOriginatingInviteSuccessfulEstablishedNoAs.sum',
      'scscfOriginatingInviteSuccessfulEstablishedToAs.sum',
      'scscfOriginatingInviteCancelledBeforeEarlyDialog.DEFAULT',
      'scscfOriginatingInviteNoAsFailed.403',
      'scscfOriginatingInviteNoAsFailed.407',
      'scscfOriginatingInviteNoAsFailed.484',
      'scscfOriginatingInviteToAsFailed.403',
      'scscfOriginatingInviteToAsFailed.407',
      'scscfOriginatingInviteToAsFailed.484',
      'scscfOriginatingInviteNoAsAttempts.DEFAULT',
      'cscfOriginatingInviteToAsAttempts.DEFAULT'
    ]
  }
];

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
        },
        {
          operationType: {
            $eq: 'update'
          }
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

const keys = [];

ParserW.watch(filter, {
  fullDocument: 'updateLookup'
}).on('change', data => {
  if (data.operationType === 'insert') {
    keys.push(String(data.documentKey._id));
    // ** Check counters that are used on several formulas option
    const name = getFormulaName(data);
    saveInsertDataLoad(data, name)
      .then(_ => {})
      .catch(err => console.log('error saveInsert', err));
  }
  if (data.operationType === 'update') {
    if (keys.includes(String(data.documentKey._id))) {
      const name = getFormulaName(data);
      saveUpdateDataLoad(data, name)
        .then(val => console.log('saveUpdate', val))
        .catch(err => console.log('error saveUpdate', err));
    }
  }
});

function getFormulaName(doc) {
  const {
    fullDocument: {
      measurement,
      moid
    }
  } = doc;
  const counter = measurement + '.' + moid;
  let fName = '';
  formulas.forEach(formula => {
    const check = formula.counters.includes(counter);
    if (check) {
      fName = formula.name;
    }
  });
  return fName;
}

async function saveInsertDataLoad(doc, fName) {
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
  const step = hour + '.' + minutes;
  const obj = {
    formulaName: fName,
    day: day,
    measurement: compMeasurement,
    data: [{
      time: step,
      nedns: [nedn]
    }]
  };
  try {
    const inDb = await DataLoad.findOne({
      formulaName: fName,
      day: day,
      measurement: compMeasurement,
      'data.time': step
    }, {
      _id: 1
    });
    if (inDb) {
      return await updateData(inDb, nedn, step);
    } else {
      return await createNewData(obj);
    }
  } catch (error) {
    console.log('Error on saveInsertDataLoad', error);
  }
}

function createNewData(obj) {
  return DataLoad.create(obj)
    .then(val => val)
    .catch(err => err);
}

function updateData(id, nedn, step) {
  console.log('//////////// updateData', id, nedn, step);
  return DataLoad.findOneAndUpdate({
      _id: id,
      'data.time': step
    }, {
      $push: {
        'data.$.nedns': nedn
      }
    })
    .then(val => val)
    .catch(err => err);
}

async function saveUpdateDataLoad(doc, fName) {
  const {
    fullDocument: {
      day,
      measurement,
      moid,
      nedn
    },
    updateDescription: {
      updatedFields
    },
    documentKey: {
      _id
    }
  } = doc;
  const compMeasurement = measurement + '.' + moid;
  const pieces = Object.keys(updatedFields)[0].split('.');
  const step = pieces[1] + '.' + pieces[2];
  const inDb = await DataLoad.findOne({
    formulaName: fName,
    day: day,
    measurement: compMeasurement,
    'data.time': step
  }, {
    _id: 1
  });
  if (inDb) {
    console.log('//////////// inDb update', inDb);
    return await updateData(inDb, nedn, step);
  } else {
    const obj = {
      time: step,
      nedns: [nedn]
    };
    return await createNewObjInDataArr(obj, _id);
  }
}

function createNewObjInDataArr(obj, id) {
  return DataLoad.findOneAndUpdate({
      documentKey: id
    }, {
      $push: {
        data: obj
      }
    }, {
      new: true
    })
    .then(val => val)
    .catch(err => err);
}

module.exports = ParserW;
