var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/medicine');
var db = mongoose.connection;

Drug = require("./models/drug");

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

module.exports = router;
