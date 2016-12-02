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

router.get('/newdrug', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    res.render('newdrug');
  }else{
    res.redirect("/");
  }
});

router.post('/newdrug', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    console.log(req.body);
    var name = req.body.name;
    var company = req.body.company;
    var volume = req.body.volume;
    var type_of_volume = req.body.type_of_volume;
    var price = req.body.price;

    var symptoms = req.body.symptoms;
    var side_effects = req.body.side_effects;
    var contraindications = req.body.contraindications;
    var overdose = req.body.overdose;
    var storage_conditions = req.body.storage_conditions;
    var mode_of_application = req.body.mode_of_application;
    var properties = req.body.properties;

    //var file = req.body.image;

    /*
    if (req.file == null){
      console.log("File is null");
    }
    if (req.files == null){
      console.log("Files is null");
    }
    console.log(req.body.file);
    console.log(req.body.image);
    */

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('company', 'Company is required').notEmpty();
    req.checkBody('volume', 'Volume is required').notEmpty();
    req.checkBody('type_of_volume', 'Type of volume is required').notEmpty();
    req.checkBody('price', 'Price is required').notEmpty();

    req.checkBody('symptoms', 'Symptoms is required').notEmpty();
    req.checkBody('side_effects', 'Side effects is required').notEmpty();
    req.checkBody('contraindications', 'Contraindications is required').notEmpty();
    req.checkBody('overdose', 'Overdose is required').notEmpty();
    req.checkBody('storage_conditions', 'Storage conditions is required').notEmpty();
    req.checkBody('mode_of_application', 'Mode of application is required').notEmpty();
    req.checkBody('properties', 'Properties is required').notEmpty();

    req.checkFiles('image', 'Image is required').notEmpty();

    var errors = req.validationErrors();
    if(errors){
      res.render('newdrug', {errors: errors});
    }else{
      res.render('newdrug');
    }
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
