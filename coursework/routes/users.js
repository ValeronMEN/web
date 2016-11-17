var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var multer  = require('multer');
var avatars = multer({ dest: 'public/pics/avatars/' })

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
    //console.log("User sent: firstname: "+firstname+"; lastname: "+lastname+"; email: "+email+"; username: "+username+"; password1: "+password+"; password2: "+confirmPassword+"; sex: "+sex);
    var admin = false;

    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

    User.getUserByUsername(username, function(err, user){
      if (null == user){
        //console.log("Error");
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
            admin: admin
          });

          User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
          });

          req.flash('success_msg', 'You are registred and now can log in');
          res.redirect('login');
      }
    }else{
      //console.log("Not Error");
      res.redirect('register');
    };
  });
});


//passport functions (start)
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
//passport functions (end)

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
    console.log("OK, somebody was connected");
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
    res.render('user');
});

router.post('/profile', ensureAuthenticated, avatars.single('avatar'), function (req, res, next) {
    res.redirect('/users/profile');
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
