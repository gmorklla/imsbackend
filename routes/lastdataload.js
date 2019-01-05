const express = require('express');
const router = express.Router();
const getlastdataload = require('../utilities/lastdataload');

// Get last dataload
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
    getlastdataload(formula, nedn)
        .then(last => res.status(200).json(last))
        .catch(error => next(error));
});

module.exports = router;
