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
    maxlength: [1000, 'Summary is too long, only 1000 characters allowed'],
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
  image: { type: Schema.Types.ObjectId, ref: 'CloudinaryImage' },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  status: { type: String, default: 'pending' }, //accepted,declined
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Rental', rentalSchema);
