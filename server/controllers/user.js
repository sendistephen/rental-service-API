const JWT = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
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
  await User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return res.status(422).send({ errors: mongoErrors(err.errors) });
    }
    if (foundUser) {
      return res.status(422).send({
        errors: [{ title: 'Incorrect email', detail: 'Email already in use!' }],
      });
    }

    // User doesnot exits, now generate token
    const token = JWT.sign(
      {
        firstname,
        lastname,
        email,
        phone,
        password,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1hr' }
    );
    /**
     * send email to user to activate account with the generate token
     * setup email data
     */
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Rental Services Account Verification ',
      html: `
        <p>Dear <strong>${firstname} ${lastname}</strong></p>
        <p>We thank you for registering with Rental Services and welcome you
        to our platform where you gonna find beautiful and affordable rentals to rent.</p>
        <p>Please click on this <strong><a target="_" href="${process.env.CLIENT_URL}/auth/activate/${token}">link</a></strong> to activate your account and start searching for your favourite rentals.</p>
        <p>Thanks and Regards</p>
        <p>Support Team</p>
      `,
    };
    sgMail
      .send(msg)
      .then(() =>
        res.status(200).json({
          success: true,
          message: `Email has been sent to ${email}, please check your email to activate account`,
        })
      )
      .catch((error) => console.log(error));
  });
};

exports.activateAccount = async (req, res) => {
  // get token sent to user in req.body
  const { token } = req.body;

  if (token) {
    JWT.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({
          errors: [
            {
              title: 'Invalid token',
              detail: 'Token is invalid, please signup again',
            },
          ],
        });
      }
      // get user data from decodedToken
      const { firstname, lastname, email, phone, password } = decodedToken;

      // check if user exists with the given email
      User.findOne({ email }, (err, foundUser) => {
        if (err)
          return res.status(422).send({ errors: mongoErrors(err.errors) });

        if (foundUser) {
          return res.status(422).send({
            errors: [
              {
                title: 'Account verified',
                detail: 'Account already verified. Please login',
              },
            ],
          });
        }

        // save user
        const user = new User({ firstname, lastname, email, phone, password });

        user.save((err) => {
          if (err) {
            return res.status(422).send({ errors: mongoErrors(err.errors) });
          }
          return res.json({
            success: true,
            message: 'Registration successful!',
          });
        });
      });
    });
  }
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
