var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

router.get('/', function(req, res, next) {
  res.render('home/index', { csrfToken: req.csrfToken() });
});

router.get('/login/panel',function(req,res){
  if(req.user.admin == 0){
    res.redirect("/profile");
  }else if(req.user.admin == 1){
    res.redirect("/dashboard");
  }
});

router.get('/login', function(req, res, next){
  if (null == req.user){
    res.render('login', {
      csrfToken: req.csrfToken()
    });
  }
  else{
    res.redirect("/");
  }
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/login/panel', failureRedirect:'/#login'}), // , failureFlash: true
  function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/register', function(req, res, next) {
  if (null == req.user){
    res.render('register', { csrfToken: req.csrfToken() });
  }
  else{
    if(req.user.admin == 0)
        res.redirect("/profile");
    res.redirect("/dashboard")
  }
});

router.post('/register', function(req, res){
    var username = req.body.username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var phonenumber = req.body.phonenumber;
    var patronymic = req.body.patronymic;

    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.checkBody('phonenumber', 'Phone number is required').notEmpty()
    req.checkBody('patronymic', 'Patronymic is required').notEmpty()
    // .isMobilePhone('uk-UA');

    User.getUserByUsername(username, function(err, user){
      if (null == user){
        var errors = req.validationErrors();

        if(errors){
          res.render('register', {
            errors: errors,
            csrfToken: req.csrfToken()
          });
        }else{
          var newUser = new User({
            username: username,
            firstname: firstname,
            lastname: lastname,
            patronymic: patronymic,
            email: email,
            password: password,
            phonenumber: phonenumber
          });

          User.createUser(newUser, function(err, user){
            if(err){
              throw err;
            }else{
              console.log(user);
              // req.flash('success_msg', 'You are registred and now can log in');
              res.redirect('/#login');
            }
          });
        }
    }else{
      // req.flash('error_msg', "Username is busy");
      res.redirect('/#register');
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
          }else{
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

module.exports = router;
