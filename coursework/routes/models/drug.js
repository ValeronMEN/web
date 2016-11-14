var mongoose = require("mongoose");

var drugSchema = new mongoose.Schema( {
    name: { type: String, default: "unnamed" },
    company: { type: String, default: "unknown" },
    volume: { type: Number },
    type_of_volume: { type: String, default: "unknown" },
    price: { type: String, default: "unknown" },
    symptoms: { type: String, default: "unknown" },
    side_effects: { type: String, default: "unknown" },
    contraindications: { type: String, default: "unknown" },
    overdose: { type: String, default: "unknown" },
    storage_conditions: { type: String, default: "unknown" },
    mode_of_application: { type: String, default: "unknown" },
    properties: { type: String, default: "unknown" },
    image: { type: String, default: "unknown" }
} );

var Drug = module.exports = mongoose.model("Drug", drugSchema);

module.exports.getDrugs = function(callback){
  Drug.find(callback);
}
