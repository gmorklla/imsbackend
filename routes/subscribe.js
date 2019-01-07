const express = require('express');
const router = express.Router();
const Subscribe = require('../db/models/subscribeModel');

// Get subscribe
router.get('/', (req, res, next) => {
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
