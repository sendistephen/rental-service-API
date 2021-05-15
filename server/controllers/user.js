const JWT = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const _ = require('lodash');
const User = require('../models/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = (req, res) => {
  const { firstname, lastname, email, phone, password } = req.body;

  // check for email and password validation
  if (!email || !password) {
    return res.handleApiError({
      title: 'Missing fields',
      detail: 'Email or password is required',
    });
  }
  // check if email already exists in db
  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return res.databaseError(err);
    }
    if (foundUser) {
      return res.handleApiError({
        title: 'Incorrect email',
        detail: 'Email already in use!',
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

exports.activateAccount = (req, res) => {
  // get token sent to user in req.body
  const { token } = req.body;

  if (token) {
    JWT.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.handleApiError({
          status: 401,
          title: 'Invalid token',
          detail: 'Token is invalid, please signup again',
        });
      }
      // get user data from decodedToken
      const { firstname, lastname, email, phone, password } = decodedToken;

      // check if user exists with the given email
      User.findOne({ email }, (err, foundUser) => {
        if (err) return res.databaseError(err);

        if (foundUser) {
          return res.handleApiError({
            status: 401,
            title: 'Account verified',
            detail: 'Account already verified. Please login',
          });
        }

        // save user
        const user = new User({ firstname, lastname, email, phone, password });

        user.save((err) => {
          if (err) {
            return res.databaseError(err);
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

exports.signin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    if (!email || !password) {
      return res.handleApiError({
        title: 'Missing fields',
        detail: 'Email or password is required',
      });
    }
  }
  // check if user exists by email
  User.findOne({ email }, (err, foundUser) => {
    if (err) {
      return res.databaseError(err);
    }
    if (!foundUser) {
      return res.handleApiError({
        title: 'Incorrect email',
        detail: 'User with that email does not exist, Please signup',
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
    return res.handleApiError({
      title: 'Invalid password',
      detail: 'Password is incorrect,please enter correct password',
    });
  });
};

exports.forgetPassword = (req, res) => {
  // find if user exists with given email
  // generate token
  // send email link to for using to reset token
  // populate user doc on the restPasswordToken with token
  const { email } = req.body;
  User.findOne({ email }, (err, foundUser) => {
    if (err || !foundUser) {
      return res.handleApiError({
        title: 'No account found',
        detail: 'There’s no Account with the info you provided.',
      });
    }
    const token = JWT.sign({ _id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: 30,
    });

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Password reset link ',
      html: `
        <p>Dear <strong>${foundUser.firstname} ${foundUser.lastname}</strong></p>
        <p>Please click on this <strong><a target="_" href="${process.env.CLIENT_URL}/auth/password/reset/${token}">link</a></strong> reset your password</p>
        <p>Thanks and Regards</p>
        <p>Support Team</p>
      `,
    };

    return foundUser.updateOne({ resetPasswordToken: token }, (err) => {
      if (err) {
        return res.databaseError(err);
      }
      sgMail
        .send(msg)
        .then(() =>
          res.status(200).json({
            success: true,
            message: `Email has been sent to ${email}, please follow the instructions to reset your password`,
          })
        )
        .catch((error) => console.log(error));
    });
  });
};

exports.resetPassword = (req, res) => {
  // get reset token and new password from user
  // verify token
  // update with new data
  // save new data
  const { resetPasswordToken, newPassword } = req.body;
  if (resetPasswordToken) {
    JWT.verify(resetPasswordToken, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.handleApiError({
          status: 401,
          title: 'Invalid token',
          detail: 'Token is invalid, please try again',
        });
      }
      User.findOne({ resetPasswordToken }, (err, user) => {
        if (err || !user) {
          return res.databaseError(err);
        }
        const updatedInfo = {
          password: newPassword,
          resetPasswordToken: '',
        };
        // modify user doc
        user = _.extend(user, updatedInfo);
        // save user
        user.save((err) => {
          if (err) {
            return res.databaseError(err);
          }
          return res.json({
            title: 'Success',
            detail: 'Congrats, You can now login with your new password',
          });
        });
      });
    });
  }
};

exports.getUser = (req, res) => {
  const userParamsID = req.params.id;
  // get user from res.locals variable
  const { user } = res.locals;
  // compare if is authenticated user
  if (userParamsID === user.id) {
    // get user from the database
    User.findById(userParamsID)
      .select('-password')
      .exec((err, foundUser) => {
        if (err) {
          return res.handleApiError({
            title: 'Invalid ID',
            detail: 'User with that ID not found',
          });
        }
        if (foundUser) {
          return res.json(foundUser);
        }
      });
  } else {
    return res.handleApiError({
      title: 'Invalid ID',
      detail: 'User with that ID not found',
    });
  }
};
