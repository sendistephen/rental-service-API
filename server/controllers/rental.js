const Rental = require('../models/rental');

/**
 * @route POST /api/v1/rentals
 * @Access PRIVATE
 * @description This end point adds a new rental to the database collection
 */
exports.create = async (req, res) => {
  const rentalData = req.body;
  rentalData.owner = res.locals.user;

  //  create rental
  await Rental.create(rentalData, (err, savedRental) => {
    if (err) {
      return res.databaseError(err);
    }
    return res.json(savedRental);
  });
};

/**
 * @route GET /api/v1/rentals?city="kanjokya"
 * @Access PUBLIC
 * @description This end point gets all the rentals from the database
 */
exports.getRentals = async (req, res) => {
  // get search creteria from query params
  const { city } = req.query;
  // build query
  const query = city ? { city: city.toLowerCase() } : {};
  // find rentals from the city provided
  await Rental.find(query).exec((err, foundRentals) => {
    if (err) {
      return res.databaseError(err);
    }
    if (foundRentals.length === 0) {
      return res.handleApiError({
        title: 'Not rentals founds',
        detail: `Currently no rentals found in ${city}`,
      });
    }
    return res.json(foundRentals);
  });
};

/**
 * @route GET /api/v1/rentals/609e38f1e471e11acb75fe13"
 * @Access PUBLIC
 * @description This end point gets the details of a single rental
 */
exports.getRental = async (req, res) => {
  // get rental id from params
  const { rentalId } = req.params;
  // find rental based on the ID given
  await Rental.findById(rentalId).exec((err, foundRental) => {
    if (err) {
      return res.databaseError(err);
    }
    return res.json(foundRental);
  });
};
