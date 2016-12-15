var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (null != req.query.q){
    var path = "/search/"+encodeURIComponent(req.query.q);
    res.redirect(path);
  }else{
    var limit = 15;
    Drug.count(function(err, count){
      if (count <= limit){
        Drug.getDrugs(function(err, drugs){
          if (err) throw err;
          res.render('index', {
            "arr": drugs
          });
        });
      }else{
        var skip = count - 15;
        Drug.getPaginationDrugs(skip, limit, function(err, drugs){
          if (err) throw err;
          res.render('index', {
            "arr": drugs
          });
        });
      }
    });
  }
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
