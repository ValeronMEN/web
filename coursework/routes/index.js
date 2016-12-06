var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (null != req.query.q){
    var path = "/search/"+encodeURIComponent(req.query.q);
    res.redirect(path);
  }
  else{
    var arr = [];
    Drug.count(function(err, count){
      Drug.getDrugs(function(err, drugs){
        if (err){
          throw err;
        }
        for (let i = count-1; i > count-16; i--){
          let myDrug = drugs[i];
          if (null == drugs[i]){
            break;
          }
          else{
            arr.push({
              "name": myDrug.name,
              "image": "/pics/drugs/" + myDrug.image,
              "link": "/drugs/drug/"+myDrug._id,
              "type": myDrug.type,
              "unit": myDrug.unit,
              "price": myDrug.price,
              "volumemass": myDrug.volumemass
            });
          }
        };
        res.render('index', { arr: arr });
      });
    });
  }
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
