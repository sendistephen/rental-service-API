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
  await Rental.find({ query }, (err, foundRentals) => {
    if (err) {
      return res.databaseError(err);
    }
    return res.json(foundRentals);
  });
};
