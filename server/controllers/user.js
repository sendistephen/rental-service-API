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
