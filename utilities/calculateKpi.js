const Parser = require('../db/models/parserModel');
const {
    kpi1,
    kpi2
} = require('./kpisCal');
const Value = require('../db/models/valuesModel');

// Query to db
const makeQuery = (counters, date, nedn) => {
    return Parser.find({
        day: date,
        nedn: nedn,
        measurement: {
            $in: counters
        }
    }, {
        'values': 1,
        _id: 0,
        measurement: 1,
        moid: 1
    });
}

const getDateForQuery = (range) => {
    const today = new Date();
    let date;
    switch (range) {
        case 'today':
            date = today.toISOString().split('T')[0];
            break;
        case 'yesterday':
            today.setDate(date.getDate() - 1);
            date = today.toISOString().split('T')[0];
            break;

        default:
            const dev = new Date('2018-10-20 00:00:00.000');
            date = dev.toISOString().split('T')[0];
            break;
    }
    return date;
}

const saveValue = (obj) => {
    return Value.create(obj);
}

const calculate = (name, counters, step) => {
    let result;
    switch (name) {
        case 'IMSCSCFInitRegSuccRatio':
            result = kpi1(counters, step.replace(':', '.'));
            break;
        case 'IMSCSCFOrgSessSetupSuccRatio':
            result = kpi2(counters, step.replace(':', '.'));
            break;

        default:
            break;
    }
    return result;
}

const calculateProcess = (obj) => {
    const {
        data,
        day,
        nedn,
        formulaName
    } = obj;
    const kStep = Object.keys(data)[0];
    const counters = data[kStep]
        .map(val => val.name.split('.')[0])
        .filter((v, i, a) => a.indexOf(v) === i);
    // Call function to make query
    makeQuery(counters, day, nedn)
        .then(counters => {
            const result = calculate(formulaName, counters, kStep);
            result['date'] = day;
            const hours = Number(kStep.split(':')[0]);
            const minutes = Number(kStep.split(':')[1]);
            result.date.setHours(hours, minutes);
            result['nedn'] = nedn;
            return saveValue(result);
        })
        .then(val => console.log('Value created', val))
        .catch(error => console.log(error));
}

module.exports = calculateProcess;
