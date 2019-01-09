const express = require('express');
const router = express.Router();
const Subscribe = require('../db/models/subscribeModel');

router.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type, responseType, Content-Disposition");
    next();
});

// Get subscribe
router.get('/', (req, res, next) => {
    console.log('subs route', req.query);
    // Get queries
    const {
        formula,
        nedn
    } = req.query;
    if (!formula || !nedn) {
        res.status(400).json({
            status: 400,
            error: 'Bad request',
            msg: 'Required: formula and nedn'
        });
    }
    Subscribe.create({
            name: formula,
            nedn: nedn
        })
        .then(val => res.status(200).json(val))
        .catch(error => next(error));
});

module.exports = router;
