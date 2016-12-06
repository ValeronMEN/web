var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res, next){
  res.render('basket');
});

router.post('/', ensureAuthenticated, function(req, res, next){
  res.render('basket');
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
