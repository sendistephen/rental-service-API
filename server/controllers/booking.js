const moment = require('moment');
const Booking = require('../models/booking');
const Rental = require('../models/rental');

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
  Booking.find({ rental: booking.rental }, (err, foundBookings) => {
    if (err) {
      return res.databaseError(err);
    }
    // check if booking is valid -> dates is available
    const validBooking = checkIfBookingIsValid(booking, foundBookings);
    if (validBooking) {
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
        title: 'Dates already taken',
        detail: 'Dates chosen are already taken, please choose other dates',
      });
    }
  });
};
