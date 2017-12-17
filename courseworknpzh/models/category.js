var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema( {
  name: { type: String },
},{
  versionKey: false
});

var Category = module.exports = mongoose.model("Category", categorySchema);

module.exports.createCategory = function(category, callback){
  Category.create(request, callback);
};

module.exports.updateCategory = function(id, category, options, callback){
  var query = {_id: id};
  var updateObject = {
    name: category.name,
  };
  Category.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deleteCategory = function(id, callback){
  var query = {_id: id};
  Category.remove(query, callback);
};

module.exports.getCategories = function(callback, limit){
  Category.find(callback).limit(limit);
};

module.exports.getCategoryById = function(id, callback){
  Category.findById(id, callback);
};
