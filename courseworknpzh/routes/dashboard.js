var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var shortId = require('short-mongo-id');
var multer  = require('multer');
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

router.get('/', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Network.getNetworks(function(err, networks){
      if (err) throw err;
      res.render('panel/dashboard', {
        networks: networks,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/");
  }
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

router.get('/create_network', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    res.render('create_network', {
      csrfToken: req.csrfToken()
    });
  }else{
    res.redirect("/");
  }
});

router.post('/create_network', ensureAuthenticated, function(req, res, next){
    if (req.user.admin == 1){
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

      var errors = req.validationErrors();
      if(!errors){
        var newNetwork = new Network({
          country: country,
          city: city,
          district: district,
          street: street,
          housenumber: housenumber
        });

        Network.createNetwork(newNetwork, function(err, network){
          if(err) throw err;
          Network.addAdmin(network._id, req.user.username, function(err, old_network){
            if(err) throw err;
            network.password = shortId(network._id);
            network.save();
            res.redirect('/dashboard/networks');
          });
        });
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('/');
    }
  });

router.get('/network/:_id', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Network.getAllNetworkObjectsById(req.params._id, function(err, network){
      if (err) throw err;
      res.render('panel/network', {
        network: network,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/");
  }
});

router.get('/networks', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Network.getNetworks(function(err, networks){
      if (err) throw err;
      res.render('panel/networkList', {
        networks: networks,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.post('/networks', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Network.deleteNetwork(req.body.id, function(err, order){
      if (err) throw err;
      res.redirect("/networks");
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.get('/networks/streets_and_numbers/:_street/:_number', ensureAuthenticated, function(req, res, next) {
  // console.log(req.params._street + req.params._number);
  if(req.user.admin == 1){
    Network.getRequestByStreetAndHousenumber(req.params._street, req.params._number, function(err, networks){
      res.render('panel/networkList', {
        networks: networks,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/dashboard");
  }
});

// render unknown
router.get('/create_category', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    res.render('create_category', {
      csrfToken: req.csrfToken()
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.post('/create_category', ensureAuthenticated, function(req, res, next){
    if (req.user.admin == 1){
      var name = req.body.category_name;
      req.checkBody('category_name', 'Name is required').notEmpty();

      var errors = req.validationErrors();
      if(!errors){
        var newCategory = new Category({
          name: name
        });

        Category.createCategory(newCategory, function(err, category){
          if(err) throw err;
          res.redirect('/dashboard/categories');
        });
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('/');
    }
  });

// render unknown
router.get('/categories', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Category.getCategories(function(err, categories){
      res.render('categories', {
        categories: categories,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/dashboard");
  }
});

// render unknown
router.post('/categories', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Category.deleteCategory(req.body.id, function(err, category){
      if (err) throw err;
      res.redirect("/dashboard/categories");
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.get('/requests', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Request.getRequests(function(err, requests){
      Category.getCategories(function(err, categories){
        res.render('requests_admin', {
          requests: requests,
          categories: categories,
          csrfToken: req.csrfToken()
        });
      });
    });
  }else{
    res.redirect("/dashboard");
  }
});

// render unknown
router.post('/requests', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Request.deleteRequest(req.body.id, function(err, request){
      if (err) throw err;
      res.redirect("/dashboard/requests");
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.get('/requests/categories/:_category', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Request.getRequestsByCategory(req.params._category, function(err, requests){
      Category.getCategories(function(err, categories){
        res.render('requests_admin', {
          requests: requests,
          categories: categories,
          csrfToken: req.csrfToken()
        });
      });
    });
  }else{
    res.redirect("/dashboard");
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
                      res.redirect('/dashboard');
                });
              });
            });
          }else{
            // req.flash('error_msg', "New passwords don't match or absent");
              res.redirect('/dashboard');
          }
        }else{
          // req.flash('error_msg', "Old and new passwords do not match");
            res.redirect('/dashboard');
        }
    });
  }else{
    // req.flash('error_msg', "One or several fields are required");
      res.redirect('/dashboard');
  }
});

// render unknown
router.get('/notifications', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    NotificationModel.getNotifications(function(err, notifications){
      if (err) throw err;
      res.render('notifications', {
        notifications: notifications,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.post('/notifications', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    NotificationModel.deleteNotification(req.body.id, function(err, notification){
      if (err) throw err;
      res.redirect("/notifications");
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.get('/create_notification', ensureAuthenticated, function(req, res, next){
  res.render('create_notification', {
    csrfToken: req.csrfToken()
  });
});

// render unknown
router.post('/create_notification', ensureAuthenticated, function(req, res, next){
    if (req.user.admin == 1){
      var title = req.body.title;
      var text = req.body.text;
      var network = req.body.network;

      req.checkBody('title', 'Title is required').notEmpty();
      req.checkBody('text', 'Text is required').notEmpty();
      req.checkBody('network', 'Network is required').notEmpty();

      var errors = req.validationErrors();
      if(!errors){
        Network.getNetworkById(network, function(err, networkObj){
          if (!err){
            var newNotification = new NotificationModel({
              title: title,
              text: text,
              author: req.user._id,
              network: networkObj._id
            });

            NotificationModel.createNotification(newNotification, function(err, notification){
              if(err) throw err;
              Network.addNotification(networkObj._id, notification, function(err, old_network){
                if(err) throw err;
                res.redirect('/dashboard/notifications');
              });
            });
          }else{
            res.redirect('/');
          }
        });
      }else{
        res.redirect('/');
      }
    }else{
      res.redirect('/');
    }
  });

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated() && req.user.admin == 1){
    return next();
  }
  else{
    res.redirect('/#login');
  }
}

module.exports = router;
