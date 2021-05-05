const express = require('express');
const { config } = require('dotenv');
const dbConnection = require('./config/database');

// configure dotenv
config();

// connect to database
dbConnection();

const app = express();

// home route
app.get('/', (req, res) =>
  res.status(200).send({ status: 200, message: 'Welcome to Rental Service!' })
);

// listen to port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server runing on port ${port}`));
