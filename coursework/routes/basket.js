var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

router.get('/', function(req, res, next){
  if (typeof req.cookies.drug == 'undefined' || req.cookies.drug == ""){
    res.render('basket', {arr: null});
  }else{
    var arr = req.cookies.drug.split(",");
    var drugs = [];
    var price = 0;
    for (let i=0; i<arr.length-1; i++){
      Drug.getDrugById(arr[i].substring(0, arr[i].indexOf("$")), function(err, drug){
        if (err || null == drug || typeof drug == 'undefined'){
          res.render('error');
        }else{
          let size = parseInt(arr[i].substring(arr[i].indexOf("$")+1));
          drugs.push({
            id: drug._id,
            name: drug.name,
            volumemass: drug.volumemass,
            unit: drug.unit,
            type: drug.type,
            price: drug.price,
            image: "/pics/drugs/"+drug.image,
            amount: size
          });
          price += (drug.price * size);
          if (drugs.length == arr.length-1){
            var sortdrugs = drugs.sort(function compareNumeric(a, b) {
               return a.name.localeCompare(b.name);
            })
            res.render('basket', {
              price: price,
              arr: sortdrugs,
              bills: "UAH"
            });
          }
        }
      });
    }
  }
});

router.get('/authentication', function(req, res, next){
  res.render("authentication");
});

router.get('/confirm', ensureAuthenticated, function(req, res, next){
  if (typeof req.cookies.drug == 'undefined' || req.cookies.drug == "" || null == req.cookies.drug){
    res.redirect("/");
  }else{
    var arr = req.cookies.drug.split(",");
    var drugs = [];
    var price = 0;
    for (let i=0; i<arr.length-1; i++){
      Drug.getDrugById(arr[i].substring(0, arr[i].indexOf("$")), function(err, drug){
        if (err || null == drug || typeof drug == 'undefined'){
          res.redirect("/");
        }else{
          let size = parseInt(arr[i].substring(arr[i].indexOf("$")+1));
          drugs.push({
            id: drug._id,
            name: drug.name,
            volumemass: drug.volumemass,
            unit: drug.unit,
            type: drug.type,
            price: drug.price,
            amount: size
          });
          price += (drug.price * size);
          if (drugs.length == arr.length-1){
            var sortdrugs = drugs.sort(function compareNumeric(a, b) {
               return a.name.localeCompare(b.name);
            })
            res.render('confirm', {
              price: price,
              arr: sortdrugs,
              bills: "UAH"
            });
          }
        }
      });
    }
  }
});

router.post('/confirm', ensureAuthenticated, function(req, res, next){
  var phonenumber = req.body.phonenumber;
  var address = req.body.address;

  req.checkBody('phonenumber', 'Phone number is required').notEmpty();
  req.checkBody('address', 'Address is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('confirm', {errors: errors});
  }else{
    if (typeof req.cookies.drug == 'undefined' || req.cookies.drug == "" || null == req.cookies.drug){
      res.redirect("/");
    }else{
      var arr = req.cookies.drug.split(",");
      var drugs = [];
      var price = 0;
      for (let i=0; i<arr.length-1; i++){
        Drug.getDrugById(arr[i].substring(0, arr[i].indexOf("$")), function(err, drug){
          if (err || null == drug || typeof drug == 'undefined'){
            res.redirect("/");
          }else{
            let size = parseInt(arr[i].substring(arr[i].indexOf("$")+1));
            drugs.push(drug._id);
            price += (drug.price * size);
            if (drugs.length == arr.length-1){
              var newOrder = new User({
                owner: user._id,
                price: price,
                drugs: drugs
              });
              Order.addOrder(newOrder, function(err, order){
                if(err){
                  throw err;
                }else{
                  res.redirect("/");
                }
              });
            }
          }
        });
      }
    }
  }
});

router.post('/register', function(req, res){
    req.body.password = req.body.passwordReg;
    req.body.username = req.body.usernameReg;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var username = req.body.usernameReg;
    var password = req.body.passwordReg;
    var confirmPassword = req.body.confirmPassword;
    var sex = req.body.sex;

    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();
    req.checkBody('usernameReg', 'Username is required').notEmpty();
    req.checkBody('passwordReg', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.passwordReg);

    User.getUserByUsername(username, function(err, user){
      if (null == user){
        var errors = req.validationErrors();

        if(errors){
          res.render('authentication', {errors: errors});
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
              req.login(user, function (err) {
                if ( ! err ){
                    res.redirect('/basket/confirm');
                } else {
                    res.render('error');
                }
              });
            }
          });
      }
    }else{
      req.flash('error_msg', "Username is busy");
      res.redirect('/basket/authentication');
    };
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/basket/confirm', failureRedirect:'/basket/authentication', failureFlash: true}),
  function(req, res) {
    res.redirect('/');
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
