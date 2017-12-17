var express = require('express');
var router = express.Router();
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var path = require('path');
var multer  = require('multer');
var bcrypt = require('bcryptjs');
var fs = require('fs');

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
    res.render('profile', {
      user: req.user,
      csrfToken: req.csrfToken()
    });
});

router.post('/', ensureAuthenticated, avatar.single('avatar'), function (req, res, next) {
  if (null != req.file){
    User.getUserById(req.user.id, function(err, myuser) {
      if (err) throw err;
      myuser.avatar = req.file.filename;
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
          console.log(errors);
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
      fs.stat('./public/images/avatars/' + mynewuser.avatar, function (err, stats) {
         if (err) return console.error(err);
         fs.unlink('./public/images/avatars/' + mynewuser.avatar, function(err){
              if(err) return console.log(err);
              res.redirect('/profile');
         });
      });
    });
  });
});

router.get('/join_network', ensureAuthenticated, function(req, res, next){
    res.render('join_network', {
      csrfToken: req.csrfToken()
    });
});

router.post('/join_network', ensureAuthenticated, function (req, res, next) {
  var flatnumber = req.body.flatnumber;
  var country = req.body.country;
  var city = req.body.city;
  var district = req.body.district;
  var street = req.body.street;
  var housenumber = req.body.housenumber;

  req.checkBody('country', 'Country is required').notEmpty();
  req.checkBody('city', 'City is required').notEmpty();
  req.checkBody('district', 'District is required').notEmpty();
  req.checkBody('street', 'Street is required').notEmpty();
  req.checkBody('housenumber', 'House number is required').isDecimal();
  req.checkBody('flatnumber', 'Flat number is required').notEmpty();

  var errors = req.validationErrors();
  if(!errors){
    var user_network = new Network({
      country: country,
      city: city,
      district: district,
      street: street,
      housenumber: housenumber
    });
    Network.getNetworkByAddress(user_network, function(err, new_network){
      if (err){
        res.redirect('/profile')
      }else{
        User.getUserById(req.user._id, function(err, received_user) {
          if (err){
            res.redirect('/profile');
          }else{
            if (received_user.network !== 'underfined'){
              console.log('Not underfined');
              Network.getNetworkById(received_user.network, function(err, network){
                if (err) throw err;
                Network.removeObjectsFromNetwork('users', req.user._id, function(err, unneeded_network1){
                  Network.addUser(new_network._id, req.user._id, function(err, unneeded_network2){
                    if (err) throw err;
                    received_user.network = new_network._id;
                    res.redirect('/feed')
                  });
                });
              });
            }else{
              //
            }
          }
        });
      }
    });
  }else{
    res.redirect('/profile/join_network');
  }
});




function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/login');
  }
}

module.exports = router;
