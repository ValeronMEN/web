var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var path = require('path');
var multer  = require('multer');
var bcrypt = require('bcryptjs');

var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './public/images/avatars/')
  },
  filename: function (req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var avatar = multer({ storage: storage });

router.get('/', ensureAuthenticated, function(req, res, next){
    res.render('profile', {csrfToken: req.csrfToken()});
});

router.post('/', ensureAuthenticated, avatar.single('avatar'), function (req, res, next) {
  if (null != req.file){
    User.getUserById(req.user.id, function(err, myuser) {
      if (err) throw err;
      myuser.avatar = req.file.buffer.toString('base64'); // ?
      User.updateUser(req.user.id, myuser, {}, function(err, mynewuser){
        if(err) throw err;
        res.redirect('/profile');
      });
    });
  }
  else{
    res.redirect('/profile');
  }
});

router.post('/change_password', ensureAuthenticated, function(req, res){
  if ('' !== req.body.oldPassword && '' !== req.body.newPassword && '' !== req.body.newConfirmPassword){
    User.comparePassword(req.body.oldPassword, req.user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          req.checkBody('newConfirmPassword').equals(req.body.newPassword);
          var errors = req.validationErrors();
          if(!errors){
            User.getUserById(req.user._id, function(err, updateUser){
              if (err) throw err;
              updateUser.password = req.body.newPassword;
              bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(updateUser.password, salt, function(err, hash) {
                    updateUser.password = hash;
                    updateUser.save();
                    // req.flash('success_msg', "Password has changed");
                    res.redirect('/profile');
                });
              });
            });
          }else{
            // req.flash('error_msg', "New passwords don't match or absent");
            res.redirect('/profile');
          }
        }else{
          // req.flash('error_msg', "Old and new passwords do not match");
          res.redirect('/profile');
        }
    });
  }else{
    // req.flash('error_msg', "One or several fields are required");
    res.redirect('/profile');
  }
});

router.post('/remove_avatar', ensureAuthenticated, function (req, res, next) {
  User.getUserById(req.user._id, function(err, myuser) {
    if (err) throw err;
    myuser.avatar = "./public/pics/avatars/default.jpg";
    User.updateUser(req.user._id, myuser, {}, function(err, mynewuser){
      if(err) throw err;
      res.redirect('/profile');
    });
  });
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    // req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;
