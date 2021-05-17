const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./config/database');
const { errorHandler } = require('./middleware');

// configure dotenv
config();

// connect to database
dbConnection();

const app = express();

// initialize middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ extended: false }));
app.use(cors());
// error handler middleware
app.use(errorHandler);

// define application routes
app.use('/api/v1/users', require('./routes/user'));
app.use('/api/v1/rentals', require('./routes/rental'));
app.use('/api/v1/bookings', require('./routes/booking'));
app.use('/api/v1/image-upload', require('./routes/image-upload'));

// home route
app.get('/', (req, res) =>
  res.status(200).send({ status: 200, message: 'Welcome to Rental Service!' })
);

// listen to port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server runing on port ${port}`));
