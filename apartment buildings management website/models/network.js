var mongoose = require("mongoose");

var networkSchema = new mongoose.Schema( {
  admins: [ String ],
  users: [ String ],
  country: { type: String, default: 'Ukraine', required: true },
  city: { type: String, default: 'Kiev', required: true },
  district: { type: String, required: true },
  street: { type: String, required: true },
  housenumber: { type: Number, required: true },
  polls: [ {type: mongoose.Schema.Types.ObjectId, ref :'Poll'} ],
  requests: [ {type: mongoose.Schema.Types.ObjectId, ref :'Request'} ],
  notifications: [ {type: mongoose.Schema.Types.ObjectId, ref :'Notification'} ], // NotificationModel
  password: { type: String },
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

module.exports.getAllNetworkObjectsById = function(id, callback){
  Network.findById(id).populate({
      path: 'polls',
      populate: { path: 'polls' }
  }).populate({
      path: 'notifications',
      populate: { path: 'notifications' }
  }).populate({
      path: 'requests',
      populate: { path: 'requests' }
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
      callback
  );
};

module.exports.addNotification = function(id, new_notification, callback){
  Network.findByIdAndUpdate(
      id,
      {$push: {notifications: new_notification}},
      { safe: true, upsert: true, new: true },
      callback
  );
};

module.exports.addRequest = function(id, new_request, callback){
  Network.findByIdAndUpdate(
      id,
      {$push: {requests: new_request}},
      { safe: true, upsert: true, new: true },
      callback
  );
};

module.exports.addUser = function(id, new_user, callback){
  Network.findByIdAndUpdate(
      id,
      {$push: { users: new_user }},
      { safe: true, upsert: true, new: true },
      callback
  );
};

module.exports.addPoll = function(id, new_poll, callback){
  Network.findByIdAndUpdate(
      id,
      {$push: { polls: new_poll }},
      { safe: true, upsert: true, new: true },
      callback
  );
};

module.exports.removeRequestFromNetwork = function(id, callback)
{
  Network.update({},
    {"$pull": { requests: id }},
    {multi: true},
    callback);
}

module.exports.removeNotificationFromNetwork = function(id, callback)
{
  Network.update({},
    {"$pull": { notifications: id }},
    {multi: true},
    callback);
}

module.exports.removeUsersFromNetwork = function(id, callback)
{
  Network.update({},
    {"$pull": { users: id }},
    {multi: true},
    callback);
}

module.exports.getNetworkByAddress = function(network, callback)
{
  var query = {
    country: network.country,
    city: network.city,
    district: network.district,
    street: network.street,
    housenumber: network.housenumber
  };
  Network.findOne(query,callback);
}

module.exports.getNetworkByPassword = function(password, callback)
{
  Network.findOne({ password: password }, callback);
}

module.exports.getNetworkByStreetAndHousenumber = function(street, housenumber, callback){
  Network.find({
    'street': street,
    'housenumber': housenumber
  }, callback);
};

module.exports.getNetworkByStreet = function(street, housenumber, callback){
  Network.find({
    'street': street
  }, callback);
};

module.exports.getNetworkByHousenumber = function(street, housenumber, callback){
  Network.find({
    'housenumber': housenumber
  }, callback);
};
