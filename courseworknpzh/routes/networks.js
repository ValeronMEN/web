var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == 1){
    Network.getNetworks(function(err, networks){
      if (err) throw err;
      res.render('networks', {
        networks: networks,
        csrfToken: req.csrfToken()
      });
    });
  }else{
    res.redirect("/");
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

router.post('/create_network', ensureAuthenticated, function(req, res){
    if (req.user.admin == 1){
      var country = req.body.country;
      var city = req.body.city;
      var district = req.body.district;
      var street = req.body.street;
      var housenumber = req.body.housenumber;

      req.checkBody('country', 'Country is required').notEmpty();
      req.checkBody('city', 'City is required').notEmpty();
      req.checkBody('district', 'District is required').isEmail();
      req.checkBody('street', 'Street is required').notEmpty();
      req.checkBody('housenumber', 'House number is required').notEmpty().isNumber();

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
          Network.addAdmin(network._id, req.user.username, function(err, network){
            if(err) throw err;
            res.redirect('/networks');
          });
        });
      }
    }
    res.redirect('/');
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
