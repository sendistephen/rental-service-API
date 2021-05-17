const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  // user making a booking
  fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
  // user to recieve booking
  toUser: { type: Schema.Types.ObjectId, ref: 'User' },
  stripeCustomerId: String,
  booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  amount: Number,
  tokenId: String,
  charge: Schema.Types.Mixed,
  status: { type: String, default: 'pending' }, //accepted,declined
});

module.exports = model('Payment', paymentSchema);
