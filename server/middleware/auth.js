const JWT = require('jsonwebtoken');
const User = require('../models/user');

function notAuthorized(res) {
  return res.status(401).json({
    errors: [
      {
        title: 'Not Authorized',
        details: 'No access, You need to login to get access!',
      },
    ],
  });
}
function parseToken(token) {
  // split token and access token at position 1
  return JWT.verify(token.split(' ')[1], process.env.JWT_SECRET) || null;
}

exports.authorized = (req, res, next) => {
  // get token from header
  const token = req.headers.authorization;

  //   check if the token is valid
  if (token) {
    //   token is valid -> parse token and get decoded user info
    const decoded = parseToken(token);

    if (!decoded) return notAuthorized(res);

    // find user
    User.findById(decoded._id, (err, foundUser) => {
      if (err) {
        return res.status(401).json({
          errors: [
            {
              title: 'Database error',
              details: 'Oops, Something went wrong!',
            },
          ],
        });
      }
      if (foundUser) {
        //   create a user local variable in the res object that will be available in the view rendered during response cycle
        res.locals.user = foundUser;
        next();
      }
    });
  } else {
    //   token is invalid
    return notAuthorized(res);
  }
};
