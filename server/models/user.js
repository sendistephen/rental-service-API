const mongoose = require('mongoose');
const {
  isLength,
  isEmail,
  isStrongPassword,
  isMobilePhone,
} = require('validator');
const bcrypt = require('bcrypt');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
    validate: [
      isLength,
      { min: 3, max: 32 },
      'Username must be atleast 3 characters!',
    ],
  },
  firstname: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    validate: [
      isLength,
      { min: 3, max: 32 },
      'Firstname must be atleast 3 characters!',
    ],
  },
  surname: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    validate: [
      isLength,
      { min: 3, max: 32 },
      'Surname must be atleast 3 characters!',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required!'],
    validate: [isMobilePhone, 'Must provid a valid phone number!'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required!'],
    validate: [isEmail, 'Email is invalid!'],
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required!'],
    validate: [isStrongPassword, 'Password is weak!'],
  },
  salt: {
    type: String,
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
userSchema.methods.verifyPassword = function (plainTextPassword, callback) {
  bcrypt.compare(plainTextPassword, this.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};
module.exports = model('User', userSchema);
