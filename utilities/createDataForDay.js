const DataLoad = require('../db/models/dataLoadModel');

function createDayData(date, formula, nedn) {
    const steps = ['0', '15', '30', '45'];
    let day = {};
    const cArr = formula.counters.map(val => {
        return {
            name: val,
            check: false
        }
    });
    for (let i = 0; i < 24; i++) {
        steps.forEach(val => {
            const step = `${String(i)}:${val}`;
            const obj = {};
            obj[step] = cArr;
            day = Object.assign(day, obj);
        });
    }
    const obj = {
        formulaName: formula.name,
        day: date,
        data: day,
        nedn: nedn
    };
    return DataLoad.create(obj);
}

module.exports = createDayData;
