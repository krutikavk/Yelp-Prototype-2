const express = require('express');
const mongoose = require('mongoose');
const { mongoDB } = require('../Utils/config');
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
router.post('/', (request, response) => {
  console.log('\nEndpoint POST: customer signup');
  console.log('Req Body: ', request.body);

  const newCustomer = new Customers({
    cemail: request.body.cemail,
    cpassword: request.body.cpassword,
    cname: request.body.cname,
  });

  Customers.findOne({ cemail: request.body.cemail }, (error, customer) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding customer');
      response.end('Error in finding customer');
    } else if (customer) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Book ID already exists');
      response.end('Book ID already exists');
    } else {
      newCustomer.save((err, data) => {
        if (err) {
          response.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          console.log('Error in saving new customer');
          response.end('Error in saving new customer');
        } else {
          response.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          console.log('Successfully added customer to database');
          response.end('Successfully added customer to database');
        }
      });
    }
  });
});

module.exports = router;
