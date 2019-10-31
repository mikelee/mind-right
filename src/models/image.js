const mongoose = require("mongoose");
const random = require('mongoose-simple-random');

const imageSchema = new mongoose.Schema({
    imageURL: String,
    owner: Object
});

imageSchema.plugin(random);

module.exports = mongoose.model('Image', imageSchema);