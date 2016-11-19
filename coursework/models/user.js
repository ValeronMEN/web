var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema( {
  username: { type: String, index: true},
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String },
  sex: { type: String },
  admin: { type: Boolean },
  avatar: { type: String }
}, {
    versionKey: false
});

var User = module.exports = mongoose.model("User", userSchema);

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
  });
};

module.exports.getUsers = function(callback, limit){
  User.find(callback).limit(limit);
};

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
};

module.exports.updateUser = function(id, user, options, callback){
  var query = {_id: id};
  var update = {
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: user.password,
    sex: user.sex,
    admin: user.admin,
    avatar: user.avatar
  };
  User.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteUser = function(id, callback){
  var query = {_id: id};
  User.remove(query, callback);
};

module.exports.getUserByUsername = function(username, callback){
  var query = {username: username};
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}
