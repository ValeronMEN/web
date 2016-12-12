var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  if (typeof req.cookies.drug == 'undefined' || req.cookies.drug == ""){
    res.render('basket', {arr: null});
  }else{
    var arr = req.cookies.drug.split(",");
    var drugs = [];
    var price = 0;
    for (let i=0; i<arr.length-1; i++){
      Drug.getDrugById(arr[i].substring(0, arr[i].indexOf("$")), function(err, drug){
        if (err || null == drug || typeof drug == 'undefined'){
          res.render('error');
        }else{
          let size = parseInt(arr[i].substring(arr[i].indexOf("$")+1));
          drugs.push({
            id: drug._id,
            name: drug.name,
            volumemass: drug.volumemass,
            unit: drug.unit,
            type: drug.type,
            price: drug.price,
            image: "/pics/drugs/"+drug.image,
            amount: size
          });
          price += (drug.price * size);
          if (drugs.length == arr.length-1){
            var sortdrugs = drugs.sort(function compareNumeric(a, b) {
               return a.name.localeCompare(b.name);
            })
            res.render('basket', {
              price: price,
              arr: sortdrugs,
              bills: "UAH"
            });
          }
        }
      });
    }
  }
});

router.get('/confirm', function(req, res, next){
  if (typeof req.cookies.drug == 'undefined' || req.cookies.drug == "" || null == req.cookies.drug){
    res.redirect("/");
  }else{
    var arr = req.cookies.drug.split(",");
    var drugs = [];
    var price = 0;
    for (let i=0; i<arr.length-1; i++){
      Drug.getDrugById(arr[i].substring(0, arr[i].indexOf("$")), function(err, drug){
        if (err || null == drug || typeof drug == 'undefined'){
          res.redirect("/");
        }else{
          let size = parseInt(arr[i].substring(arr[i].indexOf("$")+1));
          drugs.push({
            id: drug._id,
            name: drug.name,
            volumemass: drug.volumemass,
            unit: drug.unit,
            type: drug.type,
            price: drug.price,
            amount: size
          });
          price += (drug.price * size);
          if (drugs.length == arr.length-1){
            var sortdrugs = drugs.sort(function compareNumeric(a, b) {
               return a.name.localeCompare(b.name);
            })
            res.render('confirm', {
              price: price,
              arr: sortdrugs,
              bills: "UAH"
            });
          }
        }
      });
    }
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
