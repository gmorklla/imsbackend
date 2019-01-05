const express = require('express');
const router = express.Router();
const DataLoad = require('../db/models/dataLoadModel');

// Get dataload
router.get('/', (req, res, next) => {
    // Get queries
    const {
        formula,
        date
    } = req.query;
    const match = date.match(/^\d{4}-\d{2}-\d{2}$/);
    if (!formula || !date || !match) {
        res.status(400).json({
            status: 400,
            error: 'Bad request',
            msg: 'Required: formula and date query (format YYYY-MM-DD)'
        });
    }
    const day = new Date(date + ' 00:00:00.000');
    DataLoad.find({
            formulaName: formula,
            day: day
        }, {
            _id: 0,
            __v: 0
        })
        .then(val => res.status(200).json(val))
        .catch(error => next(error));
});

module.exports = router;
