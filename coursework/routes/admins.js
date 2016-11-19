var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

var file_functions = require('../modules/files');

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

router.post('/users/deleteuser/:_id', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    User.getUserById(req.params._id, function(err, userToDelete){
      if (err){
        res.render('error');
      }
      else{
        if (userToDelete.admin == true){
          res.render('error');
        }
        else{
          User.deleteUser(userToDelete._id, function(err, removingUser){
            if (userToDelete.avatar != "default.png"){
              var old_path = "./public/pics/avatars/" + userToDelete.avatar;
              file_functions.deleteFile(old_path);
            }
            res.redirect("/admins/users");
          });
        }
      }
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
