const User = require('../models/user');

exports.register = async (req, res) => {
  const { username, firstname, surname, phone, email, password } = req.body;

  // validate user inputs
  if (!username.trim()) {
    return res.status(422).json({
      error: {
        username: 'is required',
        message: 'Username is required',
      },
    });
  }
  if (!firstname.trim()) {
    return res.status(422).json({
      error: {
        firstname: 'is required',
        message: 'Firstname is required',
      },
    });
  }
  if (!surname.trim()) {
    return res.status(422).json({
      error: {
        surname: 'is required',
        message: 'Surname is required',
      },
    });
  }
  if (!phone.trim()) {
    return res.status(422).json({
      error: {
        phone: 'is required',
        message: 'Phone number is required',
      },
    });
  }
  if (!password.trim()) {
    return res.status(422).json({
      error: {
        password: 'is required',
        message: 'Password is required',
      },
    });
  }
  const user = new User({
    username,
    firstname,
    surname,
    phone,
    email,
    password,
  });
  await user.save((err, result) => {
    if (err) return res.status(422).json({ err });
    return res
      .status(201)
      .send({ message: 'Registration successfull!', result });
  });
};
