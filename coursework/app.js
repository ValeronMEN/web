var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var mongo = require("mongodb");
var session = require("express-session");

mongoose.connect('mongodb://localhost/medicine');
var db = mongoose.connection;
Drug = require("./models/drug");
User = require("./models/user");
Order = require("./models/order");

var admins = require('./routes/admins');
var index = require('./routes/index');
var api = require('./routes/api');
var users = require('./routes/users');
var drugs = require('./routes/drugs');
var search = require('./routes/search');
var basket = require('./routes/basket');

var app = express();

console.log("OK, we're alive now");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//passport data
app.use(session({
  secret: 'everyoneknowimvaleron',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use(function (req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/basket', basket);
app.use('/search', search);
app.use('/admins', admins);
app.use('/api', api);
app.use('/users', users);
app.use('/drugs', drugs);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
