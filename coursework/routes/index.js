var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var arr = []; // array of my drugs
  Drug.getDrugs(function(err, drugs){
    if (err){
      throw err;
    }
    for (let i = 0; i < drugs.length; i++){
      let myDrug = drugs[i];
      arr.push({
        "name": myDrug.name,
        "image": '../pics/' + myDrug.image + '.jpg',
        "link": "/"+myDrug._id
      });
    };
    console.log(arr);
    res.render('index', { arr: arr });
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

/*
router.post('/', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    console.log("User sent: login: "+login+"; password: "+password);
    res.render('index');
});
*/

router.get('/:_id', function(req, res, next) {
  Drug.getDrugById(req.params._id, function(err, drug){
    if (err){
      throw err;
    }
    res.render('drug', { name: drug.name,
    company: drug.company,
    volume: drug.volume,
    type_of_volume: drug.type_of_volume,
    price: drug.price,
    symptoms: drug.symptoms,
    side_effects: drug.side_effects,
    contraindications: drug.contraindications,
    overdose: drug.overdose,
    storage_conditions: drug.storage_conditions,
    mode_of_application: drug.mode_of_application,
    properties: drug.properties,
    image: '../pics/' + drug.image + '.jpg'});
  });
});

module.exports = router;
