/* eslint-disable guard-for-in */

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
