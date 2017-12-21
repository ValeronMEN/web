var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema( {
  title: { type: String },
  users: [ String ],
}, {
  versionKey: false
});

var Answer = module.exports = mongoose.model("Answer", answerSchema);

module.exports.createAnswer = function(answer, callback){
  Answer.create(answer, callback);
};

module.exports.updateAnswer = function(id, answer, options, callback){
  var query = {_id: id};
  var updateObject = {
    text: answer.text,
    users: answer.users,
  };
  Answer.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deleteAnswer = function(id, callback){
  var query = {_id: id};
  Answer.remove(query, callback);
};

module.exports.getAnswers = function(callback, limit){
  Answer.find(callback).limit(limit);
};

module.exports.getAnswerById = function(id, callback){
  Answer.findById(id, callback);
};
