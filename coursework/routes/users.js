var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var path = require('path');
var multer  = require('multer');
var bcrypt = require('bcryptjs');

/*
var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './public/pics/avatars/')
  },
  filename: function (req, file, cb){
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var avatar = multer({ storage: storage });
*/
var avatar = multer({ inMemory: true,
                     storage: multer.memoryStorage({}) });

router.get('/register', function(req, res, next) {
  if (null == req.user){
    res.render('signup', {csrfToken: req.csrfToken()});
  }
  else{
    res.redirect("/");
  }
});

router.get('/login', function(req, res, next){
  if (null == req.user){
    res.render('login', {csrfToken: req.csrfToken()});
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
          res.render('signup', {
            errors: errors,
            csrfToken: req.csrfToken()
          });
        }else{
          var newUser = new User({
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            sex: sex
          });

          User.createUser(newUser, function(err, user){
            if(err){
              throw err;
            }else{
              console.log(user);
              req.flash('success_msg', 'You are registred and now can log in');
              res.redirect('login');
            }
          });
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
        if(err){
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

router.get('/profile', ensureAuthenticated, function(req, res, next){
    res.render('user', {
      csrfToken: req.csrfToken()
    });
});

router.get('/profile/orders', ensureAuthenticated, function(req, res, next){
  Order.getOrdersByOwnerId(req.user._id, function(err, orders){
    if (err){
      throw err;
    }else{
      if (0 != orders.length){
        var arr = [];
        for(let i=0; i<orders.length; i++){
          let drugsOrderArr = [];
          for(let j=0; j<orders[i].drugs.length; j++){
            Drug.getDrugById(orders[i].drugs[j], function(err, drug){
              if (err) throw err;
              if(null != drug){
                drugsOrderArr.push({
                  name: drug.name,
                  volumemass: drug.volumemass,
                  unit: drug.unit,
                  type: drug.type,
                  price: drug.price,
                  size: orders[i].sizes[j]
                });
              }else{
                drugsOrderArr.push({
                  name: "Unknown",
                  volumemass: 0,
                  unit: "Unknown",
                  type: "Unknown",
                  price: 0,
                  size: orders[i].sizes[j]
                });
              }
              if (drugsOrderArr.length == orders[i].drugs.length){
                arr.push({
                  drugs: drugsOrderArr,
                  owner_firstname: req.user.firstname,
                  owner_lastname: req.user.lastname,
                  owner_email: req.user.email,
                  status: orders[i].status,
                  date: orders[i].creation_date,
                  address: orders[i].address,
                  phonenumber: orders[i].phonenumber,
                  price: orders[i].price,
                  id: orders[i]._id
                });
                if (arr.length == orders.length){
                  var sortarr = arr.sort(function compareNumeric(a, b) {
                     return a.status.localeCompare(b.status);
                  });
                  console.log(arr);
                  res.render('orders', {
                    arr: sortarr,
                    bills: "UAH"
                  });
                }
              }
            });
          }
        }
      }else{
        res.render('orders', {
          arr: [],
          bills: "UAH"
        });
      }
    }
  });
});

router.post('/profile/removeavatar', ensureAuthenticated, function (req, res, next) {
  User.getUserById(req.user._id, function(err, myuser) {
    if (err) throw err;
    myuser.avatar = "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";
    User.updateUser(req.user._id, myuser, {}, function(err, mynewuser){
      if(err) throw err;
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
      myuser.avatar = req.file.buffer.toString('base64');
      console.log(myuser);
      User.updateUser(req.user.id, myuser, {}, function(err, mynewuser){
        if(err) throw err;
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
