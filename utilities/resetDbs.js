const connection = require('../db/connection').connect();

connection
    .then(data => {
        const c1 = data.connection.db.dropCollection('dataloads').catch(err => `dataloads ${err.errmsg}`);
        const c2 = data.connection.db.dropCollection('files').catch(err => `files ${err.errmsg}`);
        const c3 = data.connection.db.dropCollection('keys').catch(err => `keys ${err.errmsg}`);
        const c4 = data.connection.db.dropCollection('parsers').catch(err => `parsers ${err.errmsg}`);
        const c5 = data.connection.db.dropCollection('values').catch(err => `values ${err.errmsg}`);
        return Promise.all([c1, c2, c3, c4, c5]);
    })
    .then(res => {
        console.log('collections deleted', res);
        process.exit();
    });
