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
  Request.getRequests(function(err, requests){
    Category.getCategories(function(err, categories){
      NotificationModel.getNotifications(function(err, notifications){
        res.render('panel/dashboard', {
          requests: requests,
          categories: categories,
          notifications : notifications,
          csrfToken: req.csrfToken()
        });
      });
    });
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
      console.log(network);
      // panel/network
      res.render('panel/network', {
        network: network,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/");
  }
});
router.get('/requests/:_id', ensureAuthenticated, function(req, res, next) {
   if(req.user.admin == 1){
     Request.getRequestById(req.params._id, function(err, request){
      if (err) throw err;
       console.log("Request: "+request);
       // panel/request
       res.render('panel/request', {
        request: request,
         csrfToken: req.csrfToken()
       });
     });
   }else{
    res.redirect("/");
  }
 });
 router.get('/notifications/:_id', ensureAuthenticated, function(req, res, next) {
   if(req.user.admin == 1){
     NotificationModel.getNotificationById(req.params._id, function(err, notification){
      if (err) throw err;
       console.log(notification);
       // panel/notification
       res.render('panel/notification', {
         notification: notification,
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

// was not tested
// render unknown
router.post('/networks', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Network.deleteNetwork(req.body.id, function(err, network){
      if (err) throw err;
      User.removeNetworkFromUsers(req.body.id, function(err, blank1){
        if (err) throw err;
        NotificationModel.removeNetworkFromNotifications(req.body.id, function(err, blank2){
          if (err) throw err;
          res.redirect("/networks");
        });
      });
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.get('/networks/streets_and_numbers/:_street/:_number', ensureAuthenticated, function(req, res, next) {
  console.log(req.params._street + req.params._number);
  if(req.user.admin == 1){
    Network.getNetworkByStreetAndHousenumber(req.params._street, req.params._number, function(err, networks){
      if (err) throw err;
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
      var resource = req.body.category_resource;
      req.checkBody('category_name', 'Name is required').notEmpty();
      req.checkBody('category_resource', 'Resource is required').notEmpty();
      var errors = req.validationErrors();
      if(!errors){
        var newCategory = new Category({
          name: name,
          resource: resource
        });
        Category.createCategory(newCategory, function(err, category){
          if(err) throw err;
          res.redirect('/dashboard/categories');
        });
      }else{
        res.render('error',{err:errors});
      }
    }else{
      res.redirect('/');
    }
  });

// render unknown
router.get('/categories', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Category.getCategories(function(err, categories){
      res.render('panel/categories', {
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


// render unknown
router.post('/requests', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Request.deleteRequest(req.body.id, function(err, request){
      if (err) throw err;
      Network.removeRequestFromNetwork(req.body.id, function(err, blank){
        if (err) throw err;
        res.redirect("/dashboard/requests");
      });
    });
  }else{
    res.redirect("/");
  }
});
router.get('/requests', ensureAuthenticated, function(req, res, next) {
    Request.getRequests(function(err, requests){
      console.log(requests);
      Category.getCategories(function(err, categories){
        res.render('panel/requests', {
          requests: requests,
          categories: categories,
          csrfToken: req.csrfToken()
        });
      });
    });
});

// render unknown
router.get('/requests/categories/:_category', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Request.getRequestsByCategory(req.params._category, function(err, requests){
      if (err) throw err;
      Category.getCategories(function(err, categories){
        if (err) throw err;
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
      res.render('panel/notifications', {
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
      Network.removeNotificationFromNetwork(req.body.id, function(err, blank){
        if (err) throw err;
        res.redirect("/dashboard/notifications");
      });
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
        Network.getNetworkByPassword(network, function(err, networkObj){
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
