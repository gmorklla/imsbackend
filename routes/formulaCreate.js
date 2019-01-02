const express = require('express');
const router = express.Router();
const Formula = require('../db/models/formulaModel');

// Create formula
router.get('/', (req, res, next) => {
    // Get queries
    const {
        name,
        counters,
        formula
    } = req.query;
    // Check that time is provided
    if (!name || !counters || !formula) {
        res.status(400).json({
            status: 400,
            error: 'Bad request',
            msg: 'Required: name, counters and formula'
        });
    }
    // Call function to make query
    createFormula(name, counters, formula)
        .then(val => {
            val ?
                res.status(201).json({
                    formula: val
                }) :
                res.status(409).json({
                    status: 409,
                    error: 'Conflict',
                    msg: 'There is already a formula with that name on the db'
                });
        })
        .catch(error => next(error));
});

async function createFormula(name, counters, formula) {
    try {
        const inDb = await findInDb(name);
        if (inDb) {
            return false;
        } else {
            return await create(name, counters, formula);
        }
    } catch (error) {
        console.log('Error on createFormula', error);
        throw error;
    }
}

// Find formula to avoid overwrite
const findInDb = (name) => {
    return Formula.findOne({
        name: name
    }, {
        _id: 1
    });
}

// Query to db
const create = (name, counters, formula) => {
    return Formula.create({
        name: name,
        counters: counters,
        formula: formula
    });
}

module.exports = router;
