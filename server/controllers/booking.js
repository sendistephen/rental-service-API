const moment = require('moment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/booking');
const Payment = require('../models/payment');
const Rental = require('../models/rental');
const User = require('../models/user');

const CUSTOMER_DISCOUNT = 0.8;
/**
 *
 * @param {*} booking  Booking that we want to make payment on
 * @param {*} toUser  Owner of rental to recieve payment
 * @param {*} token  Special token we recieve from stripe when    provide a valid credit card.
 */
async function createPayment(booking, toUser, token) {
  const { user } = booking; // user we want to charge that created a booking

  // create stripe customer
  const customer = await stripe.customers.create({
    source: token.id,
    email: user.email,
  });

  // check if we have a customer
  if (customer) {
    // update user (stripeCustomerId) record before payment -> the user we want to charge
    User.updateOne(
      { _id: user.id },
      { $set: { stripeCustomerId: customer.id } },
      () => {}
    );
    // create payement
    const payment = new Payment({
      fromUser: user,
      toUser,
      fromStripeCustomerId: customer.id,
      booking,
      tokenId: token,
      amount: booking.amount * 100 * CUSTOMER_DISCOUNT,
    });
    try {
      // save payment
      const savedPayment = await payment.save();
      return { payment: savedPayment };
    } catch (error) {
      return { error: error.message };
    }
  } else {
    return { error: 'Payment can not be processed!' };
  }
}

/**
 *
 * @param {*} pending  Pending booking dates
 * @param {*} booked Booked rental dates
 * @returns It returns true if dates are valid otherwise false if dates chosen are already booked by a user
 */
function checkIfBookingIsValid(pending, booked) {
  let isValid = true;

  if (booked && booked.length > 0) {
    // test if all dates in the rental booking pass
    isValid = booked.every((booking) => {
      // get pending bookings dates
      const pendingStartAtDate = moment(pending.startAt);
      const pendingEndAtDate = moment(pending.endAt);

      // get already rental booked dates
      const bookedStartAtDate = moment(booking.startAt);
      const bookedEndAtDate = moment(booking.endAt);

      // check if dates are not taken already
      return (
        (bookedStartAtDate < pendingStartAtDate &&
          bookedEndAtDate < pendingStartAtDate) ||
        (pendingEndAtDate < bookedStartAtDate &&
          pendingEndAtDate < bookedEndAtDate)
      );
    });
  }
  return isValid;
}
/**
 *
 * @param {*} booking Object with startAt and endAt dates
 * This method checks if starting date is less than end date
 */
function checkIfBookingDatesAreValid(booking) {
  let isValid = true;

  if (!booking.startAt || !booking.endAt) {
    isValid = false;
  }

  if (moment(booking.startAt) > moment(booking.endAt)) {
    isValid = false;
  }
  return isValid;
}

/**
 * @route GET /api/v1/bookings/me
 * @Access PRIVATE
 * @description This end point retrieves all user bookings
 */
exports.getUserBookings = (req, res) => {
  const { user } = res.locals;

  Booking.find({ user })
    .populate('user', '-password')
    .populate('rental')
    .exec((err, bookings) => {
      if (err) {
        return res.databaseError(err);
      }
      return res.json(bookings);
    });
};

/**
 * @route GET /api/v1/bookings/recieved
 * @Access PRIVATE
 * @description This end point retrieves all user bookings made on the owners rental
 */
exports.getRecievedBookings = async (req, res) => {
  const { user } = res.locals;

  /**
   * get all the rentals that this (user) is owning where owner the property on rental is (user)
   *Return only the IDs
   * */
  try {
    const rentals = await Rental.find({ owner: user }, '_id');
    // itelate rentals to get only rental IDs array
    const rentalIds = rentals.map((rental) => rental.id);

    // fetch bookings and find all the rentals included in rentalIds
    const bookings = await Booking.find({ rental: { $in: rentalIds } })
      .populate('user')
      .populate('rental');
    return res.json(bookings);
  } catch (error) {
    return res.databaseError(error);
  }
};

/**
 * @route POST /api/v1/bookings
 * @access: PRIVATE
 * @description: This route allows a user to create a booking on a rental
 */

exports.create = (req, res) => {
  // get user data from req.body
  const bookingData = req.body;
  const { stripePaymentToken } = bookingData;
  //   create new booking object
  const booking = new Booking({ ...bookingData, user: res.locals.user });

  // check if dates are valid
  if (!checkIfBookingDatesAreValid(booking)) {
    return res.handleApiError({
      title: 'Check dates',
      detail: 'Ooops, Starting date can not be greater than ending date',
    });
  }

  // find existing bookings on this rental
  Booking.find({ rental: booking.rental }, (err, foundRental) => {
    if (err) {
      return res.databaseError(err);
    }
    // check if booking is valid -> dates is available
    const validBooking = checkIfBookingIsValid(booking, foundRental);
    if (validBooking) {
      // accept payment
      const { payment, error } = createPayment(
        booking,
        foundRental.user,
        stripePaymentToken
      );
      if (payment) {
        // provide payment to booking
        booking.payment = payment;
        booking.save((err, booked) => {
          if (err) {
            return res.databaseError(err);
          }
          return res.json({
            success: true,
            startAt: booked.startAt,
            endAt: booked.endAt,
          });
        });
      } else {
        return res.handleApiError({
          title: 'Payment not accepted',
          detail: error,
        });
      }
    } else {
      return res.handleApiError({
        title: 'Dates already taken',
        detail: 'Dates chosen are already taken, please choose other dates',
      });
    }
  });
};
/**
 * @route DELETE /api/v1/bookings/uerueejbfhefbefejj
 * @access: PRIVATE
 * @description: This route allows rental owner of the booking to delete it
 */
exports.deleteBooking = async (req, res) => {
  // get booking ID from the params
  const { bookingID } = req.params;
  // get current logged in user from res object
  const { user } = res.locals;

  const ALLOWED_DAYS = 3;

  try {
    //iterate over the bookings
    const booking = await Booking.findById(bookingID).populate('user');

    // check if the user is owner of rental\
    if (user.id !== booking.user.id) {
      return res.handleApiError({
        status: 401,
        title: 'Not authorized',
        detail: 'You are not rental owner',
      });
    }
    // ensure the booking is not active or about to start
    // delete booking that are 3 days and above to start
    if (moment(booking.startAt).diff(moment(), 'days') > ALLOWED_DAYS) {
      await booking.remove();
      return res.json({
        success: true,
        ID: bookingID,
      });
    }
    return res.handleApiError({
      title: 'Operation failed',
      detail:
        'You can not delete this booking. Bookings that are atleast 3 days to arrival can not be deleted.',
    });
  } catch (error) {
    return res.databaseError(error);
  }
};
