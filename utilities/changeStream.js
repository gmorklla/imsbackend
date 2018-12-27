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
        saveInsertDataLoad(data, name);
    }
    if (data.operationType === 'update') {
        if (keys.includes(String(data.documentKey._id))) {
            saveUpdateDataLoad(data);
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

function saveInsertDataLoad(doc, fName) {
    const {
        fullDocument: {
            day,
            measurement,
            moid,
            nedn,
            values
        },
        documentKey: {
            _id
        }
    } = doc;
    const compMeasurement = measurement + '.' + moid;
    const hour = Object.keys(values)[0];
    const minutes = Object.keys(values[hour])[0];
    const step = hour + '.' + minutes;
    const obj = {
        documentKey: _id,
        formulaName: fName,
        day: day,
        measurement: compMeasurement,
        nedn: {
            name: nedn,
            values: step
        }
    };
    DataLoad.create(obj)
        .then(val => console.log('saveInsertDataLoad done!', val))
        .catch(err => console.log('Err', err));
}

function saveUpdateDataLoad(doc) {
    console.log('saveUpdate doc', doc);
    const {
        fullDocument: {
            nedn
        },
        updateDescription: {
            updatedFields
        },
        documentKey: {
            _id
        }
    } = doc;
    console.log('updatedFields', updatedFields);
    const pieces = Object.keys(updatedFields)[0].split('.');
    console.log('pieces', pieces);
    const val = pieces[1] + '.' + pieces[2];
    console.log('val', val);
    DataLoad.findOneAndUpdate({
            documentKey: _id,
            'nedn.name': nedn
        }, {
            $push: {
                'nedn.$.values': val
            }
        }, {
            new: true
        })
        .then(val => console.log('saveUpdateDataLoad done!', val))
        .catch(err => console.log('Err', err));
}

module.exports = ParserW;
