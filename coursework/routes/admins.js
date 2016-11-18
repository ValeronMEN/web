var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

router.get('/', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    res.render('admin');
  }else{
    res.redirect("/");
  }
});

router.get('/users', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    User.getUsers(function(err, users){
      if (err){
        throw err;
      }
      console.log(users);
      res.render('adminusers', {arr: users});
    });
  }else{
    res.redirect("/");
  }
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;
