var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema( {
  username: { type: String, index: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  flatnumber: { type: Number, default: 0 },
  zipcode: { type: String, default: '' },
  phonenumber: { type: String, required: true },
  admin: { type: Number, default: 0 }, // for default set user (code = 0)
  avatar: { type: String, default: './public/images/avatars/default.jpg' },
  network: { type: mongoose.Schema.Types.ObjectId, ref :'Network' },
},{
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

module.exports.updateUser = function(id, user, options, callback){
  var query = {_id: id};
  var updateObject = {
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: user.password,
    flatnumber: user.flatnumber,
    zipcode: user.zipcode,
    phonenumber: user.phonenumber,
    admin: user.admin,
    avatar: user.avatar,
    network: user.network,
  };
  User.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deleteUser = function(id, callback){
  var query = {_id: id};
  User.remove(query, callback);
};

module.exports.getUsers = function(callback, limit){
  User.find(callback).limit(limit);
};

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
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
