const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  startAt: { type: Date, required: [true, 'Starting date is required'] },
  endAt: { type: Date, required: [true, 'Ending date is required'] },
  price: { type: Number, required: true },
  nights: { type: Number, required: true },
  guests: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  rental: { type: Schema.Types.ObjectId, ref: 'Rental' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Booking', bookingSchema);
