var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema( {
    drugs: [ String ],
    sizes: [ Number ],
    creation_date: { type: Date, default: Date.now  },
    status: { type: String, default: "inprocess"  },
    owner: { type: String },
    price: { type: Number },
    address: { type: String },
    phonenumber: { type: String }
}, {
    versionKey: false
});

var Order = module.exports = mongoose.model("Order", orderSchema);

module.exports.getOrders = function(callback, limit){
  Order.find(callback).limit(limit);
};

module.exports.getOrderById = function(id, callback){
  Order.findById(id, callback);
};

module.exports.getOrdersByOwnerId = function(id, callback){
  Order.find({ 'owner' : id }, callback);
}

module.exports.addOrder = function(order, callback){
  Order.create(order, callback);
};

module.exports.updateOrder = function(id, order, options, callback){
  var query = {_id: id};
  var update = {
    drugs: order.drugs,
    sizes: order.sizes,
    creation_date: order.creation_date,
    status: order.status,
    owner: order.owner,
    price: order.price,
    address: order.address,
    phonenumber: order.phonenumber
  };
  Order.findOneAndUpdate(query, update, options, callback);
};

module.exports.deleteOrder = function(id, callback){
  var query = {_id: id};
  Order.remove(query, callback);
};
