var mongoose = require("mongoose");

var drugSchema = new mongoose.Schema( {
    name: { type: String, default: "unnamed" },
    company: { type: String, default: "unknown" },
    volume: { type: Number },
    type_of_volume: { type: String, default: "unknown" },
    price: { type: String, default: "unknown" },
    symptoms: { type: String, default: "unknown" },
    side_effects: { type: String, default: "unknown" },
    contraindications: { type: String, default: "unknown" },
    overdose: { type: String, default: "unknown" },
    storage_conditions: { type: String, default: "unknown" },
    mode_of_application: { type: String, default: "unknown" },
    properties: { type: String, default: "unknown" },
    image: { type: String, default: "unknown" }
}, {
    versionKey: false // You should be aware of the outcome after set to false
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
    image: drug.image
  };
  Drug.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteDrug = function(id, callback){
  var query = {_id: id};
  Drug.remove(query, callback);
};
