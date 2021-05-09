const JWT = require('jsonwebtoken');
const User = require('../models/user');

const { mongoErrors } = require('../utils/error');

exports.register = async (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  // check for email and password validation
  if (!email || !password) {
    return res.status(422).send({
      errors: [
        { title: 'Missing fields', detail: 'Email or password is required' },
      ],
    });
  }
  // check if email already exists in db
  await User.findOne({ email }, (err, emailExists) => {
    if (err) {
      return res.status(422).send({ errors: mongoErrors(err.errors) });
    }
    if (emailExists) {
      return res.status(422).send({
        errors: [{ title: 'Incorrect email', detail: 'Email already in use!' }],
      });
    }

    const user = new User({ firstname, lastname, email, phone, password });
    // save user
    user.save((err, result) => {
      if (err) {
        return res.status(422).send({ errors: mongoErrors(err.errors) });
      }
      return res.json({ success: true, message: 'Registration successful!' });
    });
  });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    if (!email || !password) {
      return res.status(422).send({
        errors: [
          { title: 'Missing fields', detail: 'Email or password is required' },
        ],
      });
    }
  }
  // check if user exists by email
  await User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return res.status(422).send({ errors: mongoErrors(err.errors) });
    }
    if (!foundUser) {
      return res.status(422).send({
        errors: [
          {
            title: 'Incorrect email',
            details: 'User with that email does not exist, Please signup',
          },
        ],
      });
    }
    // user exists, comapare password and generate token
    if (foundUser.verifyPassword(password)) {
      // generate JWT token
      const token = JWT.sign(
        {
          _id: foundUser._id,
          lastname: foundUser.lastname,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1hr' }
      );

      const { lastname, email, phone } = foundUser;

      return res.json({ token, user: { lastname, email, phone } });
    }
    return res.status(422).json({
      title: 'Invalid password',
      detail: 'Password is incorrect,please enter correct password',
    });
  });
};
