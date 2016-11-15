var mongoose = require("mongoose");

var userSchema = new mongoose.Schema( {
    name: { type: String, default: "unnamed" },
    company: { type: String, default: "unknown" }
});

var User = module.exports = mongoose.model("User", userSchema);

module.exports.getUsers = function(callback, limit){
  User.find(callback).limit(limit);
};

module.exports.getDrugById = function(id, callback){
  User.findById(id, callback);
};

module.exports.addDrug = function(drug, callback){
  User.create(drug, callback);
};

module.exports.updateDrug = function(id, drug, options, callback){
  var query = {_id: id};
  var update = {
    name: drug.name,
    company: drug.company
  };
  User.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteDrug = function(id, callback){
  var query = {_id: id};
  User.remove(query, callback);
};
