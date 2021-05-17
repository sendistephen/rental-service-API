const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/payment');
const Booking = require('../models/booking');
const User = require('../models/user');

exports.getPendingPayments = (req, res) => {
  const { user } = res.locals;

  /**
   * Get payments for the user we are getting from the request
   * with the booking
   * and rental from the booking
   * and the booking owner(customer) -> fromUser
   */
  Payment.where({ toUser: user })
    .populate({
      path: 'booking',
      populate: { path: 'rental' },
    })
    .populate('fromUser')
    .exec((err, foundPayments) => {
      if (err) return res.databaseError(err);
      return res.json(foundPayments);
    });
};

exports.confirmPayment = (req, res) => {
  const { payment } = req.body;
  //   get user
  const { user } = res.locals;

  //   get payment by ID from DB
  Payment.findById(payment._id)
    .populate('toUser')
    .populate('booking')
    .exec((err, foundPayment) => {
      if (err) return res.databaseError(err);
      //check if payment has status of 'pending' and user sending the request is same as rental owner
      if (
        foundPayment.status === 'pending' &&
        user.id === foundPayment.toUser.id
      ) {
        const { booking } = foundPayment;
        //   now charge user
        const charge = stripe.charges.create({
          amount: booking.price,
          currency: 'usd',
          customer: payment.stripeCustomerId,
        });
        if (charge) {
          // update booking to status 'active
          Booking.updateOne(
            { _id: booking.id },
            { status: 'active' },
            () => {}
          );
          //   update foundPayment to paid
          foundPayment.charge = charge;
          foundPayment.status = 'paid';

          foundPayment.save((err) => {
            if (err) return res.databaseError(err);
            // update User  and increment revenue with charge amount
            User.updateOne(
              { _id: foundPayment.toUser },
              {
                $inc: {
                  revenue: foundPayment.amount,
                },
              },
              (err) => {
                if (err) return res.databaseError(err);
                return res.json({ status: 'Paid' });
              }
            );
          });
        }
      }
    });
};
