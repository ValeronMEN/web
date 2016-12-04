var express = require('express');
var router = express.Router();

router.get('/:query', function(req, res, next){
  var queryArr = [];
  var drugsArr = [];
  queryArr = req.params.query.split(" ");
  console.log("Query array: "+queryArr);
  Drug.getDrugs(function(err, drugs){
    if (err){
      throw err;
    }
    for (let i = 0; i < drugs.length; i++){
      let myDrug = drugs[i];
      for (let j=0; j<queryArr.length; j++){
        if (queryArr[j].localeCompare(myDrug.name)==0){
          //console.log(myDrug);
          drugsArr.push({
            "name": myDrug.name,
            "image": "/pics/drugs/" + myDrug.image,
            "link": "/drugs/drug/"+myDrug._id,
            "type": myDrug.type_of_volume,
            "price": myDrug.price,
            "volume": myDrug.volume,
            "spec": "name"
          });
          break;
        }
        else if(queryArr[j].localeCompare(myDrug.company)==0){
          //console.log(myDrug);
          drugsArr.push({
            "name": myDrug.name,
            "image": "/pics/drugs/" + myDrug.image,
            "link": "/drugs/drug/"+myDrug._id,
            "type": myDrug.type_of_volume,
            "price": myDrug.price,
            "volume": myDrug.volume,
            "spec": "company"
          });
          break;
        }
        else{
          var str = myDrug.symptoms+" "+myDrug.properties;
          var target = queryArr[j]; // цель поиска

          var pos = 0;
          var pos = -1;
          while ((pos = str.indexOf(target, pos + 1)) != -1) {
            //console.log(myDrug);
            drugsArr.push({
              "name": myDrug.name,
              "image": "/pics/drugs/" + myDrug.image,
              "link": "/drugs/drug/"+myDrug._id,
              "type": myDrug.type_of_volume,
              "price": myDrug.price,
              "volume": myDrug.volume,
              "spec": "symptomprop"
            });
            break;
          }
        }
      }
    };
    res.render('search', { arr: drugsArr });
  });
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
