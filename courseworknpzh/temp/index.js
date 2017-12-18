var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
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
// flash
var flash = require("flash");

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
var dashboard = require('./routes/dashboard');
const engine = require('ejs-mate');
const app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
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

app.use(flash());
app.use(function (req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.use('/', csrfProtection, index);
app.use('/profile', csrfProtection, profile);
app.use('/dashboard', csrfProtection, dashboard);

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
  res.send(err.message);
});

//static folder

app.listen(3000, function(){
  console.log("server on 3000");
});
module.exports = app;
