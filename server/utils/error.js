module.exports = {
  mongoErrors: function (errors) {
    const errorsArr = [];

    for (const property in errors) {
      if (errors.hasOwnProperty(property)) {
        errorsArr.push({
          title: property,
          detail: errors[property].message,
        });
      }
    }
    return errorsArr;
  },
};
