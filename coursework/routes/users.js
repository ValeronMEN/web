var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var path = require('path');
var multer  = require('multer');
var bcrypt = require('bcryptjs');

var file_functions = require('../modules/files');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/pics/avatars/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var avatar = multer({ storage: storage });

router.get('/register', function(req, res, next) {
  if (null == req.user){
    res.render('signup');
  }
  else{
    res.redirect("/");
  }
});

router.get('/login', function(req, res, next){
  if (null == req.user){
    res.render('login');
  }
  else{
    res.redirect("/");
  }
});

router.post('/register', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var sex = req.body.sex;

    var admin = false;
    var avatar = "default.png";

    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    User.getUserByUsername(username, function(err, user){
      if (null == user){
        var errors = req.validationErrors();

        if(errors){
          res.render('signup', {errors: errors});
        }else{
          var newUser = new User({
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            sex: sex,
            admin: admin,
            avatar: avatar
          });

          User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
          });

          req.flash('success_msg', 'You are registred and now can log in');
          res.redirect('login');
      }
    }else{
      req.flash('error_msg', "Username is busy");
      res.redirect('register');
    };
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
      if (err) throw err;
      if(!user){
        return done(null, false, {message: 'Unknown user'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            return done(null, user);
          } else{
            return done(null, false, {message: 'Invalid password'});
          }
      });
    });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.post('/profile/changepassword', ensureAuthenticated, function(req, res){
  if ('' !== req.body.oldPassword && '' !== req.body.newPassword && '' !== req.body.newConfirmPassword){
    User.comparePassword(req.body.oldPassword, req.user.password, function(err, isMatch){
        if(err) {
          throw err;
        }
        if(isMatch){
          req.checkBody('newConfirmPassword').equals(req.body.newPassword);
          var errors = req.validationErrors();
          if(errors){
            req.flash('error_msg', "New passwords don't match or absent");
            res.redirect('/users/profile');
          }else{
            User.getUserById(req.user._id, function(err, updateUser){
              if (err) throw err;
              updateUser.password = req.body.newPassword;
              bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(updateUser.password, salt, function(err, hash) {
                    updateUser.password = hash;
                    updateUser.save();
                    req.flash('success_msg', "Password has changed");
                    res.redirect('/users/profile');
                });
              });
            });
          }
        }else{
          req.flash('error_msg', "Old and new passwords do not match");
          res.redirect('/users/profile');
        }
    });
  }else{
    req.flash('error_msg', "One or several fields are required");
    res.redirect('/users/profile');
  }
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
    res.render('user');
});

router.post('/profile/removeavatar', ensureAuthenticated, function (req, res, next) {
  User.getUserById(req.user._id, function(err, myuser) {
    if (err) throw err;
    var old_avatar = myuser.avatar;
    myuser.avatar = "default.png";
    User.updateUser(req.user._id, myuser, {}, function(err, mynewuser){
      if(err) throw err;
      if (old_avatar != "default.png"){
        var old_path = "./public/pics/avatars/" + old_avatar;
        file_functions.deleteFile(old_path);
      }
      res.redirect('/users/profile');
    });
  });
});

router.post('/profile', ensureAuthenticated, avatar.single('avatar'), function (req, res, next) {
  if (null == req.file){
    res.redirect('/users/profile');
  }
  else{
    User.getUserById(req.user.id, function(err, myuser) {
      if (err) throw err;
      var old_avatar = myuser.avatar;
      myuser.avatar = req.file.filename;
      User.updateUser(req.user.id, myuser, {}, function(err, mynewuser){
        if(err) throw err;
        if (old_avatar != "default.png"){
          var old_path = "./public/pics/avatars/" + old_avatar;
          file_functions.deleteFile(old_path);
        }
        res.redirect('/users/profile');
      });
    });
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
