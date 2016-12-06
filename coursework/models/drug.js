var mongoose = require("mongoose");

var drugSchema = new mongoose.Schema( {
    name: { type: String },
    company: { type: String },
    volumemass: { type: Number },
    unit: { type: String },
    type: { type: String },
    price: { type: Number },
    symptoms: { type: String },
    side_effects: { type: String },
    contraindications: { type: String },
    overdose: { type: String },
    storage_conditions: { type: String },
    mode_of_application: { type: String },
    properties: { type: String },
    image: { type: String, default: "drugnoimage.jpg"  }
}, {
    versionKey: false
});

var Drug = module.exports = mongoose.model("Drug", drugSchema);

module.exports.getDrugs = function(callback, limit){
  Drug.find(callback).limit(limit);
};

module.exports.getDrugById = function(id, callback){
  Drug.findById(id, callback);
};

module.exports.addDrug = function(drug, callback){
  Drug.create(drug, callback);
};

module.exports.updateDrug = function(id, drug, options, callback){
  var query = {_id: id};
  var update = {
    name: drug.name,
    company: drug.company,
    volumemass: drug.volumemass,
    unit: drug.unit,
    type: drug.type,
    price: drug.price,
    symptoms: drug.symptoms,
    side_effects: drug.side_effects,
    contraindications: drug.contraindications,
    overdose: drug.overdose,
    storage_conditions: drug.storage_conditions,
    mode_of_application: drug.mode_of_application,
    properties: drug.properties,
    image: drug.image
  };
  Drug.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteDrug = function(id, callback){
  var query = {_id: id};
  Drug.remove(query, callback);
};
