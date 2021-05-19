const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const imageSchema = new Schema({
  url: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('CloudinaryImage', imageSchema);
