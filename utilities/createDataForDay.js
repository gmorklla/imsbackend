const DataLoad = require('../db/models/dataLoadModel');

function createDayData() {
    const steps = ['0', '15', '30', '45'];
    const day = [];
    for (let i = 0; i < 24; i++) {
        steps.forEach(val => {
            const step = `${String(i)}.${val}`;
            day.push(step);
        });
    }
    console.log(day);
}

createDayData();
