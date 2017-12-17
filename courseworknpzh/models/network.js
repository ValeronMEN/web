var mongoose = require("mongoose");

var networkSchema = new mongoose.Schema( {
  admins: [ String ],
  users: [ String ],
  country: { type: String, default: 'Ukraine' },
  city: { type: String, default: 'Kiev' },
  district: { type: String },
  street: { type: String },
  housenumber: { type: Number },
  polls: [ {type: mongoose.Schema.Types.ObjectId, ref :'Poll'} ],
  requests: [ {type: mongoose.Schema.Types.ObjectId, ref :'Request'} ],
  notifications: [ {type: mongoose.Schema.Types.ObjectId, ref :'Notification'} ], // NotificationModel
},{
  versionKey: false
});

var Network = module.exports = mongoose.model("Network", networkSchema);

module.exports.createNetwork = function(network, callback){
  Network.create(network, callback);
};

module.exports.getNetworkObjectsById = function(id, objectName, callback){
  Network.findById(id).populate({
      path: objectName,
      populate: { path: objectName }
  }).exec(callback);
}

module.exports.updateNetwork = function(id, network, options, callback){
  var query = {_id: id};
  var updateObject = {
    admins: network.admins,
    country: network.country,
    city: network.city,
    district: network.district,
    street: network.street,
    housenumber: network.housenumber,
    polls: network.polls,
    requests: network.requests,
    notifications: network.notifications,
  };
  Network.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deleteNetwork = function(id, callback){
  var query = {_id: id};
  Network.remove(query, callback);
};

module.exports.getNetworks = function(callback, limit){
  Network.find(callback).limit(limit);
};

module.exports.getNetworkById = function(id, callback){
  Network.findById(id, callback);
};

module.exports.addAdmin = function(id, new_admin, callback){
  Network.findByIdAndUpdate(
      id,
      {$push: {admins: new_admin}},
      { safe: true, upsert: true, new: true },
      function(err, model) { console.log(err); }
  );
};

module.exports.getNetworkByAddress = function(network, callback){
  var query = Network.findOne({
    'country': network.country,
    'city': network.city,
    'district': network.district,
    'street': network.street,
    'housenumber': network.housenumber
  });
  console.log(query._id)
}

/*
module.exports.getNetworkByAddress = function(address, callback){
  var query = {username: username};
  Network.findOne(query, callback);
}
*/
