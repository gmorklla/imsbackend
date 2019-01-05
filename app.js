const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./db/connection').connect();

const indexRouter = require('./routes/index');
const kpisRouter = require('./routes/kpis');
const fCreateRouter = require('./routes/formulaCreate');
const formulasRouter = require('./routes/formulas');
const dataloadRouter = require('./routes/dataload');
const lastdataloadRouter = require('./routes/lastdataload');

const app = express();

const pWatch = require('./utilities/changeStream');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/kpis', kpisRouter);
app.use('/formula/create', fCreateRouter);
app.use('/formulas', formulasRouter);
app.use('/dataload', dataloadRouter);
app.use('/lastdataload', lastdataloadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
