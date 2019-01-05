const DataLoad = require('../db/models/dataLoadModel');

function getlastdataload(formula, nedn) {
    return DataLoad.find({
            formulaName: formula,
            nedn: nedn
        }, {
            _id: 0,
            __v: 0
        }, {
            sort: {
                day: -1
            },
            limit: 5
        })
        .then(data => filterValues(data, nedn))
        .then(last => last)
        .catch(error => next(error));
}

function getChecks(arr) {
    let check = 0;
    arr.forEach(val => {
        if (val.check) {
            check++;
        }
    });
    return check;
}

function filterValues(data, nedn) {
    return new Promise((resolve, reject) => {
        let last = {
            day: null,
            time: null,
            counters: null,
            checked: null
        };
        for (let i = 0; i < data.length; i++) {
            const steps = Object.keys(data[i].data);
            steps.forEach(step => {
                const l = data[i].data[step].length;
                const check = getChecks(data[i].data[step]);
                if (check > 0) {
                    last.day = data[i].day;
                    last.time = step;
                    last.counters = l;
                    last.checked = check;
                }
            });
            if (last.day) {
                resolve(last);
                break;
            }
        }
        reject('No data was found for ' + nedn);
    });
}

module.exports = getlastdataload;
