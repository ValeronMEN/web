var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema( {
  title: { type: String },
  text: { type: String },
  author: { type: String },
  creationdate: { type: Date, default: Date.now },
},{
  versionKey: false
});

var NotificationModel = module.exports = mongoose.model("Notification", notificationSchema);

module.exports.createNotification = function(notification, callback){
  NotificationModel.create(notification, callback);
};

module.exports.updateNotification = function(id, notification, options, callback){
  var query = {_id: id};
  var updateObject = {
    title: notification.title,
    text: notification.text,
    author: notification.author,
    creationdate: notification.creationdate,
  };
  NotificationModel.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deleteNotification = function(id, callback){
  var query = {_id: id};
  NotificationModel.remove(query, callback);
};

module.exports.getNotifications = function(callback, limit){
  NotificationModel.find(callback).limit(limit);
};

module.exports.getNotificationById = function(id, callback){
  NotificationModel.findById(id, callback);
};
