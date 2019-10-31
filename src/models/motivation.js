var mongoose = require("mongoose");
var random = require('mongoose-simple-random');

var motivationSchema = new mongoose.Schema({
    quote: String,
    image: String,
    owner: Object
});

motivationSchema.plugin(random);

module.exports = mongoose.model("Motivation", motivationSchema);