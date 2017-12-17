var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// db modules
var mongoose = require('mongoose');
// passport modules
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require("express-validator");
var session = require("express-session");
// security
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true });

mongoose.connect('mongodb://localhost:27017/kosedo');
var db = mongoose.connection;
Network = require("./models/network");
User = require("./models/user");
Request = require("./models/request");
NotificationModel = require("./models/notification");
Answer = require("./models/answer");
Poll = require("./models/poll");
Category = require("./models/category");

var index = require('./routes/index');
var profile = require('./routes/profile');
var networks = require('./routes/networks');

var app = express();
console.log("OK, we're alive");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//passport data
app.use(session({
  secret: 'everyoneknowimvaleron',
  saveUninitialized: false, //true
  resave: false //true
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

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', csrfProtection, index);
app.use('/profile', csrfProtection, profile);
app.use('/networks', csrfProtection, networks);

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
