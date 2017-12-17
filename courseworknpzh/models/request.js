var mongoose = require("mongoose");

var requestSchema = new mongoose.Schema( {
  text: { type: String },
  category: { type: String },
  author: { type: String },
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
    text: request.text,
    category: request.category,
    owner: request.owner,
    network: request.network,
    creationdate: request.creationdate,
    status: request.status,
  };
  Request.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deleteRequest = function(id, callback){
  var query = {_id: id};
  Request.remove(query, callback);
};

module.exports.getRequests = function(callback, limit){
  Request.find(callback).limit(limit);
};

module.exports.getRequestById = function(id, callback){
  Request.findById(id, callback);
};
