const express = require('express');
const { config } = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./config/database');
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

// define application routes
app.use('/api/v1', require('./routes/user'));

// home route
app.get('/', (req, res) =>
  res.status(200).send({ status: 200, message: 'Welcome to Rental Service!' })
);

// for un handled routes
app.all('*', (req, res, next) =>
  res.status(404).json({
    status: 'Fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  })
);

// listen to port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server runing on port ${port}`));
