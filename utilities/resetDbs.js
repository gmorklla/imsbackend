const connection = require('../db/connection').connect();

connection
    .then(data => {
        const c1 = data.connection.db.dropCollection('dataloads');
        const c2 = data.connection.db.dropCollection('files');
        const c3 = data.connection.db.dropCollection('keys');
        const c4 = data.connection.db.dropCollection('parsers');
        const c5 = data.connection.db.dropCollection('values');
        return Promise.all([c1, c2, c3, c4, c5]);
    })
    .then(res => {
        console.log('collections deleted', res);
        process.exit();
    })
    .catch(err => console.log('Error', err));
