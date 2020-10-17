const express = require('express');
const mongoose = require('mongoose');
const { mongoDB } = require('../config');
const Customers = require('../Models/CustModel');
const bcrypt = require('bcrypt');

const router = express.Router();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

// eslint-disable-next-line no-unused-vars
mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});

// get all customers
router.get('/', (req, res) => {
  console.log('Hit customers');
  res.send('Get all customers');
});

// signup
router.post('/signup', (request, response) => {
  console.log('\nEndpoint POST: customer signup');
  console.log('Req Body: ', request.body);

  response.send('Customer signup');
});

module.exports = router;
