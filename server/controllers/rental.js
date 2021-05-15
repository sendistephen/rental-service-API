const Rental = require('../models/rental');

/**
 * @route POST /api/v1/rentals
 * @Access PRIVATE
 * @description This end point adds a new rental to the database collection
 */
exports.create = (req, res) => {
  const rentalData = req.body;
  rentalData.owner = res.locals.user;

  //  create rental
  Rental.create(rentalData, (err, savedRental) => {
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
exports.getRentals = (req, res) => {
  // get search creteria from query params
  const { city } = req.query;
  // build query
  const query = city ? { city: city.toLowerCase() } : {};
  // find rentals from the city provided
  Rental.find(query).exec((err, foundRentals) => {
    if (err) {
      return res.databaseError(err);
    }
    if (foundRentals.length === 0) {
      return res.handleApiError({
        title: 'No rentals found',
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
exports.getRental = (req, res) => {
  // get rental id from params
  const { rentalId } = req.params;
  // find rental based on the ID given
  Rental.findById(rentalId).exec((err, foundRental) => {
    if (err) {
      return res.databaseError(err);
    }
    return res.json(foundRental);
  });
};

/**
 * @route DELETE /api/v1/rentals/609e38f1e471e11acb75fe13"
 * @Access PRIVATE
 * @description This end point deletes a single rental
 */
exports.deleteRental = (req, res) => {
  const { rentalId } = req.params;
  const { user } = res.locals;

  // find rental given the rental Id and populate with owner
  const rental = Rental.findById(rentalId).populate('owner');
  // rental does not exist
  if (!rental) {
    return res.handleApiError({
      status: 404,
      title: 'Not found',
      detail: `Resource with the given id (${rentalId}) not found.`,
    });
  }
  // // check if user is owner of rental
  if (user.id !== rental.owner.id) {
    return res.handleApiError({
      title: 'Not authorized',
      detail: 'Ooops, you are not owner of this rental',
    });
  }
  // if owner then delete rental
  rental.remove((err) => {
    if (err) return res.databaseError(err);
    return res.json({
      success: true,
      detail: 'Resource removed successfully!',
    });
  });
};

/**
 * @route UPDATE /api/v1/rentals/609e38f1e471e11acb75fe13"
 * @Access PRIVATE
 * @description This end point updates a rental
 */
exports.update = (req, res) => {
  // get rentalId from req params
  const { rentalId } = req.params;
  // get user from res object
  const { user } = res.locals;
  // get form data
  const rentalData = req.body;

  // find if rental exists with the given id in the database
  const rental = Rental.findById(rentalId).populate('owner');
  if (!rental) {
    return res.handleApiError({
      status: 404,
      title: 'Not found',
      detail: `Resource with the given id (${rentalId}) not found.`,
    });
  }
  // make sure the user updating rental is the actual owner
  if (user.id !== rental.owner.id) {
    return res.handleApiError({
      title: 'Not authorized',
      detail: 'Ooops, you are not owner of this rental',
    });
  }
  // set new properties on the rental -> update rental object
  rental.set(rentalData);
  rental.save();
  return res.status(200).json(rental);
};
