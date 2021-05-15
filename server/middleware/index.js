/* eslint-disable guard-for-in */
const mongoose = require('mongoose');
const Rental = require('../models/rental');

exports.errorHandler = (req, res, next) => {
  res.handleApiError = (config) => {
    const { status = 422, title, detail } = config;
    return res.status(status).send({ errors: [{ title, detail }] });
  };

  res.databaseError = (dbError) => {
    //   an array of errors
    const normalizeErrors = [];
    // holds errors field names
    const errorField = 'errors';
    // check if property of dbError contains errorFields
    if (
      dbError &&
      dbError.hasOwnProperty(errorField) &&
      dbError.name === 'ValidationError'
    ) {
      // extract errors
      const errors = dbError[errorField];
      //   iterate over the errors

      for (const property in errors) {
        normalizeErrors.push({
          title: property,
          detail: errors[property].message,
        });
      }
    } else {
      normalizeErrors.push({
        title: 'Database error',
        detail: 'Ooops, Something went  wrong',
      });
    }
    return res.status(422).send({ errors: normalizeErrors });
  };
  next();
};

/**
 *
 * @param {*} objectId
 * @description This middleware checks for a valid object ID
 */
exports.checkObjectId = (objectId) => (req, res, next) => {
  objectId = req.params.rentalId || req.params.bookingID;
  if (!mongoose.Types.ObjectId.isValid(objectId))
    return res.status(404).send({
      title: 'Invalid ID',
      details: `Resource with the given ID (${objectId}) not found`,
    });
  next();
};

/**
 * @description This middleware checks if the user is the actual owner of the rental
 */
exports.checkIfUserIsOwnerOfRental = async (req, res, next) => {
  // get currently logged in user from the locals
  const { user } = res.locals;
  // get rental from the request body
  const { rental } = req.body;
  // find rental
  await Rental.findById(rental)
    .populate('owner')
    .exec((err, foundRental) => {
      if (err) {
        return res.databaseError(err);
      }
      // check if rental owner Id is same as logged in user id
      if (user.id === foundRental.owner.id) {
        return res.handleApiError({
          title: 'Not allowed',
          detail: 'You can not create a booking on your own rental',
        });
      }
      next();
    });
};
