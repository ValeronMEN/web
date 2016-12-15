var express = require('express');
var router = express.Router();

var file_functions = require('../modules/files');

router.post('/drug/:_id', ensureAuthenticated, function(req, res, next) {
  if(req.user.admin == true){
    Drug.getDrugById(req.params._id, function(err, drugToDelete){
      if (err){
        res.render('error');
      }
      else{
        var old_path = "./public/pics/drugs/" + drugToDelete.image;
        Drug.deleteDrug(drugToDelete._id, function(err, drug){
          file_functions.deleteFile(old_path);
          req.flash('success_msg', 'Successful removing!');
          res.redirect('/admins/newdrug');
        });
      }
    });
  }else{
    res.redirect("/");
  }
});

router.get('/drug/:_id', function(req, res, next) {
  Drug.getDrugById(req.params._id, function(err, drug){
    if ((null == drug)||(err == true)){
      res.render('error');
    }
    else{
      var admin = false;
      if (null != req.user){
        admin = req.user.admin;
      }
      res.render('drug', {
      name: drug.name,
      company: drug.company,
      volumemass: drug.volumemass,
      unit: drug.unit,
      type: drug.type,
      price: drug.price,
      symptoms: drug.symptoms,
      side_effects: drug.side_effects,
      contraindications: drug.contraindications,
      overdose: drug.overdose,
      storage_conditions: drug.storage_conditions,
      mode_of_application: drug.mode_of_application,
      properties: drug.properties,
      _id: drug._id,
      admin: admin,
      image: "/pics/drugs/"+drug.image});
    }
  });
});

router.get('/', function(req, res, next) {
  res.redirect("/drugs/1");
});

router.get('/:page', function(req, res, next){
  var limit = 15;
  Drug.count(function(err, count){
    var pages = Math.ceil(count / limit);
    var page = parseInt(req.params.page) - 1;
    if (NaN != page && page < pages){
      var skip = limit * page;
      Drug.getPaginationDrugs(skip, limit, function(err, drugs){
        if (err) throw err;
        res.render('drugs', {
          "arr": drugs,
          "pages": pages,
          "page": page + 1
        });
      });
    }else{
      res.render("error");
    }
  });
})

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
