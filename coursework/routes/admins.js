var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;

var image = multer({ inMemory: true,
                     storage: multer.memoryStorage({}) });

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
      res.render('adminusers', {
        arr: users,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/");
  }
});

router.get('/newdrug', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    res.render('newdrug', {
      csrfToken: req.csrfToken()
    });
  }else{
    res.redirect("/");
  }
});

router.get('/orders', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    Order.getOrders(function(err, orders){
      if (err){
        throw err;
      }else{
        if (null != orders[0]){
          var arr = [];
          for(let i=0; i<orders.length; i++){
            let drugsOrderArr = [];
            User.getUserById(orders[i].owner, function(err, user){
              if (err) throw err;
              for(let j=0; j<orders[i].drugs.length; j++){
                Drug.getDrugById(orders[i].drugs[j], function(err, drug){
                  if (null != drug){
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
                    if (null == user){
                      var owner_firstname = "Unknown";
                      var owner_lastname = "Unknown";
                      var owner_email = "Unknown";
                    }else{
                      var owner_firstname = user.firstname;
                      var owner_lastname = user.lastname;
                      var owner_email = user.email;
                    }
                    arr.push({
                      drugs: drugsOrderArr,
                      owner_firstname: owner_firstname,
                      owner_lastname: owner_lastname,
                      owner_email: owner_email,
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
                      res.render('adminorders', {
                        arr: sortarr,
                        bills: "UAH",
                        csrfToken: req.csrfToken()
                      });
                    }
                  }
                });
              }
            });
          }
        }else{
          res.render('adminorders', {
            arr: [],
            bills: "UAH",
            csrfToken: req.csrfToken()
          });
        }
      }
    });
  }else{
    res.redirect("/");
  }
});

router.post('/orders/expect/:_id', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    Order.getOrderById(req.params._id, function(err, order){
      var newOrder = order;
      newOrder.status = "expect";
      Order.updateOrder(req.params._id, newOrder, {}, function(err, oldorder){
        if (err) throw err;
        res.redirect("/admins/orders");
      });
    });
  }else{
    res.redirect("/");
  }
});

router.post('/orders/completed/:_id', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    Order.getOrderById(req.params._id, function(err, order){
      var newOrder = order;
      newOrder.status = "completed";
      Order.updateOrder(req.params._id, newOrder, {}, function(err, oldorder){
        if (err) throw err;
        res.redirect("/admins/orders");
      });
    });
  }else{
    res.redirect("/");
  }
});

router.post('/orders/canceled/:_id', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    Order.getOrderById(req.params._id, function(err, order){
      var newOrder = order;
      newOrder.status = "canceled";
      Order.updateOrder(req.params._id, newOrder, {}, function(err, oldorder){
        if (err) throw err;
        res.redirect("/admins/orders");
      });
    });
  }else{
    res.redirect("/");
  }
});

router.post('/orders/delete/:_id', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    Order.deleteOrder(req.params._id, function(err, order){
      if (err) throw err;
      res.redirect("/admins/orders");
    });
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
      var image = req.file.buffer.toString('base64');

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
        res.render('newdrug', {errors: errors});
      }else{
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
