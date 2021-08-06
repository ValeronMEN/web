var mongoose = require("mongoose");

var pollSchema = new mongoose.Schema( {
  admin: { type: String },
  question: { type: String },
  description: { type: String },
  answers: [ {type: mongoose.Schema.Types.ObjectId, ref :'Answer'} ]
},{
  versionKey: false
});

var Poll = module.exports = mongoose.model("Poll", pollSchema);

module.exports.getPollAnswersById = function(id, callback){
  Network.findById(id).populate({
      path: 'answer',
      populate: { path: 'answer' }
  }).exec(callback);
}

module.exports.createPoll = function(poll, callback){
  Poll.create(poll, callback);
};

module.exports.updatePoll = function(id, poll, options, callback){
  var query = {_id: id};
  var updateObject = {
    admins: poll.admin,
    question: poll.question,
    description: poll.description,
    answers: poll.answers,
  };
  Poll.findOneAndUpdate(query, updateObject, options, callback);
};

module.exports.deletePoll = function(id, callback){
  var query = {_id: id};
  Poll.remove(query, callback);
};

module.exports.getPolls = function(callback, limit){
  Poll.find(callback).limit(limit);
};

module.exports.getPollById = function(id, callback){
  Poll.findById(id, callback);
};
