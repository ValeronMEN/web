var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

var file_functions = require('../modules/files');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/pics/drugs/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});

var image = multer({ storage: storage });

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

router.post('/newdrug', ensureAuthenticated, image.single('image'), function(req, res, next) {
  if(req.user.admin == true){
    if (null == req.file){
      req.flash('error_msg', 'Image is required');
      res.redirect('/admins/newdrug');
    }else{
      var name = req.body.name;
      var company = req.body.company;
      var volumemass = req.body.volumemass;
      var unit = req.body.unit;
      var type = req.body.type;
      var price = req.body.price;
      var symptoms = req.body.symptoms;
      var side_effects = req.body.side_effects;
      var contraindications = req.body.contraindications;
      var overdose = req.body.overdose;
      var storage_conditions = req.body.storage_conditions;
      var mode_of_application = req.body.mode_of_application;
      var properties = req.body.properties;
      var image = req.file.filename;

      req.checkBody('name', 'Name is required').notEmpty();
      req.checkBody('company', 'Company is required').notEmpty();
      req.checkBody('volumemass', "Volume or mass is required").notEmpty();
      req.checkBody('volumemass', "Volume or mass isn't a number").isInt();
      req.checkBody('unit', "Unit is required").notEmpty();
      req.checkBody('type', 'Type is required').notEmpty();
      req.checkBody('price', 'Price is required').notEmpty();
      req.checkBody('price', "Price isn't a number").isInt();
      req.checkBody('symptoms', 'Symptoms is required').notEmpty();
      req.checkBody('side_effects', 'Side effects is required').notEmpty();
      req.checkBody('contraindications', 'Contraindications is required').notEmpty();
      req.checkBody('overdose', 'Overdose is required').notEmpty();
      req.checkBody('storage_conditions', 'Storage conditions is required').notEmpty();
      req.checkBody('mode_of_application', 'Mode of application is required').notEmpty();
      req.checkBody('properties', 'Properties is required').notEmpty();

      var errors = req.validationErrors();
      if(errors){
        if (null != req.file.filename){
          var old_path = "./public/pics/drugs/" + req.file.filename;
          file_functions.deleteFile(old_path);
        }
        res.render('newdrug', {errors: errors});
      }else{
        //symptoms = symptoms.replace(/\r\n|\r|\n/g,"<br>");
        //side_effects = side_effects.replace(/\r\n|\r|\n/g,"<br>");
        //contraindications = contraindications.replace(/\r\n|\r|\n/g,"<br>");
        //mode_of_application = mode_of_application.replace(/\r\n|\r|\n/g,"<br>");
        //overdose = overdose.replace(/\r\n|\r|\n/g,"<br>");
        //storage_conditions = storage_conditions.replace(/\r\n|\r|\n/g,"<br>");
        //properties = properties.replace(/\r\n|\r|\n/g,"<br>");

        var newDrug = new Drug({
            name: name,
            company: company,
            volumemass: volumemass,
            unit: unit,
            type: type,
            price: price,
            symptoms: symptoms,
            side_effects: side_effects,
            contraindications: contraindications,
            overdose: overdose,
            storage_conditions: storage_conditions,
            mode_of_application: mode_of_application,
            properties: properties,
            image: image
        });

        Drug.addDrug(newDrug, function(err, drug){
          if(err) throw err;
          console.log(drug);
        });

        req.flash('success_msg', 'Success!');
        res.redirect('newdrug');
      }
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
