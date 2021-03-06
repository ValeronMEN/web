var mongoose = require("mongoose");

var requestSchema = new mongoose.Schema( {
  title: { type: String },
  text: { type: String },
  category: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref :'User' },
  creationdate: { type: Date, default: Date.now  },
  status: { type: String, default: "in process" },
}, {
  versionKey: false
});

var Request = module.exports = mongoose.model("Request", requestSchema);

module.exports.createRequest = function(request, callback){
  Request.create(request, callback);
};

module.exports.updateRequest = function(id, request, options, callback){
  var query = {_id: id};
  var updateObject = {
    title: request.title,
    text: request.text,
    category: request.category,
    author: request.author,
    creationdate: request.creationdate,
    status: request.status,
  };
  Request.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deleteRequest = function(id, callback){
  var query = {_id: id};
  Request.remove(query, callback);
};

module.exports.getRequests = function(callback){
  Request.find().populate({
      path: 'author',
      populate: { path: 'author' }
  }).exec(callback);
};

module.exports.getRequestsByCategory = function(input_category, callback){
  Request.find({ 'category': input_category }).populate({
      path: 'author',
      populate: { path: 'author' }
  }).exec(callback);
};

module.exports.getRequestById = function(id, callback){
  Request.findById(id).populate({
      path: 'author',
      populate: { path: 'author' }
  }).exec(callback);
};

module.exports.getRequestByAuthor = function(author, callback){
  Request.find({
    'author': author
   }, callback);
};

module.exports.countCategoryInRequests = function(category, callback){
  Request.count({ 'category': category }, callback );
};
