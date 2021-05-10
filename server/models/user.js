const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [3, 'First name is too short, minimum is 3 characters'],
    maxlength: [32, 'First name is too long, fmaximum is 32 characters'],
  },
  lastname: {
    type: String,
    required: [true, 'Last name  is required'],
    trim: true,
    minlength: [3, 'Last name too short, minimum is 3 characters'],
    maxlength: [32, 'Last name too long, maximum is 32 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ],
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required!'],
    minlength: [
      6,
      "Your password is too short so it won't protect your account very well. Please enter at least 6 characters.",
    ],
    maxlength: [32, 'Password is too long, Maximum is 32 characters'],
  },
  salt: {
    type: String,
  },
  resetPasswordToken: {
    data: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// encrypt password before saving it to the database
userSchema.pre('save', function (next) {
  const user = this;
  //   generate salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    // hansh password
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      // Store hash in your password DB.
      user.password = hash;
      next();
    });
  });
});

// Load hash from your password DB to compare.
userSchema.methods.verifyPassword = function (plainTextPassword) {
  return bcrypt.compareSync(plainTextPassword, this.password);
};
module.exports = model('User', userSchema);
