var express = require('express');
var router = express.Router();

router.get('/:_id', function(req, res, next) {
  Drug.getDrugById(req.params._id, function(err, drug){
    if (err){
      res.render('error');
    }
    else{
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
    }
  });
});

module.exports = router;
