const express = require('express');
const router = express.Router();
const Formula = require('../db/models/formulaModel');

// Create formula
router.get('/', (req, res, next) => {
    Formula.find({})
        .then(val => res.status(200).json(val))
        .catch(error => next(error));
});

module.exports = router;
