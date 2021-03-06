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
  Request.getRequestByAuthor(req.user._id, function(err, requests){
    NotificationModel.getNotificationsByNetwork(req.user.network, function(err, notifications){
      Category.getCategories(function(err, categories){
        res.render('profile/dashboard', {
          requests: requests,
          notifications : notifications,
          categories : categories,
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

// render unknown
router.get('/requests', ensureAuthenticated, function(req, res, next){
  Request.getRequestByAuthor(req.user._id, function(err, requests){
      Category.getCategories(function(err, categories){
        res.render('profile/requestList', {
          requests: requests,
          categories:categories,
          csrfToken: req.csrfToken()
        });
      });
  });
});

// render unknown
router.post('/requests', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 0){
    Request.deleteRequest(req.body.id, function(err, request){
      if (err) throw err;
      Network.removeRequestFromNetwork(req.body.id, function(err, blank){
        if (err) throw err;
        res.redirect("/profile/requests");
      });
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.get('/notifications', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 0){
    NotificationModel.getNotificationsByNetwork(req.user.network, function(err, notifications){
        Category.getCategories(function(err, categories){
          if (err) throw err;
          res.render('profile/notifications', {
            notifications: notifications,
            categories : categories,
            csrfToken: req.csrfToken()
          });
        });
    });
  }else{
    res.redirect("/");
  }
});

// render unknown
router.get('/create_request', ensureAuthenticated, function(req, res, next){
  Category.getCategories(function(err, categories){
    if(!err && categories != null){
      User.getUserById(req.user._id, function(err, user){
        if(err) throw err;
        Network.getNetworkById(user.network, function(err, network){
         if(err) throw err;
         res.render('profile/createRequest', {
            companyName: 'Відділ державної виконвчої служби Соломянського районного управління юстиції у м. Києві',
            categories: categories,
            user: user,
            network: network,
            csrfToken: req.csrfToken()
         });
        });
      });
    }else{
      res.redirect('/profile/select_category');
    }
  });
});
router.get('/select_category', ensureAuthenticated, function(req, res, next){
   Category.getCategories(function(err, categories){
     res.render('select_category', {
       categories: categories,
       csrfToken: req.csrfToken()
     });
   });
 });
 router.post('/select_category', ensureAuthenticated, function(req, res, next){
   var category = req.body.category;
   req.checkBody('category', 'Category is required').notEmpty();

   var errors = req.validationErrors();
   console.log('Errors: ' + errors);
   if(!errors){

   }else{
     res.redirect('/');
   }
 });
// render unknown
router.post('/create_request', ensureAuthenticated, function(req, res, next){
    if (req.user.network != null){
      var title = req.body.title;
      var text = req.body.text;
      var category = req.body.category;
      var place = req.body.place;
      var subject = req.body.subject;
      var description = req.body.description;
      var up = req.body.up;
      var down = req.body.down;


      text = up + place+", " + subject +", " + description +", " + down;
      req.checkBody('title', 'Title is required').notEmpty();
      req.checkBody('category', 'Category is required').notEmpty();
      var errors = req.validationErrors();
      console.log(errors);
      if(!errors){
        var newRequest = new Request({
          title: title,
          text: text,
          category: category,
          author: req.user._id
        });
        console.log(newRequest);

        Request.createRequest(newRequest, function(err, request){
          if(err) throw err;
          Network.addRequest(req.user.network, request, function(err, old_network){
            if(err) throw err;
            res.redirect('/profile/requests');
          });
        });
      }else{
        res.render('error',{err:errors});
      }
    }else{
        res.render('error',{err:errors});
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
  var password = req.body.password;

  req.checkBody('flatnumber', 'Flat number is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();
  if(!errors){
    Network.getNetworkByPassword(password, function(err, new_network){
      if (!err){
        // get user id
        User.getUserById(req.user._id, function(err, received_user) {
          if (!err){
            // get old user network
            Network.getNetworkById(received_user.network, function(err, network){
              if (err) throw err;
              // remove user from old network
              Network.removeUsersFromNetwork(req.user._id, function(err, unneeded_network1){
                if (err) throw err;
                // add user to network to connect
                Network.addUser(new_network._id, req.user._id, function(err, unneeded_network2){
                  if (err) throw err;
                  // add network to user
                  received_user.network = new_network._id,
                  received_user.flatnumber = flatnumber
                  User.updateUser(req.user._id, received_user, {}, function(err, updated_user){
                    res.redirect('/');
                  });
                });
              });
            });
          }else{
            res.redirect('/');
          }
        });
      }else{
        res.redirect('/');
      }
    });
  }else{
    res.redirect('/');
  }
});
router.get('/requests/:_id', ensureAuthenticated, function(req, res, next) {
   if(req.user.admin == 0){
     Request.getRequestById(req.params._id, function(err, request){
       if (err) throw err;
       console.log("Request: "+request);
       // panel/request
       res.render('profile/request', {
         request: request,
         csrfToken: req.csrfToken()
       });
     });
   }else{
     res.redirect("/");
   }
 });

 router.get('/notifications/:_id', ensureAuthenticated, function(req, res, next) {
   if(req.user.admin == 0){
     NotificationModel.getNotificationById(req.params._id, function(err, notification){
       if (err) throw err;
       console.log(notification);
       // panel/notification
       res.render('profile/notification', {
        notification: notification,
         csrfToken: req.csrfToken()
       });
     });
   }else{
     res.redirect("/");
   }
 });
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated() && req.user.admin == 0){
    return next();
  }
  else{
    res.redirect('/#login');
  }
}

module.exports = router;
