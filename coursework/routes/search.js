var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
  if (null != req.query.q){
    var path = "/search/"+encodeURIComponent(req.query.q);
    res.redirect(path);
  }
  else{
    res.render('search', {
      arrN: [],
      arrC: [],
      arrS: [],
      query: null
    });
  }
});

router.get('/special/ajax',function(req,res){
   res.render("searchajax");
});

router.get('/bytag/name',function(req,res){
  Drug.getDrugsByName(req.query.name, function(err, drugs){
    if(err)
    {
      throw err;
    }
    res.send({drugs:drugs});
  });
});

router.get('/:query', function(req, res, next){
  var query = req.params.query;
  if (query.length > 2){
    var drugsNamesArr = [];
    var drugsCompaniesArr = [];
    var drugsSymppropArr = [];
    var tenTimes = 0;
    Drug.getDrugs(function(err, drugs){
      if (err){
        throw err;
      }
      for (let i = 0; i < drugs.length; i++){
        let myDrug = drugs[i];
        if (query.localeCompare(myDrug.name) == 0 && drugsNamesArr.length < 5){
          drugsNamesArr.push({
            "name": myDrug.name,
            "image": myDrug.image,
            "link": "/drugs/drug/"+myDrug._id,
            "type": myDrug.type,
            "unit": myDrug.unit,
            "price": myDrug.price,
            "volumemass": myDrug.volumemass
          });
          continue;
        }else if(query.localeCompare(myDrug.company) == 0 && drugsCompaniesArr.length < 5){
          drugsCompaniesArr.push({
            "name": myDrug.name,
            "image": myDrug.image,
            "link": "/drugs/drug/"+myDrug._id,
            "type": myDrug.type,
            "unit": myDrug.unit,
            "price": myDrug.price,
            "volumemass": myDrug.volumemass
          });
          continue;
        }else if(tenTimes < 10){
          var str = myDrug.symptoms+" "+myDrug.properties;
          var target = query;
          var pos = -1;
          while ((pos = str.indexOf(target, pos + 1)) != -1) {
            drugsSymppropArr.push({
              "name": myDrug.name,
              "image": myDrug.image,
              "link": "/drugs/drug/"+myDrug._id,
              "type": myDrug.type,
              "unit": myDrug.unit,
              "price": myDrug.price,
              "volumemass": myDrug.volumemass
            });
            tenTimes++;
            break;
          }
        }
      };
      res.render('search', {
        arrN: drugsNamesArr,
        arrC: drugsCompaniesArr,
        arrS: drugsSymppropArr,
        query: query
      });
    });
  }else{
    res.render('search', {
      arrN: [],
      arrC: [],
      arrS: [],
      query: query
    });
  }
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
