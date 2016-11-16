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
        "link": "/drugs/"+myDrug._id
      });
    };
    console.log(arr);
    res.render('index', { arr: arr });
  });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
