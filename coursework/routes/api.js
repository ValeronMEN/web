var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

router.get('/', function(req, res) {
    res.send("You're in REST API mode. Type 'api/drugs' to gain list of drugs");
});

/* GET users listing. */
router.get('/drugs', function(req, res) {
  Drug.getDrugs(function(err, drugs){
    if (err){
      throw err;
    }
    res.json(drugs);
  });
});

router.get('/drugs/:_id', function(req, res) {
  Drug.getDrugById(req.params._id, function(err, drug){
    if (err){
      res.render('error');
    }
    res.json(drug);
  });
});

router.post('/drugs', function(req, res) {
  var myDrug = req.body;
  Drug.addDrug(myDrug, function(err, drug){
    if (err){
      throw err;
    }
    res.json(drug);
  });
});

router.put('/drugs/:_id', function(req, res) {
  var id = req.params._id;
  var myDrug = req.body;
  Drug.updateDrug(id, myDrug, {}, function(err, drug){
    if (err){
      throw err;
    }
    res.json(drug);
  });
});

router.delete('/drugs/:_id', function(req, res) {
  var id = req.params._id;
  Drug.deleteDrug(id, function(err, drug){
    if (err){
      throw err;
    }
    res.json(drug);
  });
});

module.exports = router;
