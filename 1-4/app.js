var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var exercise1 = require('./routes/exercise1');
var parse = require('./routes/parse');
var exercise2 = require('./routes/exercise2');
var exercise3 = require('./routes/exercise3');
var exercise4 = require('./routes/exercise4');
var exercise5 = require('./routes/exercise5');
var exercise6 = require('./routes/exercise6');
var exercise7 = require('./routes/exercise7');
var exercise8 = require('./routes/exercise8');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/zadanie1', exercise1);
app.use('/parse', parse);
app.use('/zadanie2', exercise2);
app.use('/zadanie3', exercise3);
app.use('/zadanie4', exercise4);
app.use('/zadanie5', exercise5);
app.use('/zadanie6', exercise6);
app.use('/zadanie7', exercise7);
app.use('/zadanie8', exercise8);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
