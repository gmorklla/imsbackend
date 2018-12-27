const express = require('express');
const router = express.Router();
const Parser = require('../db/models/parserModel');
const {
  kpi1,
  kpi2
} = require('../utilities/kpisCal');

// IMSCSCFInitRegSuccRatio
router.get('/IMSCSCFInitRegSuccRatio', (req, res, next) => {
  // Check that time is provided
  if (!req.query.time) {
    res.status(400).json({
      status: 400,
      error: 'Bad request',
      msg: 'Required: time query (ex. 13.15)'
    });
  }
  const {
    time,
    range
  } = req.query;
  // The counters that will be searched on db
  const counters = ['cscfAcceptedRegistrations', 'cscfRegistrationsFailure'];
  // Call function to make query
  makeQuery(counters, range)
    .then(counters => {
      console.log(counters);
      const result = [];
      result.push(kpi1(counters, time));
      res.status(200).json(result);
    })
    .catch(error => next(error));
});

// Query to db
const makeQuery = (counters, range = null) => {
  let toMakeDate = range ? getDateForQuery(range) : getDateForQuery('default');
  toMakeDate += ' 00:00:00.000';
  const date = new Date(toMakeDate);
  return Parser.find({
    day: date,
    measurement: {
      $in: counters
    }
  }, {
    'values': 1,
    _id: 0,
    measurement: 1,
    moid: 1
  });
}

const getDateForQuery = (range) => {
  const today = new Date();
  let date;
  switch (range) {
    case 'today':
      date = today.toISOString().split('T')[0];
      break;
    case 'yesterday':
      today.setDate(date.getDate() - 1);
      date = today.toISOString().split('T')[0];
      break;

    default:
      const dev = new Date('2018-10-20 00:00:00.000');
      date = dev.toISOString().split('T')[0];
      break;
  }
  return date;
}

// IMSCSCFOrgSessSetupSuccRatio
router.get('/IMSCSCFOrgSessSetupSuccRatio', (req, res, next) => {
  // Check that time is provided
  if (!req.query.time) {
    res.status(400).json({
      status: 400,
      error: 'Bad request',
      msg: 'Required: time query (ex. 13.15)'
    });
  }
  const time = req.query.time;
  // The counters that will be searched on db
  const counters = ['scscfOriginatingInviteSuccessfulEstablishedNoAs', 'scscfOriginatingInviteSuccessfulEstablishedToAs', 'scscfOriginatingInviteCancelledBeforeEarlyDialog', 'scscfOriginatingInviteNoAsFailed', 'scscfOriginatingInviteToAsFailed', 'scscfOriginatingInviteNoAsAttempts', 'cscfOriginatingInviteToAsAttempts'];
  // Call function to make query
  makeQuery(counters)
    .then(counters => {
      const result = kpi2(counters, time);
      res.status(200).json(result);
    })
    .catch(error => next(error));
});

module.exports = router;
