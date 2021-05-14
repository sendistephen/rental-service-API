const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const rentalSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required'],
    maxlength: [130, 'Name is too long, maximum is 130 characters'],
  },
  summary: {
    type: String,
    trim: [true, 'Summary is required'],
    maxlength: [250, 'Summary is too long, only 250 characters allowed'],
    property_type: { type: String, required: true },
  },
  city: { type: String, required: true, trim: true, lowercase: true },
  street: { type: String, required: true, trim: true },
  bedrooms: Number,
  beds: Number,
  dailyRate: Number,
  phone: {
    type: String,
    required: true,
  },
  shared: Boolean,
  owner: { type: mongoose.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Rental', rentalSchema);
