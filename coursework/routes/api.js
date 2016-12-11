var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

router.get('/', function(req, res) {
    res.json({
      info: "You're in REST API mode. Type 'api/drugs' to gain list of drugs"
    });
});

router.get('/drugs', function(req, res) {
  Drug.getDrugs(function(err, drugs){
    if (err){
      res.json({
        success: false
      });
    }
    else{
      res.json(drugs);
    }
  });
});

router.get('/drugs/:_id', function(req, res) {
  Drug.getDrugById(req.params._id, function(err, drug){
    if (err){
      res.json({
        success: false
      });
    }
    else{
      res.json(drug);
    }
  });
});

router.post('/drugs', function(req, res) {
  var myDrug = req.body;
  Drug.addDrug(myDrug, function(err, drug){
    if (err){
      res.json({
        success: false
      });
    }
    else{
      res.json({
        success: true
      });
    }
  });
});

router.put('/drugs/:_id', function(req, res) {
  var id = req.params._id;
  var myDrug = req.body;
  Drug.updateDrug(id, myDrug, {}, function(err, drug){
    if (err){
      res.json({
        success: false
      });
    }
    else{
      res.json(drug);
    }
  });
});

router.delete('/drugs/:_id', function(req, res) {
  var id = req.params._id;
  Drug.deleteDrug(id, function(err, drug){
    if (err){
      var error = {
        success: false
      }
      res.json(error);
    }
    else{
      res.json(drug);
    }
  });
});

module.exports = router;
